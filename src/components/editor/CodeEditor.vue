<template>
  <div style="line-height: normal; font-size: 16px">
    <codemirror :value="code" :options="cmOptions" @input="onEditorCodeChange" />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite';
// closebrackets
import 'codemirror/addon/edit/closebrackets.js'

export default {
  components: {
    codemirror
  },
  props: {
    code: String,
    mode: String
  },
  data: function() {
    return {
      cmOptions: {
        autoCloseBrackets: true,
        tabSize: 2,
        theme: 'default',
        mode: 'text/json',
        lineNumbers: true
      }
    }
  },
  methods: {
    onEditorCodeChange: function(newCode) {
      this.$emit('update:code', newCode)
    }
  },
  mounted: function() {
    this.cmOptions.mode = this.mode;
  },
  watch: {
    mode: function () {
      this.cmOptions.mode = this.mode;
    }
  }
}
</script>

<style lang="less" scoped>
</style>
