<template>
  <div>
    <el-form>
      <el-form-item label="标准输入">
        <el-input
            :rows="8"
            autocomplete="off"
            type="textarea"
            v-model="checkpoint.input"
        ></el-input>
      </el-form-item>
      <el-form-item label="标准输出">
        <el-input
            :rows="8"
            autocomplete="off"
            type="textarea"
            v-model="checkpoint.output"
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
    props: {
      checkpoint: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        onSubmitting: false
      }
    },
    methods: {
      async handleSubmit() {
        this.onSubmitting = true;
        try {
          let ret = await post("/manage/checkpoint/upload", {
            input: this.checkpoint.input,
            output: this.checkpoint.output
          });
          this.$emit("update", this.checkpoint.checkpointId, ret);
          Vue.prototype.$success("Update: " + ret.checkpointId);
        } catch (err) {
          Vue.prototype.$error(err);
        }
        this.onSubmitting = false;
      }
    },
  };
</script>