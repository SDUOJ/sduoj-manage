<template>
  <div class="nav-bar">
    <el-menu
      mode="horizontal"
      background-color="#24292e"
      text-color="#fff"
      active-text-color="#cc8e35"
      router
      :default-active="active"
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home" />
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/problem">
        <i class="el-icon-document-copy" />
        <span>题目管理</span>
      </el-menu-item>
      <el-menu-item index="/contest">
        <i class="el-icon-s-data" />
        <span>比赛管理</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-user" />
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/system">
        <i class="el-icon-info" />
        <span>系统状态</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  computed: {
    active: function() {
      return "/" + this.$route.path.split("/")[1];
    }
  }
};
</script>

<style scoped>
.nav-bar {
  user-select: none;
  margin: 0;
  padding: 0;
}
</style>