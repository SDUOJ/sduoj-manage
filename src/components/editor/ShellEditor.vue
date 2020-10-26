<template>
  <codemirror :value="code" :options="cmOptions" @input="onEditorCodeChange" />
</template>

<script>
import { codemirror } from 'vue-codemirror-lite';
export default {
  name: 'ShellEditor',
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
        mode: 'text/x-sh',
        tabSize: 2,
        line: true,
        theme: 'default'
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

<style scoped>

</style>
