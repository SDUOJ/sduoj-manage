<template>
  <div>
    <el-form :model="formData">
      <el-form-item label="标准输入">
        <el-input
            :rows="8"
            autocomplete="off"
            type="textarea"
            v-model="formData.input"
        ></el-input>
      </el-form-item>
      <el-form-item label="标准输出">
        <el-input
            :rows="8"
            autocomplete="off"
            type="textarea"
            v-model="formData.output"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button :loading="onSubmitting" @click="handleSubmit" type="success">上传至服务器</el-button>
  </div>
</template>

<script>
  import {post} from "@/api.js";
  import Vue from "vue";

  export default {
    data() {
      return {
        formData: {
          input: "",
          output: ""
        },
        onSubmitting: false
      }
    },
    methods: {
      async handleSubmit() {
        this.onSubmitting = true;
        try {
          let ret = await post("/manage/checkpoint/upload", this.formData);
          this.$emit("upload", [ret]);
          Vue.prototype.$success("创建成功: " + ret.checkpointId);
        } catch (err) {
          Vue.prototype.$error(err);
        }
        this.onSubmitting = false;
      }
    }
  };
</script>