<template>
  <div>
    <Menu mode="horizontal" theme="light" class="problemMenu" :active-name="$route.path.split('/')[3]">
      <Menu-item name="description" :to="{ name: 'problem-description' }">
        <Icon type="ios-book-outline"></Icon>
        题面管理
      </Menu-item>
      <Menu-item name="checkpoint" :to="{ name: 'problem-checkpoint' }">
        <Icon type="ios-build-outline"></Icon>
        数据管理
      </Menu-item>
    </Menu>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>

</script>

<style lang="less" scoped>
  /deep/ .ivu-menu {
    z-index: 0;
  }

  .problemMenu {
    margin-top: -10px;
    background: transparent;
  }

  .content {
    margin-top: 30px;
  }

</style>
