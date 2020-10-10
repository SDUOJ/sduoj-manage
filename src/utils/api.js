import Vue from 'vue';
import axios from 'axios';
import store from '@/store';

const ver1 = '/api';
axios.defaults.baseURL = 'http://api.oj.sdu.edu.cn:8080' + ver1;
axios.defaults.withCredentials = true;

function post(url, data) {
  data = data || {};
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        if (response.data.code === 0) {
          // everything alright
          resolve(response.data.data);
        } else {
          Vue.prototype.$Message.error(response.data.message);
          reject(response.data);
        }
      }, err => {
        reject(err.response.data);
      })
  });
}

function get(url, params) {
  params = params || {};
  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then(response => {
        if (response.data.code === 0) {
          resolve(response.data.data);
        } else {
          Vue.prototype.$Message.error(response.data.message);
          reject(response.data);
        }
      }, err => {
        reject(err.response.data);
      })
  })
}

export default {
  // 用户相关
  getProfile: function(success, error) {
    axios.get('/user/getProfile')
      .then(response => {
        if (response.data.code === 0) {
          store.dispatch('user/setProfile', response.data.data)
          if (success) {
            success(response.data.data);
          }
        } else {
          Vue.prototype.$Message.error(response.data.message);
        }
      }, err => {
        if (err.response.status === 401) {
          store.dispatch('user/clearProfile');
          if (error) {
            error(err.response.data);
          }
        }
      });
  },
  // 查询用户列表
  getUserList: function(params) {
    return get('/manage/user/list', params);
  },
  // 更改用户信息
  updateUserInfo: function(data) {
    console.log(data)
    return post('/manage/user/update', data);
  },
  // 更改用户密码
  updateUserPasswd: function(data) {
    return post('/manage/user/update', data);
  },
  // 批量添加用户
  addUsers: function(data) {
    return post('/manage/user/addUsers', data);
  },
  // 删除用户
  deleteUsers: function(data) {
    return post('/manage/user/delete', data);
  }
}
