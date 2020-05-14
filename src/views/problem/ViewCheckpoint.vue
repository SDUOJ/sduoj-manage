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
        >保存
        </el-button>
      </div>
      <div style="float: right;">
        <el-button
            @click="batchUploadDialogVisible=true"
            icon="el-icon-upload2"
            style="margin-left: 10px;"
        >批量上传
        </el-button>
      </div>
      <div style="float: right;">
        <el-button
            @click="SingleUploadDialogVisible=true"
            icon="el-icon-upload2"
            style="margin-left: 10px;"
        >单组上传
        </el-button>
      </div>
      <div style="float: right;">
        <el-input
            placeholder="请输入关键字搜索"
            style="width: 200px;"
            v-model="search"
        />
      </div>
    </div>
    <!-- 批量上传 -->
    <el-dialog :visible.sync="batchUploadDialogVisible" title="批量上传" width="30%">
      <BatchUpload @upload="handleUpload"/>
      <span slot="footer">
        <el-button @click="batchUploadDialogVisible = false">返 回</el-button>
      </span>
    </el-dialog>
    <!--  -->

    <!-- 单文件上传 -->
    <el-dialog :visible.sync="SingleUploadDialogVisible" title="单点上传" width="30%">
      <SingleUpload @upload="handleUpload"/>
      <span slot="footer">
        <el-button @click="SingleUploadDialogVisible = false">返 回</el-button>
      </span>
    </el-dialog>
    <!--  -->

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
        class="list_div"
        fit
        highlight-current-row
        stripe
    >
      <el-table-column align="center" label="ID" min-width="15%" prop="checkpointId"></el-table-column>
      <el-table-column align="center" label="标准输入" min-width="40%">
        <template slot-scope="scope">
          <el-tooltip
              :content="scope.row.inputDescription + ' [' + scope.row.inputSize + ' B]'"
              class="item"
              effect="dark"
              placement="right"
              style="cursor: pointer;"
          >
            <span>{{ scope.row.inputFileName === null ? "null" : scope.row.inputFileName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标准输出" min-width="40%">
        <template slot-scope="scope">
          <el-tooltip
              :content="scope.row.outputDescription + ' [' + scope.row.outputSize + ' B]'"
              class="item"
              effect="dark"
              placement="right"
              style="cursor: pointer;"
          >
            <span>{{ scope.row.outputFileName === null ? "null" : scope.row.outputFileName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="20%">
        <template slot-scope="scope">
          <el-popconfirm
              :title="'删除' + scope.row.checkpointId + '?'"
              @onConfirm="tableData.splice(scope.$index, 1)"
              cancelButtonText="否"
              confirmButtonText="是"
              confirmButtonType="danger"
              icon="el-icon-info"
              iconColor="red"
          >
            <el-button size="mini" slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import BatchUpload from "@/components/checkpoints/BatchUpload.vue";
  import SingleUpload from "@/components/checkpoints/SingleUpload.vue";
  import {post} from "@/api.js";
  import Vue from "vue";
  import Sortable from "sortablejs";

  export default {
    components: {BatchUpload, SingleUpload},
    data: function () {
      return {
        problemId: "",
        search: "",
        batchUploadDialogVisible: false,
        SingleUploadDialogVisible: false,
        tableData: [],
      };
    },
    methods: {
      initTable() {
        let that = this;
        new Sortable(document.querySelector('.el-table__body-wrapper tbody'), {
          sort: true,
          animation: 300,
          onEnd: function (evt) {  //拖拽结束发生该事件
            that.tableData.splice(evt.newIndex, 0, that.tableData.splice(evt.oldIndex, 1)[0]);
            const newArray = that.tableData.slice(0);
            that.tableData = [];
            that.$nextTick(function () {
              that.tableData = newArray;
            });
          },
        });
      },
      // TODO: 保存编辑后的数据并上传
      handleSave() {
        console.log(this.tableData);
      },
      handleUpload(uploadCheckpoints) {
        this.tableData = this.tableData.concat(uploadCheckpoints)
      },
      // TODO: 下载数据点
      handleDownload(checkpointid) {

      },
      async fetchProblemCheckpoints() {
        try {
          this.tableData = await post("/manage/checkpoint/list", {problemId: this.problemId});
        } catch (err) {
          Vue.prototype.$error(err);
        }
        this.tableData = [{
          "checkpointId": 35041302416474110,
          "inputDescription": "111111111111121212121321321321",
          "outputDescription": "111111111111121212121321321321",
          "inputSize": 30,
          "outputSize": 30,
          "inputFileName": "1.in",
          "outputFileName": "1.out"
        }, {
          "checkpointId": 35041302445834240,
          "inputDescription": "111111111111121212121321321321",
          "outputDescription": "111111111111121212121321321321",
          "inputSize": 30,
          "outputSize": 30,
          "inputFileName": "2.in",
          "outputFileName": "2.out"
        }, {
          "checkpointId": 35041302475194370,
          "inputDescription": "111111111111121212121321321321",
          "outputDescription": "111111111111121212121321321321",
          "inputSize": 30,
          "outputSize": 30,
          "inputFileName": "3.in",
          "outputFileName": "3.out"
        }];
      },
    },
    mounted() {
      Vue.prototype.$warning("编辑以后请注意保存");
      this.problemId = this.$route.params.pid;
      this.fetchProblemCheckpoints();
      this.initTable();
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