<template>
  <div class="clearfix">
    <div>
      <span class="subtitle">Single Upload</span>
      <Button @click="reset" size="small" style="float: right" type="text">Reset</Button>
      <Form :model="singleCheckpoint">
        <FormItem label="Standard Input">
          <Input autocomplete="off" type="textarea" v-model="singleCheckpoint.input" />
        </FormItem>
        <FormItem label="Standard Output">
          <Input autocomplete="off" type="textarea" v-model="singleCheckpoint.output" />
        </FormItem>
      </Form>
    </div>
    <div>
      <span class="subtitle">Batch Upload</span>
      <Upload
        action=""
        multiple
        paste
        accept=".in, .out"
        :format="['in', 'out']"
        :max-size="102400"
        :before-upload="beforeBatchUpload"
        ref="upload">
        <Tooltip content="Only .in and .out files that less than 200MB are allowed" max-width="400">
          <Button size="small">Select Files</Button>
        </Tooltip>
      </Upload>
      <div class="autowrap">
        <Tag v-for="(file, index) in files" :key="file.name" :name="file.name" closable @on-close="onFileRemove(index)"> {{ file.name }}</Tag>
      </div>
      <Button style="margin-top: 20px;" @click="onUpload" :loading="onUploading" type="success">Upload</Button>
    </div>
  </div>
</template>

<script>
import api from '_u/api';

export default {
  name: 'CheckpointsUpload',
  data: function() {
    return {
      singleCheckpoint: {
        input: '',
        output: ''
      },
      files: [],
      onUploading: false
    }
  },
  methods: {
    reset: function() {
      this.singleCheckpoint.input = '';
      this.singleCheckpoint.output = '';
      this.clearFiles();
    },
    beforeBatchUpload: function(file) {
      this.files.push(file);
      return false;
    },
    clearFiles: function() {
      this.files = [];
      this.$refs.upload.clearFiles();
    },
    onUpload: function() {
      if (this.singleCheckpoint.input !== '' && this.singleCheckpoint.output !== '') {
        this.handleSingleSubmit();
      } else {
        this.handleBatchSubmit();
      }
    },
    onFileRemove: function(index) {
      this.files.splice(index, 1);
    },
    validFile: function() {
      if (this.files.length === 0) {
        this.$Message.warning('Select files');
        return false;
      }
      let totSize = 0;
      const fileMap = new Map();
      for (let i = 0; i < this.files.length; ++i) {
        const file = this.files[i];
        let name = this.files[i].name;
        if (name.endsWith('.in')) {
          name = name.slice(0, -3);
        } else if (name.endsWith('.out')) {
          name = name.slice(0, -4);
        } else {
          this.$Message.error('invalid: ' + name);
          return false;
        }
        totSize += file.size;
        fileMap.set(name, !fileMap.has(name));
      }
      const unmatch = [];
      fileMap.forEach((value, key) => {
        if (value) {
          unmatch.push(key);
        }
      });
      console.log(unmatch.length);
      if (unmatch.length > 0) {
        unmatch.slice(0, Math.min(5, unmatch.length)).forEach(value => (this.$Message.error('file ' + value + ' does not match')));
        return false;
      }
      if (totSize > 200 * 1024 * 1024) {
        this.$Message.error('Too large: ' + totSize / 1024 + 'KB');
        return false;
      }
      return true;
    },
    handleBatchSubmit: function() {
      if (!this.validFile()) return false;
      const form = new FormData();
      this.files.forEach(file => form.append('files', file));
      this.onUploading = true;
      api.uploadCheckpointFiles(form)
        .then(ret => {
          this.$emit('upload', ret);
          this.$Message.success('Upload successfully');
          this.reset();
        }, err => (this.$Message.error(err)))
        .finally(() => (this.onUploading = false));
    },
    handleSingleSubmit: function() {
      this.onUploading = true;
      api.uploadSingleCheckpoint(this.singleCheckpoint)
        .then(ret => {
          this.$emit('upload', [ret]);
          this.$Message.success('Upload successfully: ' + ret.checkpointId);
          this.reset();
        }, err => (this.$Message.error(err)))
        .finally(() => (this.onUploading = false));
      this.onUploading = false;
    }
  }
}
</script>

<style lang="less" scoped>
  .autowrap {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
  .subtitle {
    font-size: 15px;
    font-weight: bold;
  }
  .list_div {
    padding: 11px;
    background-color: white;
    margin-top: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
</style>
