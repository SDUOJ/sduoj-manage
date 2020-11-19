<template>
  <div>
    <Card dis-hover title="User">
      <Table
        :columns="userTableColumns"
        :data="userTableData"
        class="content-table"
        @on-selection-change="selectChange"
        @on-sort-change="onSort">
        <template slot-scope="{ row }" slot="gender">
          <Icon v-if="row.gender === 0" type="md-female"/>
          <Icon v-else-if="row.gender === 1" type="md-male"/>
          <Icon v-else-if="row.gender === 2" type="md-help"/>
        </template>
        <template slot-scope="{ row }" slot="role">
          <span class="roles" v-for="role in row.roles" :key="role">
            <Tag :color="USER_ROLE[role].color">{{ role }}</Tag>
          </span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <span class="clickable" @click="onEditUser(row)">Edit</span>
          <Divider type="vertical" />
          <span class="clickable" @click="onChangePassword(row)">Password</span>
        </template>
      </Table>

    </Card>
    <div class="footer-tools">
      <Button type="default" size="small" class="float-left footer-btn" @click="addUser">Add</Button>
      <Button type="default" size="small" class="float-left footer-btn" @click="deleteUser">Delete</Button>
      <Button type="default" size="small" class="float-left footer-btn" @click="batchUser">Import</Button>
      <Button type="default" size="small" class="float-left footer-btn" @click="exportUser">Export</Button>
      <Page
        class="float-right"
        size="small" show-elevator show-sizer
        :total="total"
        :current.sync="pageNow"
        :page-size="pageSize"
        :page-size-opts="pageSizeOpts"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"/>
    </div>

    <!-- 用户信息修改框 -->
    <Modal
      v-model="userInfoModal"
      :title="userInfo.username"
      :loading="loading"
      @on-ok="commitUserInfo">
      <Form :model="userInfo" :rules="userInfoRule" ref="userInfoModal">
        <FormItem label="Nickname" prop="nickname">
          <Input v-model="userInfo.nickname" :placeholder="userInfo.nickname" />
        </FormItem>

        <FormItem label="Sex" prop="gender">
          <RadioGroup v-model="userInfo.gender">
            <Radio :label='1'><Icon type="md-male"/></Radio>
            <Radio :label='0'><Icon type="md-female"/></Radio>
            <Radio :label='2'><Icon type="md-help"/></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="Student ID" prop="studentId">
          <Input v-model="userInfo.studentId" :placeholder="userInfo.studentId" />
        </FormItem>

        <FormItem label="Phone" prop="phone">
          <Input v-model="userInfo.phone" :placeholder="userInfo.phone" />
        </FormItem>

        <FormItem label="Email" prop="email">
          <Input v-model="userInfo.email" :placeholder="userInfo.email" />
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
      :loading="loading"
      @on-ok="commitUserPassword">
      <Form ref="passwdForm" :model="userInfo" :rules="userInfoRule" :label-width="80">
        <FormItem label="Username">
          <span>{{ userInfo.username }}</span>
        </FormItem>

        <FormItem label="New password" prop="password">
          <Input type="password" v-model="userInfo.password" />
        </FormItem>

        <FormItem label="Confirm password" prop="passwordCheck">
          <Input type="password" v-model="userInfo.passwordCheck" />
        </FormItem>
      </Form>
    </Modal>
    <!-- 用户密码修改框 -->

    <!-- 添加用户模态框 -->
    <Modal
      v-model="addUserModal"
      title="Add user"
      :loading="loading"
      @on-ok="commitAddUser">
      <Form ref="addUserModal" :model="userInfo" :rules="userInfoRule">
        <FormItem label="Username" prop="username">
          <Input v-model="userInfo.username" />
        </FormItem>

        <FormItem label="Nickname" prop="nickname">
          <Input v-model="userInfo.nickname" />
        </FormItem>

        <FormItem label="Sex" prop="gender">
          <RadioGroup v-model="userInfo.gender">
            <Radio :label="1"><Icon type="md-male"/></Radio>
            <Radio :label="0"><Icon type="md-female"/></Radio>
            <Radio :label="2"><Icon type="md-help"/></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="Student ID" prop="studentId">
          <Input v-model="userInfo.studentId" />
        </FormItem>

        <FormItem label="Phone" prop="phone">
          <Input v-model="userInfo.phone" />
        </FormItem>

        <FormItem label="Email" prop="email">
          <Input v-model="userInfo.email" />
        </FormItem>
        <FormItem label="Email Verify" prop="email">
          <i-switch v-model="userInfo.emailVerified" :true-value="1" :false-value="0" />
        </FormItem>

        <FormItem label="Role">
          <Select v-model="userInfo.roles" multiple>
            <Option value="user">user</Option>
            <Option value="admin">admin</Option>
            <Option value="superadmin">superadmin</Option>
          </Select>
        </FormItem>

        <FormItem label="Password" prop="password">
          <Input type="password" v-model="userInfo.password" />
        </FormItem>

        <FormItem label="Confirm Password" prop="passwordCheck">
          <Input type="password" v-model="userInfo.passwordCheck" />
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加用户模态框 -->

    <!-- 批量导入模态框 -->
    <Modal
      v-model="batchUserModal"
      title="Import"
      width="80%"
      :loading="loading"
      @on-ok="commitBatchUser">
      <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff" />
          <strong>Only support .xlsx and .xls</strong>
          <p>Click or drag files here to upload</p>
        </div>
      </UploadExcel>
      <span class="float-right"><a href="/excel/user.xlsx" target="_blank" download="user.xlsx">Sample</a></span>
      <br />
      <Table :max-height="600" :columns="excelColumns" :data="excelData" v-if="excelData.length > 0" />
    </Modal>
    <!-- 批量导入模态框 -->

    <div style="display: none;">
      <Table ref="exportUserTable" />
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'
import { USER_ROLE } from '_u/constants';
import { Page, Excel } from '_c/mixins';
import UploadExcel from '_c/upload/UploadExcel';

export default {
  mixins: [Page, Excel],
  components: {
    UploadExcel
  },
  data: function () {
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
        { key: 'userId' },
        { title: 'Username', key: 'username' },
        { title: 'Sex', slot: 'gender' },
        { title: 'Student ID', key: 'studentId', sortable: 'true' },
        { title: 'Email', key: 'email' },
        { title: 'Roles', slot: 'role' },
        { title: '\b', slot: 'action' }
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
      userInfoRule: {
        username: [
          { required: true, message: 'Username can not be empty', trigger: 'blur' },
          { type: 'string', max: 30, message: 'Maximum 30 characters', trigger: 'blur' }
        ],
        nickname: [
          { type: 'string', max: 30, message: 'Maximum 30 characters', trigger: 'blur' }
        ],
        studentId: [
          { type: 'string', pattern: /[0-9]*/, message: 'Only contain numbers' }
        ],
        phone: [
          { type: 'string', pattern: /[0-9]*/, min: 11, max: 16 }
        ],
        email: [
          { required: true, massage: 'Email can not be empty', trigger: 'blur' },
          { type: 'email', message: 'Invalid email address' }
        ],
        password: [
          { required: true, trigger: 'blur', min: 6, max: 32, message: 'Password length is between 6 and 32' }
        ],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: 'change' }
        ]
      },
      // 表格源数据
      userTableData: [],
      selectedUsers: [],
      userInfoModal: false,
      userPasswordModal: false,
      addUserModal: false,
      batchUserModal: false,
      userInfo: {},
      loading: true
    }
  },
  methods: {
    onEditUser: function(row) {
      this.userInfo = { ...row };
      this.userInfoModal = true;
    },
    onChangePassword: function(row) {
      this.userInfo = {
        ...row,
        password: '',
        passwordCheck: ''
      };
      this.userPasswordModal = true;
    },
    // 表格全选
    selectChange: function (selection) {
      this.selectedUsers = selection;
    },
    // 修改用户信息
    commitUserInfo() {
      this.$refs.userInfoModal.validate(valid => {
        if (valid) {
          const data = { ...this.userInfo };
          delete this.userInfo.password;
          delete this.userInfo.passwordCheck;
          api.updateUserInfo(data).then(_ => {
            this.$Message.success('Success');
            this.getUserList();
            this.userInfoModal = false;
          }, err => {
            this.$Message.error(err.message);
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            })
          });
        } else {
          this.$Message.error('Invalid format');
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          })
        }
      })
    },
    // 修改用户密码
    commitUserPassword() {
      this.$refs.passwdForm.validate(valid => {
        if (valid) {
          api.updateUserPasswd({
            username: this.userInfo.username,
            password: this.userInfo.password
          }).then(_ => {
            this.$Message.success('Success');
            this.userPasswordModal = false;
          }, err => {
            this.$Message.error(err.message);
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            })
          });
        } else {
          this.$Message.error('Invalid format');
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          })
        }
      })
    },
    // 添加用户按钮
    addUser() {
      this.userInfo = {
        username: '',
        nickname: '',
        gender: 2,
        studentId: '',
        phone: '',
        email: '',
        emailVerified: 1,
        roles: [],
        password: '',
        passwordCheck: ''
      }
      this.addUserModal = true;
    },
    // 添加用户的确认按钮
    commitAddUser() {
      this.$refs.addUserModal.validate(valid => {
        if (valid) {
          const data = { ...this.userInfo };
          delete data.passwordCheck;
          api.addUsers([data]).then(_ => {
            this.$Message.success('Success');
            this.getUserList();
            this.addUserModal = false;
          }, err => {
            this.$Message.error(err.message);
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            })
          });
        } else {
          this.$Message.error('Invalid format');
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          })
        }
      })
    },
    // 批量导入用户按钮
    batchUser() {
      this.batchUserModal = true;
    },
    commitBatchUser() {
      if (this.excelData.length === 0) {
        this.$Message.error('No data');
      } else {
        this.excelData.forEach(o => {
          o.emailVerified = parseInt(o.emailVerified) || 0;
          o.gender = parseInt(o.gender) || 2;
        });
        api.addUsers(this.excelData).then(_ => {
          this.$Message.success('Success');
          this.getUserList();
          this.clearExcel();
          this.batchUserModal = false;
        }, err => {
          this.$Message.error(err.message);
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          })
        });
      }
    },
    // 删除用户按钮
    deleteUser() {
      if (this.selectedUsers.length === 0) {
        this.$Message.error('No selected users');
      } else {
        api.deleteUsers(this.selectedUsers.map(o => o.username))
          .then(_ => {
            this.$Message.success('Success');
            this.getUserList();
          }, err => {
            this.$Message.error(err.message);
          });
      }
    },
    // 文件导出按钮
    exportUser() {
      if (this.selectedUsers.length === 0) {
        this.$Message.error('No selected users');
      } else {
        this.$refs.exportUserTable.exportCsv({
          quoted: true,
          filename: 'users',
          columns: this.exportUserTableColumns,
          data: this.selectedUsers
        });
        this.$Message.success('Success');
      }
    },
    getUserList() {
      api.getUserList({
        pageNow: this.pageNow,
        pageSize: this.pageSize
      }).then(ret => {
        this.total = parseInt(ret.totalPage) * this.pageSize;
        this.userTableData = ret.rows;
      });
    }
  },
  computed: {
    USER_ROLE: () => USER_ROLE
  },
  mounted: function () {
    this.getUserList();
  },
  watch: {
    $route: function () {
      this.getUserList();
    }
  }
}
</script>

<style lang="less" scoped>
  // 修改按钮
  /deep/ .ivu-table-row {
    .ivu-btn {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
</style>
