<template>
  <div>
    <Card :dis-hover="true">
      <p slot="title">Contest</p>
      <Table
        :columns="contestTableColumns"
        :data="contestTableData"
        class="content-table"
        @on-selection-change="selectChange"
        @on-sort-change="onSort">
        <template slot-scope="{ row }" slot="title">
          <span>{{ row.contestTitle }}</span>
          <Icon v-if="row.features.openness === CONTEST_OPENNESS.PRIVATE" type="md-lock" color="#d9534f" size="19" />
          <Icon v-else-if="row.features.openness === CONTEST_OPENNESS.PROTECTED" type="md-lock" color="orange" size="19" />
        </template>
        <template slot-scope="{ row }" slot="time">
          <Time :time="row.gmtStart | parseInt" type="datetime" />
        </template>
        <template slot-scope="{ row }" slot="duration">
          <span>{{ ((row.gmtEnd | parseInt) - (row.gmtStart | parseInt)) | s2hs }}</span>
        </template>
        <template slot-scope="{ row }" slot="mode">
          <span>{{ row.features.mode.toUpperCase() }}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <span class="clickable" @click="initialContestModal(row, false)">Edit</span>
          <Divider type="vertical" />
          <span class="clickable" @click="initialContestModal(row, true)">Fork</span>
        </template>
      </Table>
    </Card>
    <div class="footer-tools">
      <Button type="default" size="small" class="footer-btn float-left" @click="addContest">Add</Button>
      <Button type="default" size="small" class="footer-btn float-left" @click="exportContest">Export</Button>
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

    <!-- 导出模块 -->
    <div style="display: none;">
      <Table :columns="exportContestTableColumns" ref="exportContestTable"/>
    </div>

    <!-- 比赛信息修改框 -->
    <Modal
      v-model="contestInfoModal"
      width="60%"
      :title="isAddContest ? 'Create Contest' : contestInfo.contestId"
      :loading="modalLoading"
      @on-ok="commitContestInfo">
      <Form ref="contestInfoModal" :model="contestInfo" :rules="contestInfoRules" class="modal-form">
        <FormItem label="Title" prop="contestTitle" required>
          <Input v-model="contestInfo.contestTitle" :placeholder="contestInfo.contestTitle"></Input>
        </FormItem>
        <FormItem label="Mode" required>
          <RadioGroup v-model="contestInfo.features.mode">
            <Radio label="oi">OI</Radio>
            <Radio label="acm">ACM</Radio>
            <Radio label="ioi">IOI</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Public" required>
          <i-switch v-model="contestInfo.isPublic" :true-value="1" :false-value="0" />
        </FormItem>
        <FormItem label="Openness" required>
          <Select v-model="contestInfo.features.openness" :placeholder="contestInfo.features.openness">
            <Option value="public">公开 - 任何人可以看题与提交</Option>
            <Option value="protected">保护 - 任何人都能看题，但只有知道密码才能提交</Option>
            <Option value="private">私有 - 只有知道密码才能看题与提交</Option>
          </Select>
        </FormItem>
        <FormItem label="Password" v-if="contestInfo.features.openness !== CONTEST_OPENNESS.PUBLIC" required>
          <Input v-model="contestInfo.password" />
        </FormItem>
        <Row>
          <Col span="10">
            <FormItem label="Start" required>
              <DatePicker v-model="contestInfo.gmtStart" type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 200px" @on-change="changeGmtStart" :disabled="!isAddContest && now > contestInfo.gmtStart" />
            </FormItem>
          </Col>
          <Col span="14">
            <FormItem label="Duration" required>
              <InputNumber v-model="contestInfo.gmtLength" :min="0" @on-change="changeGmtLength" />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="End" required>
          <DatePicker v-model="contestInfo.gmtEnd" type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 200px" @on-change="changeGmtEnd" />
        </FormItem>
        <FormItem label="Source" prop="source">
          <Input v-model="contestInfo.source" />
        </FormItem>
        <FormItem label="Announcement">
          <Input v-model="contestInfo.markdownDescription" type="textarea" :autosize="{minRows: 3}"/>
        </FormItem>
        <FormItem label="Participants">
          <Input v-model="contestInfo.participants" type="textarea" :autosize="{minRows: 3}"/>
          <span style="color: #bbb">Separate username by a TAB '\t', SPACE ' ', NEW LINE '\n' or COMMA ','</span>
        </FormItem>

        <FormItem label="Unofficial Participants" prop="unofficialParticipants">
          <Input v-model="contestInfo.unofficialParticipants" type="textarea" :autosize="{minRows: 3}"/>
          <span style="color: #bbb">Separate username by a TAB '\t', SPACE ' ', NEW LINE '\n' or COMMA ','</span>
        </FormItem>

        <FormItem label="Frozen" required>
          <InputNumber v-model="contestInfo.features.frozenTime" :min="0" />
        </FormItem>

        <FormItem label="While Running">
          <Checkbox v-model="contestInfo.features.contestRunning.displayPeerSubmission" :true-value="1" :false-value="0">Show Peer Submission</Checkbox>
          <Checkbox v-model="contestInfo.features.contestRunning.displayRank" :true-value="1" :false-value="0">Show Rank</Checkbox>
          <Checkbox v-model="contestInfo.features.contestRunning.displayJudgeScore" :true-value="1" :false-value="0">Show Judge Score</Checkbox>
          <Checkbox v-model="contestInfo.features.contestRunning.displayCheckpointResult" :true-value="1" :false-value="0">Show Checkpoint Results</Checkbox>
        </FormItem>
        <FormItem label="After Finished">
          <Checkbox v-model="contestInfo.features.contestEnd.displayPeerSubmission" :true-value="1" :false-value="0">Show Peer Submission</Checkbox>
          <Checkbox v-model="contestInfo.features.contestEnd.displayRank" :true-value="1" :false-value="0">Show Rank</Checkbox>
          <Checkbox v-model="contestInfo.features.contestEnd.displayJudgeScore" :true-value="1" :false-value="0">Show Judge Score</Checkbox>
          <Checkbox v-model="contestInfo.features.contestEnd.displayCheckpointResult" :true-value="1" :false-value="0">Show Checkpoint Results</Checkbox>
        </FormItem>
        <FormItem prop="problems">
          <Table
            disabled-hover
            :max-height="600"
            :columns="addProblemTableColumns"
            :data="contestInfo.problems"
            class="modal-form-problem">
            <template slot-scope="{ index }" slot="deleteProblem">
              <span class="hover" @click="move(index, 1)"><Icon type="md-arrow-down" /></span>
              <span class="hover" @click="move(index, -1)" style="margin: 0 5px"><Icon type="md-arrow-up" /></span>
              <span class="hover" @click="handleContestProblemDelete(index)"><Icon type="md-remove" color="#CD6155" /></span>
            </template>
            <template slot-scope="{ index }" slot="index">
              <span>{{ index | contestProblemId }}</span>
            </template>
            <template slot-scope="{ index }" slot="problemCode">
              <Input
                v-model="contestInfo.problems[index].problemCode"
                @on-focus="contestInfo.problems[index].oldProblemCode = contestInfo.problems[index].problemCode"
                @on-blur="blurProblemCodeInput(index)" />
            </template>
            <template slot-scope="{ index }" slot="problemTitle">
              <Input v-model="contestInfo.problems[index].problemTitle" />
            </template>
            <template slot-scope="{ index }" slot="problemWeight">
              <InputNumber v-model="contestInfo.problems[index].problemWeight" :min="0" />
            </template>
            <template slot-scope="{ index }" slot="problemDescriptionId">
              <Select v-model="contestInfo.problems[index].problemDescriptionId" transfer>
                <Option v-for="item in contestInfo.problems[index].problemDescriptionList" :key="item.id" :value="item.id" :label="item.title" />
              </Select>
            </template>
            <template slot-scope="{ index }" slot="color">
              <ColorPicker v-model="contestInfo.problems[index].problemColor" transfer />
            </template>
            <template slot-scope="{ index }" slot="check">
              <Icon v-if="contestInfo.problems[index].problemSearch === 1" type="md-checkmark" color="#50ad56" />
              <Icon v-else type="md-close" color="#CD6155" />
            </template>
          </Table>
        </FormItem>
      </Form>
    </Modal>
    <!-- 比赛信息修改框 -->

  </div>
</template>

<script>
import api from '@/utils/api'
import moment from 'moment';
import { mapGetters, mapState } from 'vuex';

import { Page } from '_c/mixins';
import { CONTEST_OPENNESS } from '_u/constants';
function contestProblemId(problemCode) {
  problemCode = parseInt(problemCode);
  const str = [];
  do {
    const ch = problemCode % 26;
    if (str.length === 0) {
      str.push(String.fromCharCode(65 + ch));
    } else {
      str.push(String.fromCharCode(64 + ch));
    }
    problemCode = parseInt(problemCode / 26);
  } while (problemCode > 0)
  return str.reverse().join('');
}

export default {
  mixins: [Page],
  data: function() {
    const validateUnofficialParticipants = (rule, value, callback) => {
      const participants = this.contestInfo.participants.split(/[\s,]+/);
      const observers = this.contestInfo.unofficialParticipants.split(/[\s,]+/);
      for (let i = 0; i < observers.length; ++i) {
        if (observers[i] && !participants.includes(observers[i])) {
          callback(new Error('Unofficial participants must be the subset of participants'));
          return;
        }
      }
      callback();
    };
    return {
      // 比赛列表 - 列类型
      contestTableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        { key: 'contestId' },
        { title: 'Title', slot: 'title' },
        { title: 'Owner', key: 'username' },
        { title: 'Start', key: 'gmtStart', sortable: 'custom', slot: 'time' },
        { title: 'Duration', sortable: 'custom', slot: 'duration' },
        { title: 'Mode', key: 'mode', sortable: 'custom', slot: 'mode' },
        { title: 'Participants', key: 'participantNum', sortable: 'custom' },
        { title: '\b', slot: 'action' }
      ],
      // 比赛列表 - 列数据
      contestTableData: [],
      // 模态框加题 - 列类型
      addProblemTableColumns: [
        {
          title: '\b',
          width: 100,
          align: 'right',
          slot: 'deleteProblem',
          renderHeader: h =>
            h('Icon', {
              class: 'hover',
              props: { type: 'md-add', color: 'green' },
              on: { click: this.handleContestProblemAdd }
            })
        },
        { width: 80, slot: 'index' },
        { title: 'Problem', width: 150, slot: 'problemCode' },
        { title: 'Alias', slot: 'problemTitle' },
        { title: 'Description', width: 200, slot: 'problemDescriptionId' },
        { title: 'Weight', width: 100, slot: 'problemWeight' },
        { title: 'Color', slot: 'color' },
        { title: '\b', width: 70, slot: 'check' }
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
      contestInfoRules: {
        unofficialParticipants: [
          { validator: validateUnofficialParticipants, trigger: 'blur' }
        ]
      },
      // 比赛信息修改模态框标记
      contestInfoModal: false,
      // 添加比赛模态框标记
      isAddContest: false,
      // 比赛加载标记,
      modalLoading: true,
      // 比赛字段
      contestInfo: {
        features: {
          contestRunning: {},
          contestEnd: {}
        }
      },
      oldProblemCode: '',
      now: 0
    }
  },
  filters: {
    parseInt: val => parseInt(val),
    s2hs: diff => {
      const duration = moment.duration(diff, 'milliseconds');
      const minutes = duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes().toString();
      const seconds = duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds().toString();
      return [Math.floor(duration.asHours()), minutes, seconds].join(':');
    },
    // 二十六进制转换
    contestProblemId: problemCode => contestProblemId(problemCode)
  },
  methods: {
    // 表格全选
    selectChange: function (selection) {
      this.selectedContest = selection;
    },
    // 打开比赛模态框
    initialContestModal: function (row, fork) {
      this.now = moment.now();
      this.contestInfo = {
        ...row,
        gmtStart: moment(new Date(parseInt(row.gmtStart))).format('yyy-MM-DD HH:mm:ss'),
        gmtEnd: moment(new Date(parseInt(row.gmtEnd))).format('yyy-MM-DD HH:mm:ss'),
        gmtLength: parseInt((parseInt(row.gmtEnd) - parseInt(row.gmtStart)) / 60000)
      };
      // get 获取 password、problems、participants、markdownDescription
      api.getContest({ contestId: row.contestId }).then(ret => {
        this.$set(this.contestInfo, 'password', ret.password);
        this.$set(this.contestInfo, 'problems', ret.problems);
        this.$set(this.contestInfo, 'participants', ret.participants.join(','));
        this.$set(this.contestInfo, 'unofficialParticipants', ret.unofficialParticipants.join(','));
        this.$set(this.contestInfo, 'markdownDescription', ret.markdownDescription);
        if (this.contestInfo.problems) {
          this.contestInfo.problems.forEach(item => {
            item.problemSearch = 1;
            api.getProblemDescriptionList({ problemCode: item.problemCode }).then(ret2 => {
              this.$set(item, 'problemDescriptionList', ret2);
            })
          })
        }
        this.isAddContest = fork;
        this.contestInfoModal = true;
      }, err => {
        this.$Message.error(err.message);
      });
    },
    // 修改比赛开始时间
    changeGmtStart: function () {
      this.contestInfo.gmtEnd = this.contestInfo.gmtStart;
      this.contestInfo.gmtLength = 0;
    },
    // 修改比赛时长
    changeGmtLength: function () {
      if (this.contestInfo.gmtStart) {
        const start = new Date(this.contestInfo.gmtStart).getTime();
        const length = this.contestInfo.gmtLength * 60000;
        this.contestInfo.gmtEnd = moment(new Date(start + length)).format('yyy-MM-DD HH:mm:ss');
      }
    },
    // 修改比赛结束时间
    changeGmtEnd: function () {
      if (this.contestInfo.gmtStart) {
        const contestStartTime = new Date(this.contestInfo.gmtStart).getTime();
        const contestEndTime = new Date(this.contestInfo.gmtEnd).getTime();
        const length = (contestEndTime - contestStartTime) / 60000;
        if (length < 0) {
          this.contestInfo.gmtEnd = this.contestInfo.gmtStart;
          this.contestInfo.gmtLength = 0;
        } else {
          this.contestInfo.gmtLength = length;
        }
      }
    },
    // 比赛表单中题目拖拽
    move: function (index, dir) {
      if (index === 0 && dir === -1) {
        return;
      }
      if (index === this.contestInfo.problems.length - 1 && dir === 1) {
        return;
      }
      const tmp = { ...this.contestInfo.problems[index] };
      this.$set(this.contestInfo.problems, index, this.contestInfo.problems[index + dir]);
      this.$set(this.contestInfo.problems, index + dir, tmp);
    },
    // 比赛信息修改模态框 - 加题按钮
    handleContestProblemAdd: function () {
      let problemCode = '';
      if (this.contestInfo.problems.length > 0) {
        const tmp = this.contestInfo.problems[this.contestInfo.problems.length - 1].problemCode.split('-');
        if (tmp.length === 2) {
          tmp[1] = (parseInt(tmp[1]) + 1).toString();
        }
        problemCode = tmp.join('-');
      }
      this.contestInfo.problems.push({
        problemCode,
        problemTitle: '',
        problemWeight: 1,
        problemSearch: 0,
        problemDescriptionId: '',
        problemDescriptionList: [],
        problemColor: '',
        oldProblemCode: ''
      });
      this.blurProblemCodeInput(this.contestInfo.problems.length - 1);
    },
    // 比赛信息修改模态框 - 删题按钮
    handleContestProblemDelete: function(index) {
      this.contestInfo.problems.splice(index, 1);
    },
    // 比赛信息修改模态框 - 题目编码查询 - 判断是否存在题库
    blurProblemCodeInput: function(index) {
      const row = this.contestInfo.problems[index];
      if (row.problemCode && row.oldProblemCode !== row.problemCode) {
        api.getProblem({ problemCode: row.problemCode })
          .then(ret => {
            row.problemSearch = 1;
            row.problemWeight = 1;
            row.problemTitle = ret.problemTitle;
            api.getProblemDescriptionList({ problemCode: row.problemCode }).then(ret => {
              row.problemDescriptionList = ret;
              if (ret.length) {
                row.problemDescriptionId = ret[0].id;
              }
            })
          }, _ => {
            row.problemSearch = 0;
            row.problemTitle = '';
            row.problemDescriptionId = '';
            row.problemDescriptionList = [];
          })
      }
    },
    // 添加比赛按钮
    addContest: function() {
      const datetime = Math.ceil(new Date().getTime() / (10 * 60 * 1000)) * (10 * 60 * 1000);
      this.contestInfo = {
        contestTitle: '',
        features: {
          mode: 'acm',
          isPublic: 1,
          openness: 'public',
          frozenTime: 0,
          contestRunning: {
            displayPeerSubmission: 1,
            displayRank: 1,
            displayJudgeScore: 1,
            displayCheckpointResult: 1
          },
          contestEnd: {
            displayPeerSubmission: 1,
            displayRank: 1,
            displayJudgeScore: 1,
            displayCheckpointResult: 1
          }
        },
        gmtStart: moment(datetime).format('yyyy-MM-DD HH:mm:ss'),
        gmtEnd: moment(datetime).format('yyyy-MM-DD HH:mm:ss'),
        gmtLength: 0,
        source: '',
        markdownDescription: '',
        problems: [],
        participants: '',
        unofficialParticipants: '',
        password: ''
      }
      this.isAddContest = true;
      this.contestInfoModal = true;
    },
    commitContestInfo: function() {
      this.$refs.contestInfoModal.validate(valid => {
        let ready = true;
        if (!valid) {
          this.$Message.error('Invalid format');
          ready = false;
        }
        if (ready) {
          if (this.contestInfo.problems.length === 0) {
            this.$Message.error('Add at least one problem');
            ready = false;
          }
        }
        if (ready) {
          this.contestInfo.problems.forEach((o, i) => {
            if (!o.problemSearch || !o.problemDescriptionId || !o.problemTitle) {
              this.$Message.error(`Problem ${contestProblemId(i)} is not ready`);
              ready = false;
            }
          });
        }
        if (!ready) {
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          });
          return;
        }

        const data = {
          ...this.contestInfo,
          gmtStart: new Date(this.contestInfo.gmtStart).getTime(),
          gmtEnd: new Date(this.contestInfo.gmtEnd).getTime(),
          participants: this.contestInfo.participants.split(/[\s,]+/),
          unofficialParticipants: this.contestInfo.unofficialParticipants.split(/[\s,]+/),
          problems: this.contestInfo.problems.map(o => {
            return {
              problemColor: o.problemColor,
              problemCode: o.problemCode,
              problemTitle: o.problemTitle,
              problemDescriptionId: o.problemDescriptionId,
              problemWeight: o.problemWeight
            };
          })
        }
        api[this.isAddContest ? 'createContest' : 'updateContest'](data).then(_ => {
          this.$Message.success('Success');
          this.contestInfoModal = false;
          this.getContestList();
        }, err => {
          this.$Message.error(err.message);
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          });
        });
      });
    },
    // 删除比赛按钮
    deleteContest: function() {

    },
    // 比赛导出按钮
    exportContest: function() {
      if (this.selectedContest.length === 0) {
        this.$Message.error('No selected contests');
      } else {
        const exportContestTableData = this.selectedContest.map(item => {
          return {
            contestId: item.contestId,
            contestTitle: item.contestTitle,
            gmtStart: moment(new Date(parseInt(item.gmtStart))).format('yyyy-MM-DD HH:mm:ss'),
            gmtEnd: moment(new Date(parseInt(item.gmtEnd))).format('yyyy-MM-DD HH:mm:ss'),
            mode: item.features.mode,
            openness: item.features.openness,
            participantNum: item.participantNum,
            source: item.source
          };
        })
        this.$refs.exportContestTable.exportCsv({
          quoted: true,
          filename: '比赛数据',
          columns: this.exportContestTableColumns,
          data: exportContestTableData
        });
        this.$Message.success('Success');
      }
    },
    // 获取比赛列表
    getContestList: function() {
      api.getContestList({
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        sortBy: this.sortBy,
        ascending: this.ascending
      }).then(ret => {
        this.contestTableData = ret.rows;
        this.total = parseInt(ret.totalPage) * this.pageSize;
      });
    }
  },
  computed: {
    ...mapState(['footerInfo']),
    ...mapGetters('user', ['username', 'avatar']),
    CONTEST_OPENNESS: () => CONTEST_OPENNESS
  },
  mounted: function () {
    this.getContestList();
  },
  watch: {
    $route: function() {
      this.getContestList();
    }
  }
}
</script>

<style lang="less" scoped>
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
