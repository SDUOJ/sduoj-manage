<template>
  <div>
    <div class="pro-container" :span="20">
      <!-- 筛选框与添加按钮 -->
      <div class="filter-container clear">
        <div style="float: right;">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            icon="el-icon-plus"
            @click="createFormVisible = true"
          >新 增</el-button>
        </div>
        <div style="float: right;">
          <el-input
            placeholder="请输入关键字搜索"
            style="width: 200px;"
            class="filter-item"
            v-model="search"
          />
        </div>
      </div>
      <!--  -->

      <!-- 题目列表 -->
      <el-table
        class="problem_list_div"
        :data="tableData.filter(data => !search || data.problem_title.toLowerCase().includes(search.toLowerCase()))"
        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="problem_id" label="题号" align="center" width="160"></el-table-column>
        <el-table-column label="题目" width="auto">
          <router-link
            class="link_a"
            :to="'/problem/' + scope.row.problem_id"
            slot-scope="scope"
          >{{ scope.row.problem_title }}</router-link>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <template>
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编 辑</el-button>
            </template>
            <template>
              <el-popconfirm
                confirmButtonText="是"
                cancelButtonText="否"
                confirmButtonType="danger"
                icon="el-icon-info"
                iconColor="red"
                :title="'删除' + scope.row.problem_id + '?'"
                style="margin-left: 10px;"
                @onConfirm="handleDelete(scope.$index, scope.row)"
              >
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination_div">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="this.page_size"
          :page-count="this.page_count"
          :hide-on-single-page="true"
        />
      </div>
    </div>

    <!-- 添加题目的模态框 -->
    <el-dialog title="添加题目" :visible.sync="createFormVisible">
      <!-- 表单 -->
      <el-form :model="createProblemForm" :rules="problemProfileRules" ref="createProblemForm">
        <el-form-item label="题目名称" prop="problemTitle">
          <el-input autocomplete="off" v-model="createProblemForm.problemTitle"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时间限制" prop="timeLimit">
              <el-input
                type="number"
                size="medium"
                autocomplete="off"
                v-model="createProblemForm.timeLimit"
                onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              >
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="空间限制" prop="memoryLimit">
              <el-input
                type="number"
                size="medium"
                autocomplete="off"
                v-model="createProblemForm.memoryLimit"
              >
                <template slot="append">KiB</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="题目描述 (Markdown)" prop="problemMarkdown">
          <el-input
            type="textarea"
            :autosize="{ minRows: 20, maxRows: 100}"
            autocomplete="off"
            v-model="createProblemForm.problemMarkdown"
          ></el-input>
        </el-form-item>
        <el-form-item prop="isPublic">
          <el-switch active-text="公开" inactive-text="不公开" v-model="createProblemForm.isPublic"></el-switch>
        </el-form-item>
      </el-form>
      <!--  -->
      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="onSubmitting">确 定</el-button>
      </div>
    </el-dialog>
    <!--  -->

    <!-- 编辑题目的模态框 -->
    <el-dialog title="编辑题目" :visible.sync="editFormVisible">
      <!-- 表单 -->
      <el-form :model="problemProfile" :rules="problemProfileRules" ref="problemProfile">
        <el-form-item label="题目名称" prop="problemTitle">
          <el-input autocomplete="off" v-model="problemProfile.problemTitle"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时间限制" prop="timeLimit">
              <el-input
                type="number"
                size="medium"
                autocomplete="off"
                v-model="problemProfile.timeLimit"
              >
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="空间限制" prop="memoryLimit">
              <el-input
                type="number"
                size="medium"
                autocomplete="off"
                v-model="problemProfile.memoryLimit"
              >
                <template slot="append">KiB</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="题目描述 (Markdown)" prop="problemMarkdown">
          <el-input
            type="textarea"
            :autosize="{ minRows: 20, maxRows: 100}"
            autocomplete="off"
            v-model="problemProfile.problemMarkdown"
          ></el-input>
        </el-form-item>
        <el-form-item prop="isPublic">
          <el-switch active-text="公开" inactive-text="不公开" v-model="problemProfile.isPublic"></el-switch>
        </el-form-item>
      </el-form>
      <!--  -->
      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="onChange" :loading="onSubmitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { post } from "@/api.js";
import _ from "underscore";
export default {
  data() {
    return {
      page_now: 1,
      page_size: 50,
      page_count: 1,
      tableData: [],

      search: "",
      onSubmitting: false,
      createFormVisible: false,
      createProblemForm: {
        problemTitle: "",
        timeLimit: 1000,
        memoryLimit: 128 * 1024,
        problemMarkdown: "",
        isPublic: true
      },
      problemProfileRules: {
        problemTitle: [
          { required: true, message: "请输入题目标题", trigger: "blur" }
        ],
        timeLimit: [
          { required: true, message: "请输入时间限制", trigger: "blur" },
          { type: "number", message: "时间限制是数字", trigger: "change" }
        ],
        memoryLimit: [
          { required: true, message: "请输入空间限制", trigger: "blur" },
          { type: "number", message: "空间限制是数字", trigger: "change" }
        ],
        problemMarkdown: [
          { required: true, message: "请输入题目描述", trigger: "blur" }
        ]
      },

      editFormVisible: false,
      problemProfile: {
        problemTitle: "",
        timeLimit: 0,
        memoryLimit: 0,
        problemMarkdown: "",
        isPublic: true
      },
      tmp: {
        problemTitle: "",
        timeLimit: 0,
        memoryLimit: 0,
        problemMarkdown: "",
        isPublic: true
      }
    };
  },
  methods: {
    addProblem() {
      this.$router.push("/problem/add");
    },
    goBack() {
      this.$router.go(-1);
    },
    fetchProblemList() {
      this.tableData.push({
        problem_id: 1001,
        problem_title: "A+B Problem"
      });
      console.log("fetchProblemList");
    },
    handleEdit(index, row) {
      // 找后端要这个题的信息
      this.tmp.problemTitle = "A+B Problem";
      this.tmp.timeLimit = 1000;
      this.tmp.memoryLimit = 128 * 1024;
      this.tmp.problemMarkdown = "233333";
      this.tmp.isPublic = true;

      this.problemProfile = Object.assign({}, this.tmp);
      this.editFormVisible = true;
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    async onSubmit() {
      // 表单验证
      this.$refs["createProblemForm"].validate(valid => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
      });
      this.onSubmitting = true;
      try {
        // 往后端发post
        let ret = await post("/api/manage/problem/create", {
          problemTitle: String(this.createProblemForm.problemTitle),
          timeLimit: parseInt(this.createProblemForm.timeLimit),
          memoryLimit: parseInt(this.createProblemForm.memoryLimit),
          problemMarkdown: String(this.createProblemForm.problemMarkdown),
          isPublic: this.createProblemForm.isPublic ? 1 : 0
        });
        this.$message({
          message: "题目 " + ret.problemId + " 添加成功",
          type: "success"
        });
        this.createFormVisible = false;
        this.fetchProblemList();
      } catch (error) {
        // 失败
        console.log(error);
      }
      this.onSubmitting = false;
      return true;
    },
    async onChange() {
      // 检查有没有变化
      if (_.isEqual(this.problemProfile, this.tmp)) {
        this.editFormVisible = false;
        return true;
      }
      // 表单验证
      this.$refs["problemProfile"].validate(valid => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
      });
      this.onSubmitting = true;
      try {
        // 往后端发post
        let ret = await post("/api/manage/problem/update", this.problemProfile);
        this.$message({
          message: ret.state,
          type: "info"
        });
        this.editFormVisible = false;
        this.fetchProblemList();
      } catch (err) {
        console.log(err);
      }
      this.onSubmitting = false;
      return true;
    },
    resetForm() {
      this.$refs["createProblemForm"].resetFields();
      this.createFormVisible = false;
    }
  },
  mounted() {
    this.fetchProblemList();
  },
  computed: {}
};
</script>

<style scoped>
.problem_list_div {
  padding: 11px;
  background-color: white;
  margin-top: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.pro-container {
  padding: 15px 32px;
  margin: 4px 2px;
}
.filter-container {
  margin-top: 15px;
}
.fenye {
  margin-top: 10px;
}
</style>