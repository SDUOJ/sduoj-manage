<template>
  <div class="home">
    <!-- <template> -->
    <el-input v-model="search" placeholder="输入关键字搜索" />
    <!-- </template> -->
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      search: ""
    };
  }
};
</script>
