<template>
  <div>
    <div class="clearfix">
      <div style="float: right; margin-left: 10px;">
        <Button
          @click="onCheckpointSave"
          icon="md-checkmark"
          type="success"
        >Save</Button>
      </div>
    </div>

    <div class="checkpointtable">
      <span>Case Checkpoints</span>
      <Table
        class="list_div"
        :columns="caseColumns"
        :data="caseCheckpoints"
        :max-height="600"
        draggable
        @on-drag-drop="onCaseTableDrag"
        stripe>
        <template slot="drag">
          <Icon type="ios-menu-outline"/>
        </template>
        <template slot-scope="{ row }" slot="actions">
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
        @on-cell-click="onPreview"
        @on-drag-drop="onTotalTableDrag"
        @on-selection-change="onTableSelect">
        <template slot="drag">
          <Icon type="ios-menu-outline"/>
        </template>
        <template slot-scope="{ row }" slot="checkpointId">
          <span class="hover" style="margin-right: 10px">{{ row.checkpointId }}</span>
          <Tag v-if="row.caseIndex !== null">{{ `Case ${row.caseIndex + 1}` }}</Tag>
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
            @on-ok="onDeleteCheckpoints([row.checkpointId])">
            <span class="hover"><Icon type="md-trash" color="#ed4014"/></span>
          </Poptip>
          <Divider type="vertical" />
          <template v-if="row.caseIndex === null">
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
          <Button
            icon="md-download"
            type="primary"
            :loading="downloadLoading"
            @click="onDownload(selectedCheckpoints)" />
        </div>
        <div style="float: left; margin: 0 10px;">
          <Button
            icon="md-trash"
            @click="onDeleteCheckpoint(selectedCheckpoints)"
            type="error" />
        </div>
        <div style="float: left">
          <Button
            @click="uploadModal=true"
            icon="md-cloud-upload"/>
        </div>
        <div style="float: right">
            <Input style="width: 100px; margin-right: 10px" @on-enter="setScores($refs.totalScore.currentValue)" ref="totalScore"/>
            <Button type="primary" @click="setScores($refs.totalScore.currentValue)">Set</Button>
        </div>
      </div>
    </div>

    <!--    upload modal-->
    <Modal
      title="Batch Upload"
      v-model="uploadModal"
      :mask-closable="false"
      width="30%">
      <CheckpointsUpload @upload="onCheckpointUpload" ref="checkpointsUpload"/>
      <div slot="footer">
        <Button @click="uploadModal=false">Back</Button>
        <Button @click="$refs.checkpointsUpload.onUpload()" type="primary">Ok</Button>
      </div>
    </Modal>

    <Modal
      title="Checkpoint Preview"
      v-model="previewModal"
      :loading="previewLoading"
      :mask-closable="false"
      width="30%">
      <CheckpointPreview :checkpoint="checkpointQuery" @update="onCheckpointUpdate"/>
      <div slot="footer">
        <Button @click="previewModal=false">Back</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CheckpointsUpload from '_c/checkpoints/CheckpointsUpload';
import CheckpointPreview from '_c/checkpoints/CheckpointPreview';
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
        {
          slot: 'drag',
          title: ' ',
          maxWidth: 30,
          center: true
        },
        {
          type: 'selection',
          width: 53,
          align: 'center'
        },
        {
          key: 'checkpointId',
          slot: 'checkpointId'
        },
        {
          title: 'Input Preview',
          key: 'inputPreview',
          className: 'hover',
          tooltip: true
        },
        {
          title: 'Output Preview',
          key: 'outputPreview',
          className: 'hover',
          tooltip: true
        },
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
        {
          slot: 'drag',
          title: ' ',
          maxWidth: 30,
          center: true
        },
        {
          key: 'checkpointId'
        },
        {
          title: 'Input Preview',
          key: 'inputPreview',
          tooltip: true
        },
        {
          title: 'Output Preview',
          key: 'outputPreview',
          tooltip: true
        },
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
      previewLoading: false,
      downloadLoading: false,
      originalTableData: [],
      totalCheckpoints: [],
      selectedCheckpoints: [],
      checkpointQuery: {},
      totalScore: ''
    }
  },
  computed: {
    problemCode: function () {
      return this.$route.params.problemCode;
    },
    checkpointEqual: function () {
      if (this.totalCheckpoints === this.originalTableData) return true;
      if (this.totalCheckpoints == null || this.originalTableData == null) return false;
      if (this.totalCheckpoints.length !== this.originalTableData.length) return false;

      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.
      // Please note that calling sort on an array will modify that array.
      // you might want to clone your array first.

      for (var i = 0; i < this.originalTableData.length; ++i) {
        if (this.originalTableData[i] !== this.totalCheckpoints[i]) return false;
      }
      return true;
    },
    caseCheckpoints: function() {
      const arr = this.totalCheckpoints.filter(checkpoint => checkpoint.caseIndex !== null);
      arr.sort((a, b) => a.caseIndex - b.caseIndex);
      for (let i = 0; i < arr.length; ++i) {
        arr[i].caseIndex = i;
      }
      return arr;
    }
  },
  methods: {
    setCaseCheckpoint: function (checkpointId, state) {
      for (let i = 0; i < this.totalCheckpoints.length; ++i) {
        if (this.totalCheckpoints[i].checkpointId === checkpointId) {
          this.totalCheckpoints[i].caseIndex = state ? this.caseCheckpoints.length : null;
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
      for (let i = 0; i < this.totalCheckpoints.length; ++i) {
        if (this.totalCheckpoints[i].caseIndex === from) {
          this.$set(this.totalCheckpoints[i], 'caseIndex', to);
        }
      }
    },
    onTableSelect: function (selection) {
      this.selectedCheckpoints = selection;
    },
    onDeleteCheckpoint: function (checkpoints) {
      this.totalCheckpoints = this.totalCheckpoints.filter(item => !checkpoints.includes(item));
    },
    onCheckpointSave: function () {
      api.updateProblemCheckpoints({
        problemCode: this.problemCode,
        checkpoints: this.totalCheckpoints.map(item => {
          return {
            checkpointId: item.checkpointId,
            checkpointScore: item.checkpointScore
          }
        }),
        checkpointCases: this.caseCheckpoints.map(item => item.checkpointId)
      }).then(_ => {
        this.originalTableData = [...this.totalCheckpoints];
        this.$Message.success('Updated');
      })
    },
    onCheckpointUpload: function (uploadCheckpoints) {
      this.totalCheckpoints = this.totalCheckpoints.concat(uploadCheckpoints);
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
    onCheckpointUpdate: function (oldCheckpointId, newCheckpoint) {
      for (let i = 0; i < this.totalCheckpoints.length; ++i) {
        if (this.totalCheckpoints[i].checkpointId === oldCheckpointId) {
          newCheckpoint.checkpointScore = this.totalCheckpoints[i].checkpointScore;
          newCheckpoint.isCase = this.totalCheckpoints[i].isCase;
          this.totalCheckpoints.splice(i, 1, newCheckpoint);
          return;
        }
      }
      throw new Error('No such checkpoint: ' + oldCheckpointId);
    },
    onPreview: function (row, column) {
      if (!['checkpointId', 'inputPreview', 'outputPreview'].includes(column.key)) {
        return;
      }
      const checkpointId = row.checkpointId;
      this.previewLoading = true;
      api.getCheckpointPreview(checkpointId).then(ret => {
        this.checkpointQuery = ret;
        this.previewModal = true;
      }).finally(() => (this.previewLoading = false));
    },
    setScores: function (score) {
      score = parseInt(score);
      // 平均分向下取整
      const each = parseInt(parseInt(score) / this.totalCheckpoints.length);
      for (let i = 0; i < this.totalCheckpoints.length; ++i) {
        this.totalCheckpoints[i].checkpointScore = each;
        score -= each;
      }
      for (let i = this.totalCheckpoints.length - 1; i >= 0 && score > 0; --i) {
        this.totalCheckpoints[i].checkpointScore++;
        score--;
      }
    }
  },
  mounted: function () {
    api.getCheckpointList(this.problemCode).then(ret => {
      this.originalTableData = ret;
      this.totalCheckpoints = [...ret];
      // this.totalCheckpoints.forEach(checkpoint => {
      //   if (checkpoint.caseIndex !== null) {
      //     checkpoint.isCase = true;
      //   }
      // })
    })
  },
  beforeRouteLeave: function (to, from, next) {
    if (!this.checkpointEqual) {
      this.$Modal.confirm({
        title: 'Notice',
        content: '<p>You have modified the checkpoints, save it?</p>',
        loading: true,
        onOk: async () => {
          await this.onCheckpointSave();
          this.$Modal.remove();
          next();
        },
        onCancel: () => (next())
      });
    } else {
      next();
    }
  }
}
</script>

<style scoped>
  .checkpointtable {
    margin: 20px 0;
  }
</style>
