<template>
  <div>
    <el-page-header @back="goBack" :content="'编辑题目 ' + problemId"></el-page-header>
    <!-- 表单 -->
    <el-form
      :model="problemProfile"
      :rules="problemProfileRules"
      ref="problemProfile"
      style="margin-top: 20px"
    >
      <el-form-item label="题目名称" prop="problemTitle">
        <el-input autocomplete="off" v-model="problemProfile.problemTitle"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="时间限制" prop="timeLimit">
            <el-input
              autocomplete="off"
              size="medium"
              type="number"
              v-model="problemProfile.timeLimit"
            >
              <template slot="append">ms</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="空间限制" prop="memoryLimit">
            <el-input
              autocomplete="off"
              size="medium"
              type="number"
              v-model="problemProfile.memoryLimit"
            >
              <template slot="append">KiB</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="题目描述 (Markdown)" prop="markdown">
        <el-input
          :autosize="{ minRows: 20, maxRows: 100 }"
          autocomplete="off"
          type="textarea"
          v-model="problemProfile.markdown"
        ></el-input>
      </el-form-item>
      <el-form-item prop="isPublic">
        <el-switch active-text="公开" inactive-text="不公开" v-model="problemProfile.isPublic"></el-switch>
      </el-form-item>
    </el-form>
    <!--  -->
    <!-- 底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="checkpoint">查看检查点</el-button>
      <el-button :loading="submitting" @click="onSubmit" type="success">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { post } from "@/api.js";
import _ from "underscore";
import Vue from "vue";

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
      this.$router.push({
        name: "checkpoint",
        params: { pid: this.problemId }
      });
    },
    async fetchProblemProfile() {
      // 找后端要这个题的信息
      try {
        let ret = await post("/manage/problem/query", {
          problemId: parseInt(this.problemId)
        });
        this.tmp = ret;
        this.tmp.isPublic = ret.isPublic === 1;
        this.problemProfile = Object.assign({}, this.tmp);
      } catch (err) {
        Vue.prototype.$error(err);
      }
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
        const dataForm = {
          problemId: this.problemProfile.problemId,
          problemTitle: this.problemProfile.problemTitle,
          timeLimit: this.problemProfile.timeLimit,
          memoryLimit: this.problemProfile.memoryLimit,
          markdown: this.problemProfile.markdown,
          isPublic: this.problemProfile.isPublic ? 1 : 0
        };
        console.log(dataForm);
        let ret = await post("/manage/problem/update", dataForm);
        this.$message({
          message: ret.state,
          type: "info"
        });
        await this.fetchProblemList();
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