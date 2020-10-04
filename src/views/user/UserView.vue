<template>
  <div>
    <Card :dis-hover="true">
        <p slot="title">
            用户管理
        </p>
        <Input placeholder="用户搜索" style="width: auto" slot="extra">
          <Icon type="ios-search" slot="suffix" />
        </Input>
        <Table 
          :columns="userTableColumns" 
          :data="userTableData" 
          class="user-set-content-table"
          @on-sort-change="handleUserSort">
        </Table>

        <!-- 用户信息修改框 -->
        <Modal
          v-model="userInfoModal"
          title="用户基本信息"
          @on-ok="commitUserInfo">
          <Form :model="userInfo" :rules="userInfoRule" :label-width="80">
            <FormItem label="用户名" prop="userName">
              <Input v-model="userInfo.userName" :placeholder="userInfo.userName" disabled></Input>
            </FormItem>

            <FormItem label="昵称" prop="nickName">
              <Input v-model="userInfo.nickName" :placeholder="userInfo.nickName"></Input>
            </FormItem>

            <FormItem label="性别" prop="gender">
              <RadioGroup v-model="userInfo.gender">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
                <Radio label="?">?</Radio>
              </RadioGroup>
            </FormItem>

            <FormItem label="学号" prop="studentId">
              <Input v-model="userInfo.studentId" :placeholder="userInfo.studentId"></Input>
            </FormItem>

            <FormItem label="手机" prop="phone">
              <Input v-model="userInfo.phone" :placeholder="userInfo.phone"></Input>
            </FormItem>

            <FormItem label="邮箱" prop="email">
              <Input v-model="userInfo.email" :placeholder="userInfo.email"></Input>
            </FormItem>

            <FormItem label="权限">
              <Select v-model="userInfo.roles" multiple>
                <Option value="user">user</Option>
                <Option value="admin">admin</Option>
                <Option value="superadmin">superadmin</Option>
              </Select>
            </FormItem>
          </Form>
        </Modal>
        <!-- 用户信息修改框 -->

        <!-- 用户密码修改框 -->
        <Modal
          v-model="userPasswordModal"
          title="密码设置"
          @on-ok="commitUserPassword">
          <Form ref="passWordForm" :model="userInfo" :rules="userInfoRule" :label-width="80">
            <FormItem label="用户名" prop="userName">
                <Input v-model="userInfo.userName" :placeholder="userInfo.userName" disabled></Input>
              </FormItem>

            <FormItem label="新密码" prop="passWord">
              <Input type="password" v-model="userInfo.passWord"></Input>
            </FormItem>

            <FormItem label="确认密码" prop="passWordCheck">
                <Input type="password" v-model="userInfo.passWordCheck"></Input>
            </FormItem>
          </Form>
        </Modal>
        <!-- 用户密码修改框 -->
        
    </Card>
    <div class="user-set-content-footer">
      <Button type="default" size="small" class="user-set-content-button" @click="addUser">添加</Button>
      <Button type="default" size="small" class="user-set-content-button" @click="deleteUser">删除</Button>
      <Button type="default" size="small" class="user-set-content-button" @click="batchUser">批量导入</Button>
      <Button type="default" size="small" class="user-set-content-button" @click="exportUser">文件导出</Button>
      <Page 
          class="user-set-content-page"
          size="small" show-elevator show-sizer
          :total="totalPage"
          :current.sync="pageNow"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"/>
    </div>

    <!-- 添加用户模态框 -->
    <Modal
        v-model="addUserModal"
        title="添加用户"
        @on-ok="commitAddUser">
        <Form :model="userInfo" :rules="userInfoRule" :label-width="80">
            <FormItem label="用户名" prop="userName">
              <Input v-model="userInfo.userName" placeholder="输入用户名"></Input>
            </FormItem>

            <FormItem label="昵称" prop="nickName">
              <Input v-model="userInfo.nickName" placeholder="输入昵称"></Input>
            </FormItem>

            <FormItem label="性别" prop="gender">
              <RadioGroup v-model="userInfo.gender">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
                <Radio label="?">?</Radio>
              </RadioGroup>
            </FormItem>

            <FormItem label="学号" prop="studentId">
              <Input v-model="userInfo.studentId" placeholder="输入学号"></Input>
            </FormItem>

            <FormItem label="手机" prop="phone">
              <Input v-model="userInfo.phone" placeholder="输入手机号"></Input>
            </FormItem>

            <FormItem label="邮箱" prop="email">
              <Input v-model="userInfo.email" placeholder="输入邮箱"></Input>
            </FormItem>

            <FormItem label="权限">
              <Select v-model="userInfo.roles" multiple>
                <Option value="user">user</Option>
                <Option value="admin">admin</Option>
                <Option value="superadmin">superadmin</Option>
              </Select>
            </FormItem>

            <FormItem label="新密码" prop="passWord">
              <Input type="password" v-model="userInfo.passWord"></Input>
            </FormItem>

            <FormItem label="确认密码" prop="passWordCheck">
                <Input type="password" v-model="userInfo.passWordCheck"></Input>
            </FormItem>
          </Form>
        </Modal>
    </Modal>
    <!-- 添加用户模态框 -->

    <!-- 批量导入模态框 -->
    <Modal
        v-model="batchUserModal"
        title="批量导入"
        @on-ok="commitBatchUser">
        <Form :model="userInfo" :rules="userInfoRule" :label-width="80">
          <FormItem label="用户信息">
            <Input v-model="userInfo.infoArea" type="textarea" :autosize="{minRows: 5,maxRows: 20}" 
              placeholder="/* 每一行数据以 Tab 键分割，依次包含用户名 密码  邮箱 */">
            </Input>
          </FormItem>
        </Form>
    </Modal>
    <!-- 批量导入模态框 -->
  </div>
</template>

<script>
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value !== '') {
        this.$ref.userInfo.validateField('passWordCheck');
      }
      callback();
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value !== this.userInfo.passWord) {
        callback(new Error('两次输入的密码不匹配'));
      } else {
        callback();
      }
    };
    return {
      userTableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '性别',
          key: 'gender'
        },
        {
          title: '学号',
          key: 'studentId',
          sortable: 'true'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '\b',
          key: 'roles',
          render: (h, params) => {
            return h('div', { class: 'user-set-roles' },
              params.row.roles.map(item => {
                return h('div', { class: 'user-set-rolebox' }, [
                  h('div', { class: 'user-set-role' }, item)
                ])
              }));
          }
        },
        {
          title: '\b',
          key: 'modify',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  icon: 'md-build'
                },
                on: {
                  click: () => {
                    this.userInfoModal = 'true';
                    this.userInfo.userName = params.row.userName;
                    this.userInfo.nickName = params.row.nickName;
                    this.userInfo.gender = params.row.gender;
                    this.userInfo.studentId = params.row.studentId;
                    this.userInfo.phone = params.row.phone;
                    this.userInfo.email = params.row.email;
                    this.userInfo.roles = params.row.roles;
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'error',
                  icon: 'md-key'
                },
                on: {
                  click: () => {
                    this.userPasswordModal = 'true';
                    this.userInfo.userName = params.row.userName;
                    this.userInfo.passWord = '';
                    this.userInfo.passWordCheck = '';
                  }
                }
              })
            ])
          }
        }
      ],
      userTableData: [
        {
          userName: 'jeshrz',
          nickName: 'hrzhrz',
          gender: '男',
          studentId: '201700530121',
          roles: ['superadmin', 'admin'],
          email: 'jeshrz@gmail.com',
          phone: '13958874388'
        }
      ],
      totalPage: 100,
      pageNow: 1,
      pageSize: 10,
      totalProblemNum: 0,
      sortBy: '',
      ascending: false,
      userInfoModal: false,
      userPasswordModal: false,
      addUserModal: false,
      batchUserModal: false,
      userInfo: {
        userName: '',
        nickName: '',
        gender: '',
        studentId: '',
        phone: '',
        email: '',
        roles: [],
        passWord: '',
        passWordCheck: '',
        infoArea: ''
      },
      userInfoRule: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { type: 'string', max: 30, message: '用户名不能超过 30 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: false, trigger: 'blur' },
          { type: 'string', max: 30, message: '用户名不能超过 30 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: false, trigger: 'change' }
        ],
        studentId: [
          { required: true, message: '学号不能为空', trigger: 'blur' },
          { type: 'string', pattern: /[0-9]*/, message: '学号仅包含 0-9 的数字' }
        ],
        phone: [
          { required: false, trigger: 'blur' },
          { type: 'string', pattern: /[0-9]*/, min: 11, max: 11, message: '请输入 11 位手机号码' }
        ],
        email: [
          { required: true, massage: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入符合规范的邮箱地址' }
        ],
        roles: [
          { required: false, trigger: 'change' }
        ], 
        passWord: [
          { required: true, trigger: 'blur', min: 6, max: 32, message: '密码长度在 6 ~ 32 之间' },
          { validator: validatePass, trigger: 'blur' }
        ],
        passWordCheck: [
          { required: true, validator: validatePassCheck, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onPageChange: function(curPage) {
      this.pageNow = curPage;
      this.getProblemList();
    },
    onPageSizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.getProblemList();
    },
    handleUserSort: function({ column, key, order }) {
      if (order === 'normal') {
        this.sortBy = '';
        this.ascending = false
      } else {
        this.sortBy = key;
        this.ascending = order === 'asc';
      }
    },
    commitUserInfo () {
      // this.$Message.info('Clicked ok');
    },
    commitUserPassword () {

    },
    // 添加用户按钮
    addUser () {
      this.addUserModal = 'true';
      this.userInfo.userName = '';
      this.userInfo.nickName = '';
      this.userInfo.gender = '';
      this.userInfo.studentId = '';
      this.userInfo.phone = '';
      this.userInfo.email = '';
      this.userInfo.roles = [];
      this.userInfo.passWord = '';
      this.userInfo.passWordCheck = '';
    },
    commitAddUser () {

    },
    // 批量导入用户按钮
    batchUser () {
      this.batchUserModal = 'true';
      this.userInfo.infoArea = '';
    },
    commitBatchUser () {

    },
    // 删除用户按钮
    deleteUser () {

    },
    // 文件导出按钮
    exportUser () {

    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-card {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  .ivu-card-head {
    background-color: #F4F6F6;
  }
  .ivu-card-body {
    padding: 0;
  }
  .ivu-input-wrapper {
    top: -5px;
  }
  .user-set-content-table {
    // ivu 表格头部
    .ivu-table-header {
      padding-right: 0;
      th {
        background-color: #fff;
      }
    }
    .ivu-table::before {
      height: 0;
    }
    // ivu 表格内部
    .ivu-table-body {
      padding-right: 0;
    }
    .ivu-table-tbody {
      width: 100%;
      padding: 0;
      margin: 0;
      border-spacing: 0;
    }
    .ivu-table-row-hover td {
        background-color: #fbfcfc;
    }
    // ivu 数据内容
    .user-set-name {
      float: left;
    }
  }
}
.ivu-card-bordered {
  border-bottom: none !important;
}
// 分页栏
.user-set-content-footer {
  margin-top: 12px;
  .user-set-content-page {
    float: right;
  }
  .user-set-content-button {
    float: left;
    margin-right: 5px;
  }
}
// 模态框
.modalLine {
  margin-bottom: 10px;
  .modalItem {
    float: right;
    margin-right: 20px;
    line-height: 30px;
  }
}
</style>

<style lang="less">
// 权限标签
.user-set-roles {
  float: right;
  .user-set-rolebox {
    margin: 2px;
    background-color: #F8F9F9;
    float: right;
    border-radius: 4px;
    .user-set-role {
      user-select: none;
      margin: 4px 6px;
    }
  }
}
// 修改按钮
.ivu-table-row {
  .ivu-btn {
    margin-left: 4px;
    margin-right: 4px;
  }
}
</style>