<template>
  <div>
    <Card :dis-hover="true">
      <p slot="title">
        比赛管理
      </p>
      <Input placeholder="比赛搜索" style="width: auto" slot="extra">
        <Icon type="ios-search" slot="suffix"/>
      </Input>
      <Table
        :columns="contestTableColumns"
        :data="contestTableData"
        class="contest-set-content-table"
        @on-selection-change="selectChange"
        @on-sort-change="handleContestSort">
      </Table>

      <!-- 导出模块 -->
      <div style="display: none;">
        <Table
          :columns="exportContestTableColumns"
          ref="exportContestTable">
        </Table>
      </div>

      <!-- 比赛信息修改框 -->
      <Modal
        v-model="contestInfoModal"
        title="比赛基本信息"
        width="900px"
        :loading="modalLoading"
        @on-ok="commitContestInfo">
        <Form ref="contestInfoModal" :model="contestInfo" :rules="contestInfoRule" :label-width="115" class="modal-form">
          <FormItem label="比赛编号">
            <Input v-model="contestInfo.contestId" :placeholder="contestInfo.contestId" disabled></Input>
          </FormItem>

          <FormItem label="比赛标题" prop="contestTitle">
            <Input v-model="contestInfo.contestTitle" :placeholder="contestInfo.contestTitle"></Input>
          </FormItem>

          <FormItem label="比赛类型">
            <RadioGroup v-model="contestInfo.features.mode">
              <Radio label="oi">OI</Radio>
              <Radio label="acm">ACM</Radio>
              <Radio label="ioi">IOI</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="开放类型">
            <Select v-model="contestInfo.features.openness" :placeholder="contestInfo.features.openness">
                <Option value="public">公开 - 任何人可以看题与提交</Option>
                <Option value="protected">保护 - 任何人都能看题，但只有知道密码才能提交</Option>
                <Option value="private">私有 - 只有知道密码才能看题与提交</Option>
            </Select>
          </FormItem>

          <FormItem label="比赛密码" prop="password" v-if="contestInfo.features.openness !== 'public'">
            <Input v-model="contestInfo.password" :placeholder="contestInfo.password"></Input>
          </FormItem>
        
          <Row>
              <Col span="10">
                <FormItem label="开始时间" prop="gmtStart">
                    <DatePicker v-model="contestInfo.gmtStart" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择开始时间" style="width: 200px" @on-change="changeGmtStart"></DatePicker>
                </FormItem>
              </Col>
              <Col span="14">
                <FormItem label="时长（分钟）" prop="gmtLength">
                    <InputNumber v-model="contestInfo.gmtLength" :min="0" @on-change="changeGmtLength"></InputNumber>
                </FormItem>
              </Col>
          </Row>

          <FormItem label="结束时间" prop="gmtEnd">
            <DatePicker v-model="contestInfo.gmtEnd" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择结束时间" style="width: 200px" @on-change="changeGmtEnd"></DatePicker>
          </FormItem>

          <FormItem label="比赛来源" prop="source">
            <Input v-model="contestInfo.source" :placeholder="contestInfo.source"></Input>
          </FormItem>

          <FormItem label="比赛公告" prop="markdownDescription">
            <Input class="problemDatileMarkdownBox" v-model="contestInfo.markdownDescription" type="textarea"
            :autosize="{minRows: 3,maxRows: 6}"/>
          </FormItem>

          <FormItem label="比赛用户" prop="participants">
            <Input class="problemDatileMarkdownBox" v-model="contestInfo.participants" type="textarea" placeholder="以逗号分隔用户"
            :autosize="{minRows: 3,maxRows: 6}"/>
          </FormItem>

          <Table
              draggable
              :columns="addProblemTableColumns"
              :data="contestInfo.problems"
              @on-drag-drop="contestProblemDrag"
              class="contest-set-content-table modal-form-problem">
              <template slot-scope="{ index }" slot="deleteProblem">
                <Icon type="md-remove" style="color: #CD6155; cursor: pointer" @click="handleContestProblemDelete(index)" />
              </template>
              <template slot-scope="{ index }" slot="problemCode">
                  <Input v-model="contestInfo.problems[index].problemCode" :placeholder="contestInfo.problems[index].problemCode" @on-blur="blurProblemCodeInput(index)"></Input>
              </template>
              <template slot-scope="{ index }" slot="problemTitle">
                  <Input v-model="contestInfo.problems[index].problemTitle" :placeholder="contestInfo.problems[index].problemTitle"></Input>
              </template>
              <template slot-scope="{ index }" slot="problemWeight">
                  <InputNumber v-model="contestInfo.problems[index].problemWeight" :min="0"></InputNumber>
              </template>
              <template slot-scope="{ index }" slot="problemDescriptionId">
                <Select v-model="contestInfo.problems[index].problemDescriptionId" :placeholder="contestInfo.problems[index].problemDescriptionId" :transfer="true">
                  <template v-for="item in contestInfo.problems[index].problemDescriptionList">
                    <Option :value="item.id" :key="item.id" :name="item.id">{{ item.title }}</Option>
                  </template>
                </Select>
              </template>
          </Table>
        </Form>
      </Modal>
      <!-- 比赛信息修改框 -->

    </Card>
    <div class="contest-set-content-footer">
      <Button type="default" size="small" class="contest-set-content-button" @click="addContest">添加</Button>
      <Button type="default" size="small" class="contest-set-content-button" @click="deleteContest">删除</Button>
      <Button type="default" size="small" class="contest-set-content-button" @click="exportContest">文件导出</Button>
      <Page
        class="contest-set-content-page"
        size="small" show-elevator show-sizer
        :total="totalNum"
        :current.sync="pageNow"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"/>
    </div>

    <!-- 比赛创建框 -->
      <Modal
        v-model="addContestModal"
        title="创建比赛"
        width="900px"
        :loading="modalLoading"
        @on-ok="commitAddContest">
        <Form ref="addContestModal" :model="contestInfo" :rules="contestInfoRule" :label-width="115" class="modal-form">
          <FormItem label="比赛标题" prop="contestTitle">
            <Input v-model="contestInfo.contestTitle" :placeholder="contestInfo.contestTitle"></Input>
          </FormItem>

          <FormItem label="比赛类型">
            <RadioGroup v-model="contestInfo.features.mode">
              <Radio label="oi">OI</Radio>
              <Radio label="acm">ACM</Radio>
              <Radio label="ioi">IOI</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="开放类型">
            <Select v-model="contestInfo.features.openness" :placeholder="contestInfo.features.openness">
                <Option value="public">公开 - 任何人可以看题与提交</Option>
                <Option value="protected">保护 - 任何人都能看题，但只有知道密码才能提交</Option>
                <Option value="private">私有 - 只有知道密码才能看题与提交</Option>
            </Select>
          </FormItem>

          <FormItem label="比赛密码" prop="password" v-if="contestInfo.features.openness !== 'public'">
            <Input v-model="contestInfo.password" :placeholder="contestInfo.password"></Input>
          </FormItem>
        
          <Row>
              <Col span="10">
                <FormItem label="开始时间" prop="gmtStart">
                    <DatePicker v-model="contestInfo.gmtStart" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择开始时间" style="width: 200px" @on-change="changeGmtStart"></DatePicker>
                </FormItem>
              </Col>
              <Col span="14">
                <FormItem label="时长（分钟）" prop="gmtLength">
                    <InputNumber v-model="contestInfo.gmtLength" :min="0" @on-change="changeGmtLength"></InputNumber>
                </FormItem>
              </Col>
          </Row>

          <FormItem label="结束时间" prop="gmtEnd">
            <DatePicker v-model="contestInfo.gmtEnd" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择结束时间" style="width: 200px" @on-change="changeGmtEnd"></DatePicker>
          </FormItem>

          <FormItem label="比赛来源" prop="source">
            <Input v-model="contestInfo.source" :placeholder="contestInfo.source"></Input>
          </FormItem>

          <FormItem label="比赛公告" prop="markdownDescription">
            <Input class="problemDatileMarkdownBox" v-model="contestInfo.markdownDescription" type="textarea"
            :autosize="{minRows: 3,maxRows: 6}"/>
          </FormItem>

          <FormItem label="比赛用户" prop="participants">
            <Input class="problemDatileMarkdownBox" v-model="contestInfo.participants" type="textarea" placeholder="以逗号分隔用户"
            :autosize="{minRows: 3,maxRows: 6}"/>
          </FormItem>

          <Table
              draggable
              :columns="addProblemTableColumns"
              :data="contestInfo.problems"
              @on-drag-drop="contestProblemDrag"
              class="contest-set-content-table modal-form-problem">
              <template slot-scope="{ index }" slot="deleteProblem">
                <Icon type="md-remove" style="color: #CD6155; cursor: pointer" @click="handleContestProblemDelete(index)" />
              </template>
              <template slot-scope="{ index }" slot="problemCode">
                  <Input v-model="contestInfo.problems[index].problemCode" :placeholder="contestInfo.problems[index].problemCode" @on-blur="blurProblemCodeInput(index)"></Input>
              </template>
              <template slot-scope="{ index }" slot="problemTitle">
                  <Input v-model="contestInfo.problems[index].problemTitle" :placeholder="contestInfo.problems[index].problemTitle"></Input>
              </template>
              <template slot-scope="{ index }" slot="problemWeight">
                  <InputNumber v-model="contestInfo.problems[index].problemWeight" :min="0"></InputNumber>
              </template>
              <template slot-scope="{ index }" slot="problemDescriptionId">
                <Select v-model="contestInfo.problems[index].problemDescriptionId" :placeholder="contestInfo.problems[index].problemDescriptionId" :transfer="true">
                  <template v-for="item in contestInfo.problems[index].problemDescriptionList">
                    <Option :value="item.id" :key="item.id" :name="item.id">{{ item.title }}</Option>
                  </template>
                </Select>
              </template>
          </Table>
        </Form>
      </Modal>
      <!-- 比赛创建框 -->
  </div>
</template>

<script>
import api from '@/utils/api'
import utils from '@/utils';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    const validateDatetime = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error('日期不能为空'));
      }
    };
    return {
      // 比赛列表 - 列类型
      contestTableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          key: 'contestId',
          width: 80
        },
        {
          title: '标题',
          key: 'contestTitle',
          minWidth: 110
        },
        {
          title: '开始时间',
          key: 'gmtStart',
          sortable: 'custom',
          width: 180,
          render: (h, params) => {
            return h('Time', {
              props: {
                time: parseInt(params.row.gmtStart),
                type: 'datetime'
              }
            });
          }
        },
        {
          title: '比赛时长',
          key: 'gmtEnd',
          sortable: 'custom',
          width: 120,
          render: (h, params) => {
            return h('span', utils.time2hour(parseInt(params.row.gmtEnd) - parseInt(params.row.gmtStart)));
          }
        },
        {
          title: '类型',
          key: 'mode',
          sortable: 'custom',
          width: 90,
          render: (h, params) => {
            return h('div', params.row.features.mode.toUpperCase());
          }
        },
        {
          title: '人数',
          key: 'participantNum',
          sortable: 'custom',
          width: 90
        },
        {
          title: '\b',
          key: 'modify',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  icon: 'ios-construct'
                },
                on: {
                  click: () => {
                    if (params.row.username !== this.username) {
                      this.$Message.error('权限不足');
                    } else {
                      this.initialContestModal(params);
                    }
                  }
                }
              })
            ])
          }
        }
      ],
      // 比赛列表 - 列数据
      contestTableData: [],
      // 模态框加题 - 列类型
      addProblemTableColumns: [
        {
          key: 'operations',
          width: 40,
          align: 'center',
          renderHeader: (h, params) => {
            return h('Icon', {
              style: {
                color: 'green',
                cursor: 'pointer'
              },
              props: {
                type: 'md-add'
              },
              on: {
                click: () => {
                  this.handleContestProblemAdd();
                }
              }
            });
          },
          slot: 'deleteProblem'
        },
        {
          title: '题号',
          key: 'index',
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h('div', this.number2A(parseInt(params.index)));
          }
        },
        {
          title: '题目编码',
          key: 'problemCode',
          width: 150,
          align: 'center',
          slot: 'problemCode'
        },
        {
          title: '别名',
          key: 'problemTitle',
          align: 'center',
          slot: 'problemTitle'
        },
        {
          title: '题面',
          align: 'center',
          width: 200,
          key: 'problemDescriptionId',
          slot: 'problemDescriptionId'
        },
        {
          title: '权重',
          key: 'problemWeight',
          width: 100,
          align: 'center',
          slot: 'problemWeight'
        },
        {
          title: '合法',
          key: 'problemSearch',
          width: 70,
          align: 'center',
          render: (h, params) => {
            var index = params.index;
            if (this.contestInfo.problems[index].problemSearch !== undefined && this.contestInfo.problems[index].problemSearch === 1) {
              return h('Icon', {
                props: { type: 'md-checkmark' },
                style: { color: '#50ad56' }
              });
            } else {
              return h('Icon', {
                props: { type: 'md-close' },
                style: { color: '#CD6155' }
              });
            }
          }
        }
      ],
      selectedContest: [],
      // 表格导出的数据格式
      exportContestTableColumns: [
        { title: 'contestId', key: 'contestId' },
        { title: 'contestTitle', key: 'contestTitle' },
        { title: 'gmtStart', key: 'gmtStart' },
        { title: 'gmtEnd', key: 'gmtEnd' },
        { title: 'mode', key: 'mode' },
        { title: 'openness', key: 'openness' },
        { title: 'participantNum', key: 'participantNum' },
        { title: 'source', key: 'source' }
      ],
      totalNum: 100,
      pageNow: 1,
      pageSize: 10,
      totalContestNum: 0,
      sortBy: '',
      ascending: false,
      // 比赛信息修改模态框标记
      contestInfoModal: false,
      // 添加比赛模态框标记
      addContestModal: false,
      // 比赛加载标记,
      modalLoading: false,
      // 比赛字段
      contestInfo: {
        contestId: '',
        contestTitle: '',
        features: {
          mode: '',
          openness: ''
        },
        gmtStart: utils.time2date(0),
        gmtEnd: utils.time2date(0),
        source: '',
        markdownDescription: '',
        problems: [{
          problemCode: 'SDUOJ-1000',
          problemTitle: '假的题目标题3',
          problemWeight: 50,
          problemSearch: 0,
          problemDescriptionId: '3',
          problemDescriptionList: [{
            id: '3',
            title: '东东的俄文描述'
          }, {
            id: '5',
            title: '东东的日文描述'
          }]
        }],
        participants: '',
        password: '',
        gmtLength: 0
      },
      // 比赛字段规则
      contestInfoRule: {
        contestTitle: [{ required: true, message: '比赛标题不能为空', trigger: 'blur' }],
        gmtStart: [{ required: true, trigger: 'change', validator: validateDatetime }],
        gmtEnd: [{ required: true, trigger: 'change', validator: validateDatetime }],
        gmtLength: [{ type: 'number', required: true, message: '时长不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '比赛密码不能为空', trigger: 'blur' }],
        source: [{ required: false, trigger: 'blur' }],
        markdownDescription: [{ required: false, trigger: 'blur' }],
        problems: [{ required: false, trigger: 'blur' }],
        participants: [{ required: false, trigger: 'change' }]
      }
    }
  },
  methods: {
    // 二十六进制转换
    number2A: function (number) {
      var str = '';
      while (1) {
        var v = (number % 26) + 65;
        str = String.fromCharCode(v) + str;
        if (number < 26) {
          break;
        }
        number = parseInt(number / 26);
      }
      return str;
    },
    // 切换页面
    onPageChange: function (curPage) {
      this.pageNow = curPage;
      this.getContestList();
    },
    // 更改页面大小
    onPageSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      this.getContestList();
    },
    // 表格列排序
    handleContestSort: function ({ column, key, order }) {
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
      this.selectedContest = selection;
    },
    // 打开比赛模态框
    initialContestModal: function (params) {
      this.contestInfo.contestId = params.row.contestId;
      this.contestInfo.contestTitle = params.row.contestTitle;
      this.contestInfo.features = params.row.features;
      this.contestInfo.gmtStart = utils.time2date(new Date(parseInt(params.row.gmtStart)));
      this.contestInfo.gmtEnd = utils.time2date(new Date(parseInt(params.row.gmtEnd)));
      this.contestInfo.source = params.row.source;
      this.contestInfo.gmtLength = utils.time2minute(parseInt(params.row.gmtEnd) - parseInt(params.row.gmtStart));
      // get 获取 password、problems、participants、markdownDescription
      api.getContest({ contestId: params.row.contestId }).then(ret => {
        this.contestInfo.password = ret.password;
        this.contestInfo.problems = ret.problems;
        this.contestInfo.participants = ret.participants.toString();
        this.contestInfo.markdownDescription = ret.markdownDescription;
        if (this.contestInfo.problems) {
          this.contestInfo.problems.forEach(item => {
            item.problemSearch = 1;
            api.getProblemDescriptionList({ problemCode: item.problemCode }).then(ret2 => {
              this.$set(item, 'problemDescriptionList', ret2);
            })
          })
        }
        this.contestInfoModal = true;
        this.modalLoading = true;
      }, _ => { this.$Message('系统错误'); });
    },
    // 修改比赛开始时间
    changeGmtStart: function () {
      this.contestInfo.gmtEnd = this.contestInfo.gmtStart;
      this.contestInfo.gmtLength = 0;
    },
    // 修改比赛时长
    changeGmtLength: function () {
      if (this.contestInfo.gmtStart) {
        var date1 = new Date(this.contestInfo.gmtStart).getTime();
        var length = this.contestInfo.gmtLength * 60 * 1000;
        var date2 = date1 + length;
        this.contestInfo.gmtEnd = utils.time2date(new Date(parseInt(date2)));
      }
    },
    // 修改比赛结束时间
    changeGmtEnd: function () {
      if (this.contestInfo.gmtStart) {
        var date1 = new Date(this.contestInfo.gmtStart).getTime();
        var date2 = new Date(this.contestInfo.gmtEnd).getTime();
        var length = (date2 - date1) / 60000;
        if (length < 0) {
          this.contestInfo.gmtEnd = this.contestInfo.gmtStart;
          this.contestInfo.gmtLength = 0;
        } else {
          this.contestInfo.gmtLength = length;
        }
      }
    },
    // 比赛表单中题目拖拽
    contestProblemDrag: function (first, end) {
      first = parseInt(first);
      end = parseInt(end);
      var data = [];
      for (let i = 0; i < this.contestInfo.problems.length; i++) {
        if (i === end) {
          data.push(this.contestInfo.problems[first]);
        }
        if (i !== first) {
          data.push(this.contestInfo.problems[i]);
        }
      }
      this.$set(this.contestInfo, 'problems', data);
    },
    // 比赛信息修改模态框 - 加题按钮
    handleContestProblemAdd: function () {
      var problemItem = {
        problemCode: '',
        problemTitle: '',
        problemWeight: 1,
        problemSearch: 0,
        problemDescriptionId: '',
        problemDescriptionList: []
      }
      this.contestInfo.problems.push(problemItem);
    },
    // 比赛信息修改模态框 - 删题按钮
    handleContestProblemDelete: function(index) {
      var tmp = [];
      for (var i = 0; i < this.contestInfo.problems.length; i++) {
        if (i !== index) {
          tmp.push(this.contestInfo.problems[i]);
        }
      }
      this.$set(this.contestInfo, 'problems', tmp);
    },
    // 比赛信息修改模态框 - 题目编码查询 - 判断是否存在题库
    blurProblemCodeInput: function(index) {
      const tmp = this.contestInfo.problems[index];
      tmp.problemDescriptionList = [];
      tmp.problemDescriptionId = '';
      tmp.problemWeight = 0;
      if (this.contestInfo.problems[index].problemCode) {
        api.getProblem({ problemCode: this.contestInfo.problems[index].problemCode }).then(_ => {
          tmp.problemSearch = 1;
          tmp.problemWeight = 1;
          tmp.problemTitle = _.problemTitle;
          api.getProblemDescriptionList({ problemCode: this.contestInfo.problems[index].problemCode }).then(ret => {
            tmp.problemDescriptionList = ret;
            if (ret.length) {
              tmp.problemDescriptionId = ret[0].id;
            }
            this.$set(this.contestInfo.problems, index, tmp);
          })
        }, _ => {
          tmp.problemSearch = 0;          
          this.$set(this.contestInfo.problems, index, tmp);
        })
      } else {
        tmp.problemSearch = 0;
        this.$set(this.contestInfo.problems, index, tmp);
      }
    },
    // 获取表单中有效的题目
    getValidProblems: function () {
      var problems = [];
      this.contestInfo.problems.forEach(item => {
        if (item.problemSearch === 1) {
          var params = {
            problemCode: item.problemCode,
            problemTitle: item.problemTitle,
            problemDescriptionId: item.problemDescriptionId,
            problemWeight: item.problemWeight
          };
          problems.push(params);
        }
      })
      return problems;
    },
    // 构建表单要传输的数据
    getValidFormData: function () {
      var data = {
        features: this.contestInfo.features,
        contestTitle: this.contestInfo.contestTitle,
        gmtStart: new Date(this.contestInfo.gmtStart).getTime(),
        gmtEnd: new Date(this.contestInfo.gmtEnd).getTime(),
        password: this.contestInfo.password,
        source: this.contestInfo.source,
        markdownDescription: this.contestInfo.markdownDescription,
        participants: this.contestInfo.participants.split(',')
      }
      return data;
    },
    // 比赛信息修改模态框 - 确认按钮
    commitContestInfo() {
      this.$refs.contestInfoModal.validate(valid => {
        if (valid) {
          var problems = this.getValidProblems();
          if (problems.length === 0) {
            this.$Message.error('至少添加一道题');
            this.modalLoading = false;
            this.$nextTick(() => {
              this.modalLoading = true;
            });
          } else {
            var data = this.getValidFormData();
            data.contestId = this.contestInfo.contestId;
            data.problems = problems;
            api.updateContest(data).then(_ => {
              this.$Message.success('修改成功');
              this.modalLoading = false;
              this.contestInfoModal = false;
              this.getContestList();
            }, _ => {
              this.$Message.error('修改失败');
              this.modalLoading = false;
              this.contestInfoModal = false;
            });
          }
        } else {
          this.$Message.error('格式不符');
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          });
        }
      })
    },
    // 添加比赛按钮
    addContest() {
      this.addContestModal = true;
      this.modalLoading = true;
      this.contestInfo.ProblemCode = '';
      this.contestInfo.contestTitle = '';
      this.contestInfo.features = {
        mode: 'acm',
        openness: 'public'
      };
      this.contestInfo.gmtStart = utils.time2date(new Date().getTime());
      this.contestInfo.gmtEnd = utils.time2date(new Date().getTime());
      this.contestInfo.source = '';
      this.contestInfo.markdownDescription = '';
      this.contestInfo.problems = [];
      this.contestInfo.participants = '';
      this.contestInfo.password = '';
      this.contestInfo.gmtLength = 0;
    },
    // 创建比赛模态框 - 确认按钮
    commitAddContest() {
      this.$refs.addContestModal.validate(valid => {
        if (valid) {
          var problems = this.getValidProblems();
          if (problems.length === 0) {
            this.$Message.error('至少添加一道题');
            this.modalLoading = false;
            this.$nextTick(() => {
              this.modalLoading = true;
            });
          } else {
            var data = this.getValidFormData();
            data.problems = problems;
            api.createContest(data).then(_ => {
              this.$Message.success('创建成功');
              this.modalLoading = false;
              this.addContestModal = false;
              this.getContestList();
            }, _ => {
              this.$Message.error('创建失败');
              this.modalLoading = false;
              this.addContestModal = false;
            });
          }
        } else {
          this.$Message.error('格式不符');
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          });
        }
      })
    },
    // 删除比赛按钮
    deleteContest() {

    },
    // 比赛导出按钮
    exportContest() {
      if (this.selectedContest.length === 0) {
        this.$Message.error('无用户被选中');
      } else {
        var exportContestTableData = []
        this.selectedContest.forEach(function (item) {
          var item2 = {
            contestId: item.contestId,
            contestTitle: item.contestTitle,
            gmtStart: utils.time2date(new Date(parseInt(item.gmtStart))),
            gmtEnd: utils.time2date(new Date(parseInt(item.gmtEnd))),
            mode: item.features.mode,
            openness: item.features.openness,
            participantNum: item.participantNum,
            source: item.source
          };
          exportContestTableData.push(item2);
        });
        this.$refs.exportContestTable.exportCsv({
          quoted: true,
          filename: '比赛数据',
          columns: this.exportContestTableColumns,
          data: exportContestTableData
        });
        this.$Message.success('导出成功');
      }
    },
    // 获取比赛列表
    getContestList() {
      var params = {
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        sortBy: this.sortBy,
        ascending: this.ascending
      }
      api.getContestList(params).then(ret => {
        this.contestTableData = ret.rows;
        this.totalNum = parseInt(ret.total)
      })
    }
  },
  computed: {
    ...mapState(['footerInfo']),
    ...mapGetters('user', ['username', 'avatar'])
  },
  mounted: function () {
    this.getContestList();
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
}
/deep/ .contest-set-content-table {
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
  .contest-set-name {
    float: left;
  }
}

// 分页栏
.contest-set-content-footer {
  margin-top: 12px;
  .contest-set-content-page {
      float: right;
  }
  .contest-set-content-button {
      float: left;
      margin-right: 5px;
  }
}

// textarea 框
.problemDatileMarkdownBox {
  /deep/ .ivu-input:hover {
      border-color: #dcdee2;
  }
  /deep/ .ivu-input:focus {
      border-color: #b4bbbf;
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

// 模态框 - 表单
.modal-form {
  margin-right: 30px;
}
/deep/ .modal-form-problem {
  margin-left: 30px;
  .ivu-table-header th {
    border-color: transparent;
  }
  .ivu-table-row td {
    border-color: transparent;
  }
  .ivu-table th, .ivu-table td {
    border: none;
  }
}
</style>