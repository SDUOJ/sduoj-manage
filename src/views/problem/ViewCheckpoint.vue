<template>
  <div>
    <el-page-header :content="'检查点 P' + problemId" @back="$router.go(-1)"></el-page-header>
    <div class="clear">
      <div style="float: right;">
        <el-button
          @click="handleSave"
          icon="el-icon-check"
          style="margin-left: 10px;"
          type="success"
        >保存</el-button>
      </div>
      <div style="float: right;">
        <el-button
          @click="uploadDialogVisible=true"
          icon="el-icon-upload2"
          style="margin-left: 10px;"
        >上传</el-button>
      </div>
      <div style="float: right;">
        <el-input placeholder="请输入关键字搜索" style="width: 200px;" v-model="search" />
      </div>
    </div>
    <!-- 上传 -->
    <el-dialog :visible.sync="uploadDialogVisible" destroy-on-close title="批量上传" width="30%">
      <CheckpointUpload @upload="handleUpload" />
      <span slot="footer">
        <el-button @click="uploadDialogVisible = false">返 回</el-button>
      </span>
    </el-dialog>
    <!--  -->

    <el-dialog :visible.sync="previewVisible" title="查看检查点" v-loading="loading" witdh="30%">
      <SingleUpdate :checkpoint="checkpointQuery" @update="handleUpdate" />
      <span slot="footer">
        <el-button @click="previewVisible = false">返 回</el-button>
      </span>
    </el-dialog>

    <el-table
      :data="
          tableData.filter(
            data =>
              !search ||
              data.checkpointId.toString().includes(search.toLowerCase()) ||
              data.inputFileName.toLowerCase().includes(search.toLowerCase()) ||
              data.inputDescription.toLowerCase().includes(search.toLowerCase()) ||
              data.outputFileName.toLowerCase().includes(search.toLowerCase()) ||
              data.outputDescription.toLowerCase().includes(search.toLowerCase())
         )"
      ref="table"
      class="list_div"
      fit
      highlight-current-row
      stripe
    >
      <el-table-column align="center" type="index" width="80"></el-table-column>
      <el-table-column label="ID" min-width="80%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="right" style="cursor: pointer;">
            <div slot="content">
              input: {{ scope.row.inputSize }} Bytes
              <br />
              {{ scope.row.inputDescription }}
              <br />
              output: {{ scope.row.outputSize }} Bytes
              <br />
              {{ scope.row.outputDescription }}
            </div>
            <span @click="handlePreview(scope.row.checkpointId)">{{ scope.row.checkpointId }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="标准输入" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.inputFileName === null ? "null" : scope.row.inputFileName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准输出" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.outputFileName === null ? "null" : scope.row.outputFileName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="20%">
        <template slot-scope="scope">
          <el-button
            :loading="loading"
            @click="handleDownload(scope.row.checkpointId)"
            size="mini"
          >下载</el-button>
          <el-popconfirm
            :title="'删除 ' + scope.row.checkpointId + '?'"
            icon="el-icon-info"
            iconColor="red"
            @onConfirm="tableData.splice(scope.$index, 1)"
            confirmButtonType="text"
            style="margin-left: 5px;"
          >
            <el-button size="mini" slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import CheckpointUpload from "@/components/checkpoints/CheckpointUpload.vue";
import SingleUpdate from "@/components/checkpoints/SingleUpdate.vue";
import { post } from "@/api.js";
import Vue from "vue";
import Sortable from "sortablejs";
import axios from "axios";

export default {
  components: { CheckpointUpload, SingleUpdate },
  data: function() {
    return {
      problemId: "",
      search: "",
      uploadDialogVisible: false,
      previewVisible: false,
      originalTableData: [],
      tableData: [],
      checkpointQuery: {},
      loading: false
    };
  },
  methods: {
    initTable() {
      let that = this;
      new Sortable(document.querySelector(".el-table__body-wrapper tbody"), {
        sort: true,
        animation: 300,
        onEnd: function(evt) {
          //拖拽结束发生该事件
          that.tableData.splice(
            evt.newIndex,
            0,
            that.tableData.splice(evt.oldIndex, 1)[0]
          );
          const newArray = that.tableData.slice(0);
          that.tableData = [];
          that.$nextTick(function() {
            that.tableData = newArray;
            that.$refs.table.doLayout();
          });
        }
      });
    },
    // TODO: 保存编辑后的数据并上传
    handleSave() {
      console.log(this.tableData);
      Vue.prototype.$success("Saving...");
      try {
        const ret = post("/manage/problem/update", {
          problemId: this.problemId,
          checkpointIds: this.tableData.map(x => x.checkpointId)
        });
        this.originalTableData = this.tableData;
        Vue.prototype.$success("updated");
      } catch (err) {
        Vue.prototype.$error(err);
      }
    },
    handleUpload(uploadCheckpoints) {
      this.tableData = this.tableData.concat(uploadCheckpoints);
    },
    handleDownload(checkpointId) {
      this.loading = true;
      axios({
        method: "post",
        url: "/manage/checkpoint/download",
        data: [checkpointId],
        responseType: "blob"
      })
        .then(res => {
          this.loading = false;
          let blob = new Blob([res.data], {
            type: res.headers["content-type"]
          });
          let url = window.URL.createObjectURL(blob);
          let link = document.createElement("a"); // 创建a标签
          link.href = url;
          const contentDisposition = res.headers["content-disposition"];
          let fileName = checkpointId;
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
          }
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(url); // 释放内存
        })
        .catch(err => {
          this.loading = false;
          Vue.prototype.$error(err);
        });
    },
    handleUpdate(oldCheckpointId, newCheckpoint) {
      for (let i = 0; i < this.tableData.length; ++i) {
        if (this.tableData[i].checkpointId === oldCheckpointId) {
          this.tableData[i] = newCheckpoint;
          return;
        }
      }
      throw new Error("No such checkpoint: " + oldCheckpointId);
    },
    async handlePreview(checkpointId) {
      this.loading = true;
      try {
        this.checkpointQuery = await post("/manage/checkpoint/query", {
          checkpointId
        });
        this.previewVisible = true;
      } catch (err) {
        Vue.prototype.$error(err);
      }
      this.loading = false;
    }
  },
  computed: {
    checkpointHasChanged: function() {
      return this.tableData !== this.originalTableData;
    }
  },
  mounted() {
    Vue.prototype.$warning("编辑以后请注意保存");
    this.problemId = this.$route.params.pid;

    post("/manage/checkpoint/list", { problemId: parseInt(this.problemId) })
      .then(ret => {
        this.originalTableData = ret;
        this.tableData = this.originalTableData;
      })
      .catch(err => {
        Vue.prototype.$error(err);
      });

    this.initTable();
  },
  beforeRouteLeave(to, from, next) {
    console.log(this);
    if (this.checkpointHasChanged) {
      // debugger
      next(false);
      this.$confirm("是否保存？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 选择确定
          this.handleSave();
          next();
        })
        .catch(() => {
          next();
        });
    } else {
      next();
    }
  }
};
</script>

<style scoped>
.list_div {
  padding: 11px;
  background-color: white;
  margin-top: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>