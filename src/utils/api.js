import Vue from 'vue';
import axios from 'axios';
import store from '@/store';

const ver1 = '/api';
axios.defaults.baseURL = 'http://api.oj.sdu.edu.cn:8080' + ver1;
axios.defaults.withCredentials = true;

function post(url, data, options) {
  data = data || {};
  options = options || {};
  return new Promise((resolve, reject) => {
    axios.post(url, data, options)
      .then(response => {
        if (response.headers['content-type'].indexOf('application/json') === -1) {
          resolve(response);
        } else if (response.data.code === 0) {
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
  // ---------------------- 用户相关 ----------------------
  getProfile: function (success, error) {
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
  getUserList: function (params) {
    return get('/manage/user/list', params);
  },
  // 更改用户信息
  updateUserInfo: function (data) {
    return post('/manage/user/update', data);
  },
  // 更改用户密码
  updateUserPasswd: function (data) {
    return post('/manage/user/update', data);
  },
  // 批量添加用户
  addUsers: function (data) {
    return post('/manage/user/addUsers', data);
  },
  // 删除用户
  deleteUsers: function (data) {
    return post('/manage/user/delete', data);
  },
  // ---------------------- 题目相关 ----------------------
  // 查询题目列表
  getProblemList: function (params) {
    return get('/manage/problem/list', params);
  },
  // 查询题目
  getProblem: function (params) {
    return get('/manage/problem/query', params);
  },
  // 更新题目信息
  updateProblemInfo: function (data) {
    return post('/manage/problem/update', data);
  },
  // 创建题目
  createProblem: function (data) {
    return post('/manage/problem/create', data);
  },
  // ---------------------- 题面相关 ----------------------
  // 查询题目的描述列表
  getProblemDescriptionList: function (params) {
    return get('/manage/problem/queryDescriptionList', params);
  },
  // 查询题目描述
  getProblemDescription: function (params) {
    return get('/manage/problem/queryDescription', params);
  },
  // 更新题面描述
  updateDescription: function (data) {
    return post('/manage/problem/updateDescription', data);
  },
  // 创建新题面描述
  createDescription: function (data) {
    return post('/manage/problem/createDescription', data);
  },
  // ---------------------- 测试点相关 ----------------------
  // checkpoint单点上传
  uploadSingleCheckpoint: function (data) {
    return post('/manage/checkpoint/upload', data);
  },
  // checkpoint批量上传
  uploadCheckpointFiles: function (data) {
    return post('/manage/checkpoint/uploadFiles', data);
  },
  // 获取题目的checkpoint列表
  getCheckpointList: function (problemCode) {
    return get('/manage/checkpoint/list', { problemCode });
  },
  // 获取checkpoint详情
  getCheckpointPreview: function (checkpointId) {
    return get('/manage/checkpoint/query', { checkpointId });
  },
  // 全量更新题目的checkpoint
  updateProblemCheckpoints: function (data) {
    return post('/manage/problem/update', data);
  },
  // 下载checkpoints
  downloadCheckpoints: function (data) {
    return post('/manage/checkpoint/download', data, { responseType: 'blob' });
  },
  // ---------------------- 比赛相关 ----------------------
  // 获取比赛列表
  getContestList: function (params) {
    return get('/manage/contest/page', params);
  },
  // 获取单个比赛详情
  getContest: function (params) {
    return get('/manage/contest/query', params);
  }
}
