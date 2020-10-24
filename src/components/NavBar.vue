<template>
  <div>
    <Row>
      <div class="logo" @click="$router.push('/')">
        <img src="../assets/logo.png" style="width: 100px; height: 30px;"/>
      </div>
    </Row>
    <Menu :active-name="$route.path.split('/')[1]" theme="dark" width="auto">
      <MenuItem name="user" :to="{ name: 'user' }">
        <Icon type="ios-navigate"></Icon>
        用户
      </MenuItem>
      <MenuItem name="problem" :to="{ name: 'problem' }">
        <Icon type="ios-navigate"></Icon>
        题库
      </MenuItem>
      <MenuItem name="contest" :to="{ name: 'contest' }">
        <Icon type="ios-keypad"></Icon>
        比赛
      </MenuItem>
      <MenuItem name="undefined" :to="{ name: 'template' }">
        <Icon type="ios-paper"></Icon>
        评测模板
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
import api from '@/utils/api';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['username'])
  },
  mounted: function () {
    api.getProfile();
  }
};
</script>

<style lang="less" scoped>
  .logo {
    margin: 17px 0 10px 45px;

    :hover {
      cursor: pointer;
    }
  }

  /deep/ .ivu-menu-vertical {
    line-height: 25px;
  }
</style>
