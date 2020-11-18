<template>
  <div>
    <Form :model="checkpoint">
      <FormItem label="Standard Input">
        <Input type="textarea" autocomplete="off" v-model="checkpoint.input" :rows="10"/>
      </FormItem>
      <FormItem label="Standard Output">
        <Input type="textarea" autocomplete="off" v-model="checkpoint.output" :rows="10"/>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import api from '_u/api';

export default {
  name: 'CheckpointPreview',
  data: function () {
    return {
      onUploading: false,
      checkpoint: {},
      oldCheckpoint: {}
    }
  },
  methods: {
    set: function(checkpoint) {
      this.checkpoint = checkpoint;
      this.oldCheckpoint = { ...checkpoint };
    },
    save: function (onSuccess, onFinally) {
      if (this.checkpoint.input === this.oldCheckpoint.input && this.checkpoint.output === this.oldCheckpoint.output) {
        onFinally();
        return;
      }
      this.onUploading = true;
      api.uploadSingleCheckpoint({
        input: this.checkpoint.input,
        output: this.checkpoint.output
      }).then(ret => {
        onSuccess(this.checkpoint.checkpointId, ret);
        this.$Message.success('Success');
      }, err => (this.$Message.error(err)))
        .finally(() => {
          this.onUploading = false;
          onFinally();
        });
    }
  }
}
</script>

<style scoped>

</style>
