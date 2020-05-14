<template>
  <div>
    <el-page-header @back="goBack" content="添加题目"></el-page-header>
    <!-- 表单 -->
    <el-form :model="createProblemForm" :rules="problemProfileRules" ref="createProblemForm" style="margin-top: 20px">
      <el-form-item label="题目名称" prop="problemTitle">
        <el-input autocomplete="off" v-model="createProblemForm.problemTitle"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="时间限制" prop="timeLimit">
            <el-input
                autocomplete="off"
                size="medium"
                type="number"
                v-model="createProblemForm.timeLimit"
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
                v-model="createProblemForm.memoryLimit"
            >
              <template slot="append">KiB</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="题目描述 (Markdown)" prop="markdown">
        <el-input
            :autosize="{ minRows: 20, maxRows: 50 }"
            autocomplete="off"
            type="textarea"
            v-model="createProblemForm.markdown"
        ></el-input>
      </el-form-item>
      <el-form-item prop="isPublic">
        <el-switch active-text="公开" inactive-text="不公开" v-model="createProblemForm.isPublic"></el-switch>
      </el-form-item>
    </el-form>
    <!--  -->
    <!-- 底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button :loading="onSubmitting" @click="onSubmit" type="success">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import {post} from "@/api.js";
  import Vue from "vue";

  export default {
    data: function () {
      return {
        createProblemForm: {
          problemTitle: "",
          timeLimit: 1000,
          memoryLimit: 128 * 1024,
          markdown: "",
          isPublic: true
        },
        problemProfileRules: {
          problemTitle: [
            {required: true, message: "请输入题目标题", trigger: "blur"}
          ],
          timeLimit: [
            {required: true, message: "请输入时间限制", trigger: "blur"},
            {type: "number", message: "时间限制是数字", trigger: "change"}
          ],
          memoryLimit: [
            {required: true, message: "请输入空间限制", trigger: "blur"},
            {type: "number", message: "空间限制是数字", trigger: "change"}
          ],
          markdown: [
            {required: true, message: "请输入题目描述", trigger: "blur"}
          ]
        },
        onSubmitting: false
      };
    },
    methods: {
      goBack() {
        this.$router.go(-1);
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
          let ret = await post("/manage/problem/create", {
            problemTitle: String(this.createProblemForm.problemTitle),
            timeLimit: parseInt(this.createProblemForm.timeLimit),
            memoryLimit: parseInt(this.createProblemForm.memoryLimit),
            markdown: String(this.createProblemForm.markdown),
            isPublic: this.createProblemForm.isPublic ? 1 : 0
          });
          this.$message({
            message: "题目 " + ret + " 添加成功",
            type: "success"
          });
          this.createFormVisible = false;
          await this.fetchProblemList();
        } catch (err) {
          // 失败
          Vue.prototype.$error(err);
        }
        this.onSubmitting = false;
        return true;
      }
    }
  };
</script>