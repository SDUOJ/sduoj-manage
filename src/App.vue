<template>
    <div class="layout">
        <Layout :style="{minHeight: '100vh'}">
            <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
                <NavBar></NavBar>
            </Sider>
            <Layout>
                <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
                  <div class="navbar-user">
                    <Avatar :src="avatar" />
                    <Button type="text" @click="toUserPage">
                      Gene_Liu
                      <Icon type="ios-arrow-forward" />
                    </Button>
                  </div>
                </Header>
                <Content :style="{padding: '16px 16px 16px'}">
                  <router-view></router-view>
                  <div class="footer" v-once v-html='footerInfo'></div>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import api from '@/utils/api';
import { mapGetters, mapState } from 'vuex';
import avaImg from '@/assets/gene.png'

export default {
  data: function() {
    return {
      avatar: avaImg,
      isCollapsed: false
    };
  },
  methods: {
    toUserPage: function() {
      this.$router.push('/user');
    }
  },
  components: { NavBar },
  computed: {
    ...mapState(['footerInfo']),
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
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
  clear:both;
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

.ivu-layout-sider .ivu-icon-ios-arrow-back:before {
  content: none !important;
}

.ivu-layout-header {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 1px 1px !important;
}
</style>