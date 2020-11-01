<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" class="layoutSider">
        <NavBar></NavBar>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}" class="layoutHeader">
          <div class="navbar-user">
            <Avatar :src="avatar"/>
            <Button type="text" @click="toUserPage">
              {{ username }}
              <Icon type="ios-arrow-forward"/>
            </Button>
          </div>
        </Header>
        <Content :style="{padding: '16px 16px 16px'}" class="layoutContent">
          <router-view></router-view>
          <div class="footer" v-once v-html='footerInfo'></div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import { mapGetters, mapState } from 'vuex';

export default {
  data: function () {
    return {
      isCollapsed: false
    };
  },
  methods: {
    toUserPage: function () {
      window.open(this.clientURL, '_blank');
    }
  },
  components: { NavBar },
  computed: {
    ...mapState(['footerInfo']),
    ...mapGetters('user', ['username', 'avatar']),
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    clientURL: function () {
      if (process.env.NODE_ENV === 'production') {
        return location.origin;
      } else {
        return process.env.VUE_APP_OJ_CLIENT;
      }
    }
  },
  mounted: function () {
  }
};
</script>

<style lang="less">
  .container {
    max-width: 1300px;
    margin: 0 auto;
  }

  .clearfix:after {
    content: '';
    clear: both;
    display: table;
  }

  .navbar-user {
    float: right;

    .navbar-username {
      margin: auto 8px;
      font-size: 16px;
    }

    .ivu-btn-text:hover {
      cursor: pointer;
      color: #717D7E;
    }

    .ivu-btn-text:focus {
      background: rgba(0, 0, 0, 0);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }

  .ivu-layout-header {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 1px 1px !important;
  }

  .layoutSider {
    position: fixed !important;
    height: 100% !important;
    z-index: 201;
  }

  .layoutContent {
    margin-left: 200px;
    margin-top: 64px;
  }

  .layoutHeader {
    position: fixed !important;
    height: 64px;
    width: 100%;
    z-index: 101;
  }
</style>
