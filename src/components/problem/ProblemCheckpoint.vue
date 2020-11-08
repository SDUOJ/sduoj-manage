<template>
  <div>
    <div class="checkpointtable">
      <span>Case Checkpoints</span>
      <Table
        stripe
        draggable
        class="list_div"
        :columns="caseColumns"
        :data="caseCheckpoints"
        :max-height="600"
        :loading="loading"
        @on-drag-drop="onCaseTableDrag">
        <template slot="drag">
          <Icon type="ios-menu-outline"/>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Tag>{{ `Case ${row.caseIndex + 1}` }}</Tag>
          <Divider type="vertical" />
          <Tooltip content="Cancel" placement="right">
            <span class="hover" @click="setCaseCheckpoint(row.checkpointId, false)"><Icon type="md-remove" color="#19be6b" /></span>
          </Tooltip>
        </template>
      </Table>
    </div>

    <div class="checkpointtable">
      <span>Total Checkpoints</span>
      <Table
        stripe
        draggable
        class="list_div"
        :columns="totalColumns"
        :data="totalCheckpoints"
        :max-height="600"
        :loading="loading"
        @on-cell-click="onPreview"
        @on-drag-drop="onTotalTableDrag"
        @on-selection-change="onTableSelect">
        <template slot="drag">
          <Icon type="ios-menu-outline"/>
        </template>
        <template slot-scope="{ row }" slot="checkpointId">
          <span class="hover" style="margin-right: 10px">{{ row.checkpointId }}</span>
        </template>
        <template slot-scope="{ index }" slot="score">
          <Input style="width: 100px" v-model.number="totalCheckpoints[index].checkpointScore" />
        </template>
        <template slot-scope="{ row }" slot="actions">
          <span class="hover" @click="onDownload([row])"><Icon type="md-download" color="#2d8cf0"/></span>
          <Divider type="vertical" />
          <Poptip
            transfer
            confirm
            :title="`Delete ${row.checkpointId} ?`"
            @on-ok="onDeleteCheckpoints([row])">
            <span class="hover"><Icon type="md-trash" color="#ed4014"/></span>
          </Poptip>
          <Divider type="vertical" />
          <Tag v-if="isCase(row)">{{ `Case ${row.caseIndex + 1}` }}</Tag>
          <template v-else>
            <Tooltip v-if="row.inputSize < 1024 && row.outputSize < 1024" content="Set Case" placement="right">
              <span class="hover" @click="setCaseCheckpoint(row.checkpointId, true)"><Icon type="md-add" color="#19be6b" /></span>
            </Tooltip>
            <Tooltip v-else content="Too large" placement="right">
              <span><Icon type="md-add" disabled color="#c5c8ce"/></span>
            </Tooltip>
          </template>
        </template>
      </Table>
      <div class="clearfix" style="margin-top: 10px">
        <div style="float: left;">
          <ButtonGroup>
            <Button
              type="primary"
              :loading="downloadLoading"
              @click="onDownload(selectedCheckpoints)">
              Batch download
            </Button>
            <Button
              type="error"
              @click="onDeleteCheckpoints(selectedCheckpoints)">
              Batch delete
            </Button>
            <Button
              @click="uploadModal=true">
              Uploads
            </Button>
          </ButtonGroup>
        </div>
        <div style="float: right">
          <div class="clearfix">
            <Button style="float: right" type="primary" @click="setScores($refs.totalScore.currentValue)">Average</Button>
            <Input style="width: 100px; margin-right: 10px; float: right" @on-enter="setScores($refs.totalScore.currentValue)" ref="totalScore" placeholder="Sum score"/>
          </div>
          <div style="color: #ccc;">You can set average score for each checkpoint</div>
        </div>
      </div>
    </div>

    <!--    upload modal-->
    <Modal
      title="Batch Upload"
      v-model="uploadModal"
      width="30%"
      :loading="true"
      @on-ok="onCheckpointUpload">
      <CheckpointsUpload ref="CheckpointsUpload"/>
    </Modal>

    <Modal
      title="Checkpoint Preview"
      v-model="previewModal"
      width="30%"
      :loading="true"
      @on-ok="onCheckpointUpdate">
      <CheckpointPreview ref="CheckpointPreview"/>
    </Modal>
  </div>
</template>

<script>
import CheckpointsUpload from './checkpoints/CheckpointsUpload';
import CheckpointPreview from './checkpoints/CheckpointPreview';
import api from '_u/api';

export default {
  name: 'CheckpointList',
  components: {
    CheckpointsUpload,
    CheckpointPreview
  },
  data: function () {
    return {
      totalColumns: [
        { slot: 'drag', title: ' ', maxWidth: 30 },
        { type: 'selection', width: 53 },
        { key: 'checkpointId', slot: 'checkpointId' },
        { title: 'Input Preview', key: 'inputPreview', className: 'hover', tooltip: true },
        { title: 'Output Preview', key: 'outputPreview', className: 'hover', tooltip: true },
        {
          title: 'Input file',
          render: (h, params) => h('span', params.row.inputFilename || '')
        },
        {
          title: 'Output file',
          render: (h, params) => h('span', params.row.outputFilename || '')
        },
        {
          title: 'Upload Time',
          key: 'gmtCreate',
          render: (h, params) => h('Time', {
            props: {
              time: parseInt(params.row.gmtCreate),
              type: 'datetime'
            }
          })
        },
        {
          title: 'Score',
          slot: 'score',
          renderHeader: h => {
            let totScore = 0;
            this.totalCheckpoints.forEach(checkpoint => (totScore += checkpoint.checkpointScore || 0));
            return h('span', `Score (${totScore})`);
          }
        },
        { title: 'Actions', slot: 'actions' }
      ],
      caseColumns: [
        { slot: 'drag', title: ' ', maxWidth: 30 },
        { key: 'checkpointId' },
        { title: 'Input Preview', key: 'inputPreview', tooltip: true },
        { title: 'Output Preview', key: 'outputPreview', tooltip: true },
        {
          title: 'Input file',
          render: (h, params) => h('span', params.row.inputFilename === null ? '' : params.row.inputFilename)
        },
        {
          title: 'Output file',
          render: (h, params) => h('span', params.row.outputFilename === null ? '' : params.row.outputFilename)
        },
        {
          title: 'Upload Time',
          key: 'gmtCreate',
          render: (h, params) => h('Time', {
            props: {
              time: parseInt(params.row.gmtCreate),
              type: 'datetime'
            }
          })
        },
        { title: 'Actions', slot: 'actions' }
      ],
      uploadModal: false,
      previewModal: false,
      loading: false,
      downloadLoading: false,
      totalCheckpoints: [],
      selectedCheckpoints: [],
      checkpointQuery: {},
      totalScore: '',
      problemCode: ''
    }
  },
  computed: {
    caseCheckpoints: function() {
      const arr = this.totalCheckpoints.filter(checkpoint => this.isCase(checkpoint));
      arr.sort((a, b) => a.caseIndex - b.caseIndex);
      for (let i = 0; i < arr.length; ++i) {
        arr[i].caseIndex = i;
      }
      return arr;
    }
  },
  methods: {
    isCase: function(checkpoint) {
      return checkpoint.caseIndex !== null && checkpoint.caseIndex !== undefined;
    },
    setCaseCheckpoint: function(checkpointId, state) {
      for (let i = 0; i < this.totalCheckpoints.length; ++i) {
        if (this.totalCheckpoints[i].checkpointId === checkpointId) {
          this.$set(this.totalCheckpoints[i], 'caseIndex', state ? this.caseCheckpoints.length : null);
          return;
        }
      }
    },
    onTotalTableDrag: function (from, to) {
      from = parseInt(from);
      to = parseInt(to);
      const tmp = { ...this.totalCheckpoints[from] };
      if (from > to) {
        for (let i = from - 1; i >= to; --i) {
          this.$set(this.totalCheckpoints, i + 1, this.totalCheckpoints[i]);
        }
      } else {
        for (let i = from + 1; i <= to; ++i) {
          this.$set(this.totalCheckpoints, i - 1, this.totalCheckpoints[i]);
        }
      }
      this.$set(this.totalCheckpoints, to, tmp);
    },
    onCaseTableDrag: function (from, to) {
      from = parseInt(from);
      to = parseInt(to);
      console.log(from, to);
      let caseCheckpointsIndex = [];
      this.totalCheckpoints.forEach((o, i) => {
        if (this.isCase(o)) {
          caseCheckpointsIndex.push({ ...o, index: i });
        }
      });
      caseCheckpointsIndex.sort((a, b) => a.caseIndex - b.caseIndex);
      caseCheckpointsIndex = caseCheckpointsIndex.map(o => o.index);
      this.$set(this.totalCheckpoints[caseCheckpointsIndex[from]], 'caseIndex', to);
      if (from > to) {
        for (let i = from - 1; i >= to; --i) {
          this.$set(this.totalCheckpoints[caseCheckpointsIndex[i]], 'caseIndex', i + 1);
        }
      } else {
        for (let i = from + 1; i <= to; ++i) {
          this.$set(this.totalCheckpoints[caseCheckpointsIndex[i]], 'caseIndex', i - 1);
        }
      }
    },
    onTableSelect: function (selection) {
      this.selectedCheckpoints = selection;
    },
    onDeleteCheckpoints: function (checkpoints) {
      const checkpointIds = checkpoints.map(o => o.checkpointId);
      const len = this.totalCheckpoints.length;
      for (let i = len - 1; i >= 0; --i) {
        if (checkpointIds.includes(this.totalCheckpoints[i].checkpointId)) {
          this.totalCheckpoints.splice(i, 1);
        }
      }
    },
    onCheckpointUpload: function () {
      this.$refs.CheckpointsUpload.save((uploadCheckpoints) => {
        this.totalCheckpoints = this.totalCheckpoints.concat(uploadCheckpoints);
      }, () => {
        this.uploadModal = false;
      })
    },
    onDownload: function (checkpoints) {
      if (checkpoints.length === 0) {
        return;
      }
      const data = [];
      checkpoints.forEach(item => {
        data.push({
          id: item.inputFileId,
          downloadFilename: `${item.checkpointId}.in`
        });
        data.push({
          id: item.outputFileId,
          downloadFilename: `${item.checkpointId}.out`
        });
      })
      this.downloadLoading = true;

      api.zipDownload(data)
        .catch(err => (this.$Message.error(err.message)))
        .finally(() => (this.downloadLoading = false));
    },
    onCheckpointUpdate: function () {
      this.$refs.CheckpointPreview.save((oldCheckpointId, newCheckpoint) => {
        for (let i = 0; i < this.totalCheckpoints.length; ++i) {
          if (this.totalCheckpoints[i].checkpointId === oldCheckpointId) {
            newCheckpoint.checkpointScore = this.totalCheckpoints[i].checkpointScore;
            newCheckpoint.caseIndex = this.totalCheckpoints[i].caseIndex;
            this.totalCheckpoints.splice(i, 1, newCheckpoint);
            return;
          }
        }
        throw new Error('No such checkpoint: ' + oldCheckpointId);
      }, () => {
        this.previewModal = false;
      });
    },
    onPreview: function (row, column) {
      if (!['checkpointId', 'inputPreview', 'outputPreview'].includes(column.key)) {
        return;
      }
      const checkpointId = row.checkpointId;
      api.getCheckpointPreview(checkpointId).then(ret => {
        this.$refs.CheckpointPreview.set(ret);
        this.previewModal = true;
      });
    },
    setScores: function (score) {
      score = parseInt(score);
      // 平均分向下取整
      const each = parseInt(parseInt(score) / this.totalCheckpoints.length);
      for (let i = 0; i < this.totalCheckpoints.length; ++i) {
        this.$set(this.totalCheckpoints[i], 'checkpointScore', each);
        score -= each;
      }
      for (let i = this.totalCheckpoints.length - 1; i >= 0 && score > 0; --i) {
        this.$set(this.totalCheckpoints[i], 'checkpointScore', this.totalCheckpoints[i].checkpointScore + 1);
        score--;
      }
    },
    query: function(problemCode) {
      this.problemCode = problemCode;
      this.loading = true;
      api.getCheckpointList(problemCode).then(ret => {
        this.totalCheckpoints = [...ret];
      }).finally(() => {
        this.loading = false;
      });
    },
    save: function (onSuccess, onError, onFinally) {
      const checkpoints = this.totalCheckpoints.map(o => {
        return {
          checkpointId: o.checkpointId,
          checkpointScore: o.checkpointScore
        }
      })
      let allScoreSet = true;
      checkpoints.forEach((o, i) => {
        if (o.checkpointScore === undefined || o.checkpointScore === null) {
          this.$Message.error(`Set score for checkpoint #${i}`);
          allScoreSet = false;
        }
      });
      if (allScoreSet === true) {
        api.updateProblemCheckpoints({
          problemCode: this.problemCode,
          checkpointCases: this.caseCheckpoints.map(item => item.checkpointId),
          checkpoints
        }).then(_ => {
          this.$Message.success('Updated');
          if (onSuccess) {
            onSuccess();
          }
        }, onError)
          .finally(onFinally);
      } else {
        if (onError) {
          onError();
        }
      }
    }
  }
}
</script>

<style scoped>
  .checkpointtable {
    margin: 20px 0;
  }
</style>
