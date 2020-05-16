<template>
  <div>
    <div>
      <span>单组上传</span>
      <el-button @click="resetForm" size="small" style="float: right;" type="text">清空</el-button>
      <el-form>
        <el-form-item label="标准输入">
          <el-input
              :rows="8"
              autocomplete="off"
              type="textarea"
              v-model="singleCheckpoint.input"
          ></el-input>
        </el-form-item>
        <el-form-item label="标准输出">
          <el-input
              :rows="8"
              autocomplete="off"
              type="textarea"
              v-model="singleCheckpoint.output"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <span>批量上传</span>
      <el-upload
          :auto-upload="false"
          :file-list="fileList"
          :http-request="handleFileUpload"
          accept=".in, .out"
          action=" "
          multiple
          ref="upload"
          style="margin-top: 10px;"
      >
        <el-button size="small" slot="trigger">选取文件</el-button>
        <el-button :loading="onSubmitting" @click="handleSubmit" size="small" style="float: right;" type="success">
          上传到服务器
        </el-button>
        <div class="el-upload__tip" slot="tip">只能上传 in/out 文件，且总大小不能超过100M</div>
      </el-upload>
    </div>
  </div>
</template>
<script>
  import {post} from "@/api.js";
  import Vue from "vue";

  export default {
    data() {
      return {
        fileList: [],
        fileData: [],
        singleCheckpoint: {
          inputContent: "",
          outputContent: ""
        },
        onSubmitting: false
      };
    },
    methods: {
      resetForm() {
        this.singleCheckpoint.input = "";
        this.singleCheckpoint.output = "";
      },
      handleFileUpload(file) {
        this.fileData.push(file.file);
      },
      handleSubmit() {
        if (this.validForm()) this.handleSingleSubmit();
        else this.handleBatchSubmit();
      },
      validForm() {
        return this.singleCheckpoint.input !== "" && this.singleCheckpoint.output !== "";
      },
      validFile() {
        if (this.fileData.length === 0) {
          Vue.prototype.$warning("请选择上传的文件");
          return false;
        }
        let totSize = 0;
        let fileMap = new Map();
        for (let i = 0; i < this.fileData.length; ++i) {
          const file = this.fileData[i];
          let name = this.fileData[i].name;
          if (name.endsWith(".in")) {
            name = name.slice(0, -3);
          } else if (name.endsWith(".out")) {
            name = name.slice(0, -4);
          } else {
            Vue.prototype.$error("invalid: " + name);
            return false;
          }
          totSize += file.size;
          fileMap.set(name, !fileMap.has(name));
        }
        let unmatch = false;
        fileMap.forEach(value => unmatch |= value);
        if (unmatch) {
          Vue.prototype.$error("输入输出文件不匹配");
          return false;
        }
        if (totSize > 100 * 1024 * 1024) {
          Vue.prototype.$error(
            "总大小不能超过100M, 当前: " + totSize / 1024 + "KB"
          );
          return false;
        }
        return true;
      },
      async handleBatchSubmit() {
        this.fileData = [];
        this.$refs.upload.submit();
        if (!this.validFile()) return false;

        let form = new FormData();
        this.fileData.forEach(file => form.append("files", file));
        this.onSubmitting = true;
        try {
          let ret = await post("/manage/checkpoint/upload", form);
          this.$emit("upload", ret);
          this.fileList = []
          Vue.prototype.$success("上传成功");
        } catch (err) {
          Vue.prototype.$error(err);
        }
        this.onSubmitting = false;
      },
      async handleSingleSubmit() {
        this.onSubmitting = true;
        try {
          let ret = await post("/manage/checkpoint/upload", this.singleCheckpoint);
          this.$emit("upload", [ret]);
          Vue.prototype.$success("上传成功: " + ret.checkpointId);
        } catch (err) {
          Vue.prototype.$error(err);
        }
        this.onSubmitting = false;
      }
    }
  };
</script>