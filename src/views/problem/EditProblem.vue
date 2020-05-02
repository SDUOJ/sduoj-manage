<template>
  <div style="padding: 20px;">
    <el-page-header @back="goBack" :content="'编辑题目 ' + problemId"></el-page-header>
    <!-- 表单 -->
    <el-form
      :model="problemProfile"
      :rules="problemProfileRules"
      ref="problemProfile"
      style="margin-top: 10px;"
    >
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
      <el-form-item label="题目描述 (Markdown)" prop="markdown">
        <el-input
          type="textarea"
          :autosize="{ minRows: 20, maxRows: 100 }"
          autocomplete="off"
          v-model="problemProfile.markdown"
        ></el-input>
      </el-form-item>
      <el-form-item prop="isPublic">
        <el-switch
          active-text="公开"
          inactive-text="不公开"
          v-model="problemProfile.isPublic"
        >{{problemProfile.isPublic + "2333333333333"}}</el-switch>
      </el-form-item>
    </el-form>
    <!--  -->
    <!-- 底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="checkpoint">查看检查点</el-button>
      <el-button type="primary" @click="onSubmit" :loading="submitting">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { post } from "@/api.js";
import _ from "underscore";
export default {
  data: function() {
    return {
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
        markdown: [
          { required: true, message: "请输入题目描述", trigger: "blur" }
        ]
      },
      problemProfile: {
        problemTitle: "",
        timeLimit: 0,
        memoryLimit: 0,
        markdown: "",
        isPublic: true
      },
      tmp: {
        problemTitle: "",
        timeLimit: 0,
        memoryLimit: 0,
        markdown: "",
        isPublic: true
      },
      problemId: "",
      submitting: false
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    checkpoint() {
      this.$router.push(this.problem_id + "/checkpoint");
    },
    async fetchProblemProfile() {
      // 找后端要这个题的信息
      let ret = await post("/manage/problem/query", {
        problemId: parseInt(this.problemId)
      });
      this.tmp = ret;
      this.tmp.isPublic = ret.isPublic === 1;
      this.problemProfile = Object.assign({}, this.tmp);
      console.log(this.problemProfile);
    },
    async onSubmit() {
      // 检查有没有变化
      if (_.isEqual(this.problemProfile, this.tmp)) {
        return true;
      }
      // 表单验证
      this.$refs["problemProfile"].validate(valid => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
      });
      this.submitting = true;
      try {
        // 往后端发post
        this.problemProfile.isPublic = this.problemProfile.isPublic ? 1 : 0;
        let ret = await post("/manage/problem/update", this.problemProfile);
        this.$message({
          message: ret.state,
          type: "info"
        });
        this.fetchProblemList();
      } catch (err) {
        console.log(err);
      }
      this.submitting = false;
      return true;
    }
  },
  mounted() {
    this.problemId = this.$route.params.pid;
    this.fetchProblemProfile();
  }
};
</script>