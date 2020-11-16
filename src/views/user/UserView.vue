<template>
  <div>
    <Card :dis-hover="true">
      <p slot="title">User</p>
      <Table
        :columns="userTableColumns"
        :data="userTableData"
        class="user-set-content-table"
        @on-selection-change="selectChange"
        @on-sort-change="handleUserSort">
      </Table>

      <div style="display: none;">
        <Table
          :columns="exportUserTableColumns"
          ref="exportUserTable">
        </Table>
      </div>
      <!-- 用户信息修改框 -->
      <Modal
        v-model="userInfoModal"
        :title="userInfo.username"
        @on-ok="commitUserInfo">
        <Form :model="userInfo" :rules="userInfoRule" ref="userInfoModal" :label-width="80">
          <FormItem label="Nickname" prop="nickname">
            <Input v-model="userInfo.nickname" :placeholder="userInfo.nickname"></Input>
          </FormItem>

          <FormItem label="Sex" prop="gender">
            <RadioGroup v-model="userInfo.gender">
              <Radio :label='1'><Icon type="md-male" /></Radio>
              <Radio :label='0'><Icon type="md-female" /></Radio>
              <Radio :label='2'><Icon type="md-help" /></Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="Student ID" prop="studentId">
            <Input v-model="userInfo.studentId" :placeholder="userInfo.studentId"></Input>
          </FormItem>

          <FormItem label="Phone" prop="phone">
            <Input v-model="userInfo.phone" :placeholder="userInfo.phone"></Input>
          </FormItem>

          <FormItem label="Email" prop="email">
            <Input v-model="userInfo.email" :placeholder="userInfo.email"></Input>
          </FormItem>

          <FormItem label="Role">
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
        title="Password"
        @on-ok="commitUserPassword">
        <Form ref="passwdForm" :model="userInfo" :rules="userInfoRule" :label-width="80">
          <FormItem label="Username" prop="username">
            <Input v-model="userInfo.username" :placeholder="userInfo.username" disabled></Input>
          </FormItem>

          <FormItem label="New password" prop="password">
            <Input type="password" v-model="userInfo.password" placeholder="输入密码"></Input>
          </FormItem>

          <FormItem label="Confirm password" prop="passwordCheck">
            <Input type="password" v-model="userInfo.passwordCheck" placeholder="确认密码"></Input>
          </FormItem>
        </Form>
      </Modal>
      <!-- 用户密码修改框 -->

    </Card>
    <div class="user-set-content-footer">
      <Button type="default" size="small" class="user-set-content-button" @click="addUser">Add</Button>
      <Button type="default" size="small" class="user-set-content-button" @click="deleteUser">Delete</Button>
      <Button type="default" size="small" class="user-set-content-button" @click="batchUser">Batch Import</Button>
      <Button type="default" size="small" class="user-set-content-button" @click="exportUser">Export</Button>
      <Page
        class="user-set-content-page"
        size="small" show-elevator show-sizer
        :total="totalNum"
        :current.sync="pageNow"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"/>
    </div>

    <!-- 添加用户模态框 -->
    <Modal
      v-model="addUserModal"
      title="Add user"
      @on-ok="commitAddUser">
      <Form ref="addUserModal" :model="userInfo" :rules="userInfoRule" :label-width="80">
        <FormItem label="Username" prop="username">
          <Input v-model="userInfo.username" placeholder="Username"></Input>
        </FormItem>

        <FormItem label="Nickname" prop="nickname">
          <Input v-model="userInfo.nickname" placeholder="Nickname"></Input>
        </FormItem>

        <FormItem label="Sex" prop="gender">
          <RadioGroup v-model="userInfo.gender">
            <Radio :label='1'><Icon type="md-male" /></Radio>
            <Radio :label='0'><Icon type="md-female" /></Radio>
            <Radio :label='2'><Icon type="md-help" /></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="Student ID" prop="studentId">
          <Input v-model="userInfo.studentId" placeholder="Student ID"></Input>
        </FormItem>

        <FormItem label="Phone" prop="phone">
          <Input v-model="userInfo.phone" placeholder="Phone"></Input>
        </FormItem>

        <FormItem label="Email" prop="email">
          <Input v-model="userInfo.email" placeholder="Email"></Input>
        </FormItem>

        <FormItem label="Role">
          <Select v-model="userInfo.roles" multiple>
            <Option value="user">user</Option>
            <Option value="admin">admin</Option>
            <Option value="superadmin">superadmin</Option>
          </Select>
        </FormItem>

        <FormItem label="Password" prop="password">
          <Input type="password" v-model="userInfo.password" placeholder="Password"></Input>
        </FormItem>

        <FormItem label="Confirm Password" prop="passwordCheck">
          <Input type="password" v-model="userInfo.passwordCheck" placeholder="Confirm password"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加用户模态框 -->

    <!-- 批量导入模态框 -->
    <Modal
      v-model="batchUserModal"
      title="Batch Import"
      @on-ok="commitBatchUser">
      <Form :model="userInfo" :rules="userInfoRule" :label-width="80">
        <FormItem label="Users">
          <Input v-model="userInfo.infoArea" type="textarea" :autosize="{minRows: 5,maxRows: 20}"
                 placeholder="/* username, password, email, separated by a space in each line. */">
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 批量导入模态框 -->
  </div>
</template>

<script>
import api from '@/utils/api'

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Password can not be empty'));
      }
      callback();
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value !== this.userInfo.password) {
        callback(new Error('Password dost not match'));
      } else {
        callback();
      }
    };
    return {
      userTableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: 'Username', key: 'username' },
        {
          title: 'Sex',
          key: 'gender',
          render: (h, params) => {
            var item = '女';
            if (params.row.gender === 1) {
              item = '男';
            } else if (params.row.gender === 2) item = '?';
            return h('div', item);
          }
        },
        { title: 'Student ID', key: 'studentId', sortable: 'true' },
        { title: 'Email', key: 'email' },
        {
          title: '\b',
          key: 'roles',
          render: (h, params) => {
            if (params.row.roles && params.row.roles.length > 0) {
              return h('div', { class: 'user-set-roles' },
                params.row.roles.map(item => {
                  return h('div', { class: 'user-set-rolebox' }, [
                    h('div', { class: 'user-set-role' }, item)
                  ])
                }));
            } else {
              return h('div');
            }
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
                    this.userInfoModal = true;
                    this.userInfo.username = params.row.username;
                    this.userInfo.nickname = params.row.nickname;
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
                    this.userPasswordModal = true;
                    this.userInfo.username = params.row.username;
                    this.userInfo.password = '';
                    this.userInfo.passwordCheck = '';
                  }
                }
              })
            ])
          }
        }
      ],
      // 表格导出格式
      exportUserTableColumns: [
        { title: 'userId', key: 'userId' },
        { title: 'username', key: 'username' },
        { title: 'nickname', key: 'nickname' },
        { title: 'email', key: 'email' },
        { title: 'emailVerified', key: 'emailVerified' },
        { title: 'phone', key: 'phone' },
        { title: 'gender', key: 'gender' },
        { title: 'studentId', key: 'studentId' },
        { title: 'roles', key: 'roles' }
      ],
      // 表格源数据
      userTableData: [],
      selectedUsers: [],
      totalNum: 100,
      pageNow: 1,
      pageSize: 10,
      sortBy: '',
      ascending: false,
      userInfoModal: false,
      userPasswordModal: false,
      addUserModal: false,
      batchUserModal: false,
      userInfo: {
        username: '',
        nickname: '',
        gender: 2, // 0-女, 1-男, 2-?
        studentId: '',
        phone: '',
        email: '',
        roles: [],
        password: '',
        passwordCheck: '',
        infoArea: '',
        userId: '',
        emailVerified: 0
      },
      userInfoRule: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 30,
            message: '用户名不能超过 30 个字符',
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: false,
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 30,
            message: '用户名不能超过 30 个字符',
            trigger: 'blur'
          }
        ],
        gender: [
          {
            type: 'number',
            required: false,
            trigger: 'change'
          }
        ],
        studentId: [
          {
            required: true,
            message: '学号不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            pattern: /[0-9]*/,
            message: '学号仅包含 0-9 的数字'
          }
        ],
        phone: [
          {
            required: false,
            trigger: 'blur'
          },
          {
            type: 'string',
            pattern: /[0-9]*/,
            min: 11,
            max: 11,
            message: '请输入 11 位手机号码'
          }
        ],
        email: [
          {
            required: true,
            massage: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入符合规范的邮箱地址'
          }
        ],
        roles: [
          {
            required: false,
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            min: 6,
            max: 32,
            message: '密码长度在 6 ~ 32 之间'
          },
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        passwordCheck: [
          {
            required: true,
            validator: validatePassCheck,
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 分页按钮
    onPageChange: function (pageNow) {
      this.pageNow = pageNow;
      this.getUserList();
    },
    onPageSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      this.getUserList();
    },
    handleUserSort: function ({ key, order }) {
      if (order === 'normal') {
        this.sortBy = '';
        this.ascending = false
      } else {
        this.sortBy = key;
        this.ascending = order === 'asc';
      }
    },
    // 表格全选
    selectChange: function (selection) {
      this.selectedUsers = selection;
    },
    // 修改用户信息
    commitUserInfo() {
      this.$refs.userInfoModal.validate(valid => {
        if (valid) {
          var data = {
            username: this.userInfo.username,
            nickname: this.userInfo.nickname,
            gender: this.userInfo.gender,
            studentId: this.userInfo.studentId,
            phone: this.userInfo.phone,
            email: this.userInfo.email,
            roles: this.userInfo.roles
          }
          api.updateUserInfo(data).then(_ => {
            this.$Message.success('Success');
            this.getUserList();
          }, _ => (this.$Message.error('Failed')));
        } else {
          this.$Message.error('Invalid format');
        }
      })
    },
    // 修改用户密码
    commitUserPassword() {
      this.$refs.passwdForm.validate(valid => {
        if (valid) {
          var data = {
            username: this.userInfo.username,
            password: this.userInfo.password
          }
          api.updateUserPasswd(data).then(_ => {
            this.$Message.success('Success');
          }, _ => (this.$Message.error('Failed')));
        } else {
          this.$Message.error('Invalid format');
        }
      })
    },
    // 添加用户按钮
    addUser() {
      this.addUserModal = true;
      this.userInfo.username = '';
      this.userInfo.nickname = '';
      this.userInfo.gender = 2;
      this.userInfo.studentId = '';
      this.userInfo.phone = '';
      this.userInfo.email = '';
      this.userInfo.roles = [];
      this.userInfo.password = '';
      this.userInfo.passwordCheck = '';
    },
    // 添加用户的确认按钮
    commitAddUser() {
      this.$refs.addUserModal.validate(valid => {
        if (valid) {
          var data = [{
            username: this.userInfo.username,
            nickname: this.userInfo.nickname,
            gender: this.userInfo.gender,
            studentId: this.userInfo.studentId,
            phone: this.userInfo.phone,
            email: this.userInfo.email,
            roles: this.userInfo.roles,
            password: this.userInfo.password
          }]
          api.addUsers(data).then(_ => {
            this.$Message.success('Success');
            this.getUserList();
          }, _ => (this.$Message.error('Failed')));
        } else {
          this.$Message.error('Invalid format');
        }
      })
    },
    // 批量导入用户按钮
    batchUser() {
      this.batchUserModal = true;
      this.userInfo.infoArea = '';
    },
    commitBatchUser() {
      var data = []
      var row_data = this.userInfo.infoArea.split('\n')
      var flag = 1
      row_data.forEach(function (item) {
        var tmp = item.split(' ')
        if (tmp.length < 3) {
          flag = 0
        } else {
          var tmp_json = {
            username: tmp[0],
            password: tmp[1],
            email: tmp[2]
          }
          data.push(tmp_json);
        }
      })
      if (flag === 0) {
        this.$Message.error('Invalid format');
      } else {
        api.addUsers(data).then(_ => {
          this.$Message.success('Success');
          this.getUserList();
        }, _ => (this.$Message.error('Failed')));
      }
    },
    // 删除用户按钮
    deleteUser() {
      if (this.selectedUsers.length === 0) {
        this.$Message.error('No selected users');
      } else {
        var data = []
        this.selectedUsers.forEach(function (item) {
          data.push(item.username);
        })
        api.deleteUsers(data).then(_ => {
          this.$Message.success('Success');
          this.getUserList();
        }, _ => (this.$Message.error('Failed')));
      }
    },
    // 文件导出按钮
    exportUser() {
      if (this.selectedUsers.length === 0) {
        this.$Message.error('No selected users');
      } else {
        var exportUserTableData = []
        this.selectedUsers.forEach(function (item) {
          exportUserTableData.push(item);
        })
        this.$refs.exportUserTable.exportCsv({
          quoted: true,
          filename: '用户数据',
          columns: this.exportUserTableColumns,
          data: exportUserTableData
        });
        this.$Message.success('Success');
      }
    },
    getUserList() {
      var params = {
        pageNow: this.pageNow,
        pageSize: this.pageSize
      }
      api.getUserList(params).then(ret => {
        this.totalNum = parseInt(ret.totalPage) * this.pageSize;
        this.userTableData = ret.rows;
      });
    }
  },
  mounted: function () {
    this.getUserList();
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
