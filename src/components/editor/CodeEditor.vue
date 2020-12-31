<!--
   Copyright 2020-2021 the original author or authors.

   Licensed under the General Public License, Version 3.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

        https://www.gnu.org/licenses/gpl-3.0.en.html
 -->

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
