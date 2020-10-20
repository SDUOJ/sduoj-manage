<template>
  <div>
    <div class="clearfix">

      <div style="float: right; margin-left: 10px;">
        <Button
          @click="onCheckpointSave"
          icon="md-checkmark"
          type="success"
        >Save
        </Button>
      </div>

    </div>

    <div class="checkpointtable">
      <span>Example Checkpoints</span>
      <Table
        class="list_div"
        :columns="exampleColumns"
        :data="exampleCheckpoints"
        :max-height="600"
        draggable
        @on-drag-drop="onExampleTableDrag"
        stripe>
        <template slot="drag">
          <Icon type="ios-menu-outline"/>
        </template>
        <template slot-scope="{ row }" slot="checkpointId">
          <span @click="onPreview(row.checkpointId)" class="hover">{{ row.checkpointId }}</span>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Tooltip content="Unmark" placement="right">
            <Button
              size="small"
              icon="md-remove"
              @click="setExampleCheckpoint(row.checkpointId, false)"
            />
          </Tooltip>
        </template>
      </Table>
    </div>

    <div class="checkpointtable">
      <div class="clearfix">
        <div style="float: right; margin-left: 10px;">
          <Button
            @click="uploadModal=true"
            icon="md-cloud-upload"
          >Upload
          </Button>
        </div>
        <div style="float: right; margin-left: 10px;">
          <Button icon="md-trash" @click="onDeleteCheckpoint(selectedCheckpoints)" type="error">Deletes</Button>
        </div>
        <div style="float: right">
          <Button icon="md-download" type="primary" :loading="downloadLoading" @click="onDownload(selectedCheckpoints)">
            Downloads
          </Button>
        </div>
      </div>
      <span>Total Checkpoints</span>
      <Table
        class="list_div"
        :columns="totalColumns"
        :data="totalCheckpoints"
        :max-height="600"
        draggable
        @on-drag-drop="onTotalTableDrag"
        @on-selection-change="onTableSelect"
        stripe>
        <template slot="drag">
          <Icon type="ios-menu-outline"/>
        </template>
        <template slot-scope="{ row }" slot="checkpointId">
          <span @click="onPreview(row.checkpointId)" class="hover">{{ row.checkpointId }}</span>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button size="small" icon="md-download" type="primary" :loading="downloadLoading"
                  @click="onDownload([row])"/>
          <Poptip
            confirm
            :title="'Delete checkpoint ' + row.checkpointId + '?'"
            @on-ok="onDeleteCheckpoints([row.checkpointId])">
            <Button size="small" icon="md-trash" type="error"/>
          </Poptip>
          <Tooltip v-if="!row.isExample" content="Mark as Example" placement="right">
            <Button
              size="small"
              icon="md-add"
              @click="setExampleCheckpoint(row.checkpointId, true)"/>
          </Tooltip>
        </template>
      </Table>
    </div>

    <!--    modal-->
    <Modal
      title="Batch Upload"
      v-model="uploadModal"
      :mask-closable="false"
      width="30%"
    >
      <CheckpointsUpload @upload="onCheckpointUpload"/>
      <div slot="footer">
        <Button @click="uploadModal=false">Back</Button>
      </div>
    </Modal>

    <Modal
      title="Checkpoint Preview"
      v-model="previewModal"
      :loading="previewLoading"
      :mask-closable="false"
      width="30%"
    >
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
          slot: 'checkpointId'
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
        {
          title: 'Actions',
          slot: 'actions'
        },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }
      ],
      exampleColumns: [
        {
          slot: 'drag',
          title: ' ',
          maxWidth: 30,
          center: true
        },
        {
          slot: 'checkpointId'
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
        {
          title: 'Actions',
          slot: 'actions'
        }
      ],
      uploadModal: false,
      previewModal: false,
      previewLoading: false,
      downloadLoading: false,
      originalTableData: [],
      totalCheckpoints: [],
      exampleCheckpoints: [],
      selectedCheckpoints: [],
      checkpointQuery: {}
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
    }
  },
  methods: {
    setExampleCheckpoint: function (checkpointId, state) {
      let idx = -1;
      for (let i = 0; i < this.totalCheckpoints.length; ++i) {
        if (this.totalCheckpoints[i].checkpointId === checkpointId) {
          idx = i;
          break;
        }
      }
      if (idx === -1) {
        return;
      }
      if (state) {
        this.$set(this.totalCheckpoints[idx], 'isExample', true);
        this.exampleCheckpoints.push({ ...this.totalCheckpoints[idx] });
      } else {
        this.exampleCheckpoints = this.exampleCheckpoints.filter(item => item.checkpointId !== checkpointId);
        this.$delete(this.totalCheckpoints[idx], 'isExample');
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
    onExampleTableDrag: function (index1, index2) {
      const tmp = { ...this.exampleCheckpoints[index1] };
      this.$set(this.exampleCheckpoints, index1, { ...this.exampleCheckpoints[index2] });
      this.$set(this.exampleCheckpoints, index2, { ...tmp });
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
        checkpoints: this.totalCheckpoints.map(item => item.checkpointId)
      }).then(_ => {
        this.originalTableData = [...this.totalCheckpoints];
        this.$Message.success('Updated');
      })
    },
    onCheckpointUpload: function (uploadCheckpoints) {
      this.totalCheckpoints = this.totalCheckpoints.concat(uploadCheckpoints);
    },
    onDownload: function (checkpoints) {
      const data = [];
      checkpoints.forEach(item => {
        data.push({
          id: item.inputFileId,
          downloadFilename: item.checkpointId + '.in'
        });
        data.push({
          id: item.outputFileId,
          downloadFilename: item.checkpointId + '.out'
        });
      })
      this.downloadLoading = true;

      api.downloadCheckpoints(data)
        .then(rep => {
          console.log(rep);
          const blob = new Blob([rep.data], { type: rep.headers['content-type'] });
          const elink = document.createElement('a');
          const filename = new Date().getTime().toString();
          if ('download' in elink) {
            elink.download = filename;
            elink.href = URL.createObjectURL(blob);
            elink.click();
            URL.revokeObjectURL(elink.href);
          } else {
            navigator.msSaveBlob(blob, filename);
          }
        }, err => (this.$Message.error(err.message)))
        .finally(() => (this.downloadLoading = false));
    },
    onCheckpointUpdate: function (oldCheckpointId, newCheckpoint) {
      for (let i = 0; i < this.totalCheckpoints.length; ++i) {
        if (this.totalCheckpoints[i].checkpointId === oldCheckpointId) {
          this.totalCheckpoints[i] = newCheckpoint;
          return;
        }
      }
      throw new Error('No such checkpoint: ' + oldCheckpointId);
    },
    onPreview: function (checkpointId) {
      this.previewLoading = true;
      api.getCheckpointPreview(checkpointId).then(ret => {
        this.checkpointQuery = ret;
        this.previewModal = true;
      }).finally(() => (this.previewLoading = false));
    }
  },
  mounted: function () {
    api.getCheckpointList(this.problemCode).then(ret => {
      this.originalTableData = ret;
      this.totalCheckpoints = [...this.originalTableData];
    })
  },
  beforeRouteLeave: function (to, from, next) {
    console.log(this);
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
