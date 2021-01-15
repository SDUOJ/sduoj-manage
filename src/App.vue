<!--
   Copyright 2020-2021 the original author or authors.

   Licensed under the General Public License, Version 3.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

        https://www.gnu.org/licenses/gpl-3.0.en.html
 -->

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
          <div class="footer" v-once v-html="copyright"></div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import { mapGetters, mapState } from 'vuex';

import api from '_u/api';
import { SDUOJ_ENV } from '_u/env';

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
    ...mapState(['copyright']),
    ...mapGetters('user', ['username', 'avatar']),
    clientURL: function () {
      return SDUOJ_ENV.PROD ? location.origin : process.env.VUE_APP_OJ_CLIENT;
    }
  },
  created: async function () {
    this.$store.commit('updateCopyright', {
      copyright: await api.getCopyright()
    });
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
