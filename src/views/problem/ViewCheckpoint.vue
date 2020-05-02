<template>
  <div style="padding: 20px;">
    <el-page-header @back="goBack" :content="'检查点 ' + problem_id"></el-page-header>
    <div class="filter-container clear">
      <div style="float: right;">
        <el-button
          type="primary"
          class="filter-item"
          style="margin-left: 10px;"
          icon="el-icon-plus"
          @click="handleAdd()"
        >批量上传</el-button>
      </div>
      <div style="float: right;">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          icon="el-icon-plus"
          @click="handleAdd()"
        >单组上传</el-button>
      </div>
      <div style="float: right;">
        <el-input
          placeholder="请输入关键字搜索"
          style="width: 200px;"
          class="filter-item"
          v-model="search"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      problem_id: "",
      search: ""
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.problem_id = this.$route.params.pid;
  }
};
</script>

<style scoped>
.filter-container {
  margin-top: 15px;
}
.pagination_div {
  margin: 7px auto auto auto;
  text-align: center;
}
</style>