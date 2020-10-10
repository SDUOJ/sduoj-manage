<template>
  <span>
    <strong>{{ oj }}</strong>
    -{{ code }}
  </span>
</template>

<script>
export default {
  name: 'problemCode',
  props: {
    problemCode: {
      type: String,
      default: '-'
    }
  },
  computed: {
    oj: function () {
      return this.problemCode.split('-')[0];
    },
    code: function () {
      return this.problemCode.split('-')[1];
    }
  }
}
</script>

<style scoped>
</style>
