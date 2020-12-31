<!--
   Copyright 2020-2021 the original author or authors.

   Licensed under the General Public License, Version 3.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

        https://www.gnu.org/licenses/gpl-3.0.en.html
 -->

<template>
  <div>
    <Form :model="checkpoint">
      <FormItem label="Standard Input">
        <Input type="textarea" autocomplete="off" v-model="checkpoint.input"/>
      </FormItem>
      <FormItem label="Standard Output">
        <Input type="textarea" autocomplete="off" v-model="checkpoint.output"/>
      </FormItem>
    </Form>
    <Button :loading="onUploading" @click="onUpload" type="success">Update</Button>
  </div>
</template>

<script>
import api from '_u/api';

export default {
  name: 'CheckpointPreview',
  props: {
    checkpoint: {
      type: Object,
      default: () => {
        return {
          input: '',
          output: ' '
        };
      }
    }
  },
  data: function () {
    return {
      onUploading: false
    }
  },
  methods: {
    onUpload: function () {
      this.onUploading = true;
      api.uploadSingleCheckpoint({
        input: this.checkpoint.input,
        output: this.checkpoint.output
      })
        .then(ret => {
          this.$emit('update', this.checkpoint.checkpointId, ret);
          this.$Message.success('Update: ' + ret);
        }, err => (this.$Message.error(err)))
        .finally(() => (this.onUploading = false));
    }
  }
}
</script>

<style scoped>

</style>
