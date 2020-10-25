<template>
  <codemirror :value="code" :options="cmOptions" @input="onEditorCodeChange" />
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
    code: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      cmOptions: {
        autoCloseBrackets: true,
        tabSize: 2,
        line: true,
        theme: 'default',
        mode: 'text/json'
      }
    }
  },
  methods: {
    onEditorCodeChange: function(newCode) {
      this.$emit('update:code', newCode)
    }
  }
}
</script>
