<template>
  <div style="background:#eee; padding: 20px">
    <Row>
      <Col span="10" v-for="(item, index) in utilSelectorConfig" :key="item.introduction+index.toString()">
        <UtilMenuCard
        :util-title="item.title"
        :util-introduction="item.introduction"
        @change-dialog="changeDialog(item.name)"></UtilMenuCard>
      </Col>
    </Row>

    <Modal class-name="comprehensive" ref="comprehensiveDialog" v-model="comprehensive"
      title="Export the contest comprehensive report"
      class="tool-modal"
      width="100%"
      @on-ok="exportComprehensive">
      <Input search enter-button
             placeholder="Enter groupId ..."
             @on-search="getSearchContestList"
             v-model="selectedGroupId"
             class="group-input"
             style="width: 20%" />
      <Menu mode="horizontal" active-name="1" @on-select="changeMenuState">
        <MenuItem name="1" key="1">配置比赛</MenuItem>
        <MenuItem name="2" key="2">配置学生</MenuItem>
      </Menu>
      <div class="contestConfig" v-show="contestConfigShow">
        <Table
          :columns="contestColumns"
          :data="contests"
          :loading="tableLoading"
          class="content-table"
          @on-select="selectContest"
          @on-select-cancel="unselectContest">
          <template slot-scope="{ row }" slot="title">
            <span>{{ row.contestTitle }}</span>
            <Icon v-if="row.features.openness === CONTEST_OPENNESS.PRIVATE.title"
                  :color="CONTEST_OPENNESS.PRIVATE.lockColor"
                  type="md-lock"
                  size="19" />
            <Icon v-else-if="row.features.openness === CONTEST_OPENNESS.PROTECTED"
                  :color="CONTEST_OPENNESS.PROTECTED.lockColor"
                  type="md-lock"
                  size="19" />
            <Tag v-if="row.isPublic === 0" style="margin-left: 5px" color="volcano">Private</Tag>
          </template>
          <template slot-scope="{ row }" slot="time">
            <Time :time="row.gmtStart | parseInt" type="datetime" />
          </template>
          <template slot-scope="{ row }" slot="duration">
            <span>{{ row.gmtStart | getDuration(row.gmtEnd) }}</span>
          </template>
          <template slot-scope="{ row }" slot="mode">
            <span>{{ row.features.mode.toUpperCase() }}</span>
          </template>
          <template slot-scope="{ row }" slot="group">
            <span v-if="row.managerGroupDTO">{{ `${row.managerGroupDTO.groupId} (${row.managerGroupDTO.title})` }}</span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <span class="clickable" @click="EditConfig(row)">Edit Config</span>
          </template>
        </Table>

        <div class="footer-tools">
          <Page
            class="float-right"
            size="small" show-elevator show-sizer
            :total="total"
            :current.sync="PageNow"
            :page-size="PageSize"
            :page-size-opts="pageSizeOpts"
            @on-change="getContestList"
            @on-page-size-change="tableSizeChange"
          />
        </div>
      </div>

      <div class="studentConfig" v-show="studentConfigShow">
        <div>
          <Card class="tag-card">
            <p class="prefix">已选择的学生:</p>
            <Tag v-for="item in selectedStudent" :key="item"
                 type="border" color="primary">{{ item }}</Tag>
          </Card>
          <Divider />
          <Card class="tag-card">
            <p class="prefix">全部学生:</p>
            <Tag v-for="item in allStudent" :key="item.userId" :name="item.username"
                 color="primary" checkable @on-change="handleStudentSelectedChange">{{ item.username }}</Tag>
          </Card>
        </div>

        <Form>
          <FormItem label="Participants">
            <span class="hint-text">Separate username by a TAB '\t', SPACE ' ', NEW LINE '\n' or COMMA ','</span>
            <Input v-model="handInParticipants" type="textarea" :autosize="{minRows: 3}"/>
          </FormItem>
        </Form>
      </div>

    </Modal>

    <Modal v-model="comprehensiveConfigDetailVisible"
           title="ConfigDetail"
           width="400px"
           @on-ok="pushComprehensiveConfig">
      <Form label-position="left" :label-width="100">
        <FormItem label="比赛相对权重">
          <Input v-model="weight" placeholder="请填写整数"></Input>
        </FormItem>
        <p class="timeline-prefix">添加详细配置，示例如下：</p>
        <Timeline>
          <TimelineItem v-for="item in exampleWeight" color="green" :key="item[0]">超出比赛结束时间 {{ item[0] }}s内 得分率: {{ item[1] }}</TimelineItem>
        </Timeline>
        <FormItem label="超时时间">
          <Input v-model="timeCost" placeholder="请填写整数(ms)"></Input>
        </FormItem>
        <FormItem label="超时权重">
          <Input v-model="outTimeWeight" placeholder="请填写小数(<=1)"></Input>
          <Button type="success" class="add-config-btn" @click="addTimeWeight">添加配置</Button>
        </FormItem>
        <p class="timeline-prefix">你的配置：</p>
        <Timeline>
          <TimelineItem v-for="item in timeWeightDetail" color="green" :key="item[0]">
            <p style="height: 20px; line-height: 20px">超出比赛结束时间 {{ item[0] }}s内 得分率: {{ item[1] }}
              <Button shape="circle" icon="md-close" size="small" type="error"
                      style="float: right; margin-top: -5px; margin-right: 10px"
                      @click="deleteTimeConfig(item)"></Button></p>
          </TimelineItem>
        </Timeline>
      </Form>
    </Modal>

  </div>
</template>

<script>
import UtilMenuCard from '_c/Card/UtilMenuCard';
import moment from 'moment';
import { CONTEST_OPENNESS, CONTEST_MODE, CONTEST_PROBLEM_STATUS } from '_u/constants';
import api from '_u/api.js';
import { split } from '_u/split';
export default {
  components: {
    UtilMenuCard
  },
  data: function () {
    return {
      utilSelectorConfig: [
        {
          name: 'comprehensive',
          title: 'Export the contest comprehensive report',
          introduction: '根据提供的组号，比赛号，学生等配置导出比赛数据'
        }
      ],

      contestColumns: [
        { type: 'selection', width: 60, align: 'center' },
        { key: 'contestId', maxWidth: 80 },
        { title: 'Title', slot: 'title', minWidth: 150 },
        { title: 'Start', key: 'gmtStart', sortable: 'custom', width: 200, slot: 'time' },
        { title: 'Duration', sortable: 'custom', slot: 'duration' },
        { title: 'Mode', key: 'mode', sortable: 'custom', slot: 'mode' },
        { title: 'Participants', key: 'participantNum', width: 140, sortable: 'custom' },
        { title: 'Manager Group', slot: 'group', minWidth: 100 },
        { title: '\b', slot: 'action' }
      ],
      contests: [],
      contest: {
        features: {
          contestEnd: {},
          contestRunning: {}
        },
        groupId: '',
        problems: []
      },

      selectedContests: [],
      contestConfig: {},

      tableLoading: false,
      total: 0,
      PageNow: 1,
      PageSize: 7,
      pageSizeOpts: [5, 7, 10],

      contestConfigShow: true,
      studentConfigShow: false,
      selectedGroupId: '',

      /* 权重 */
      configSelectContest: '',
      timeCost: '',
      outTimeWeight: '',
      weight: '',
      exampleWeight: [
        ['0', 1],
        ['100', 0.8],
        ['1000', 0.6]
      ],
      timeWeightDetail: [
        [0, 1]
      ],

      /* 学生配置 */
      handInParticipants: '',
      selectedStudent: [],
      allStudent: '',

      /* Dialog Visible variable */
      comprehensive: false,
      comprehensiveConfigDetailVisible: false
    }
  },
  methods: {
    changeDialog (item) {
      this[item] = !this[item]
    },
    tableSizeChange: function (size) {
      this.PageSize = size
      this.getContestList()
    },
    getSearchContestList: function () {
      this.PageNow = 1;
      if (this.contestConfigShow) this.getContestList();
      else this.getStudentList();
    },

    getContestList: function () {
      this.tableLoading = true;
      this.selectedContests = [];
      api.getContestListByGroupId({
        pageNow: this.PageNow,
        pageSize: this.PageSize,
        groupId: this.selectedGroupId
      }).then(ret => {
        this.contests = ret.rows;
        this.total = ret.total * ret.totalPage
      }).catch(err => {
        this.$Message.error(err.message);
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    getStudentList: function () {
      this.selectedStudent = [];
      api.getStudentListByGroupId({
        groupId: this.selectedGroupId
      }).then(ret => {
        this.allStudent = ret.members
        this.allStudent.forEach(item => {
          this.selectedStudent.push(item.username)
        })
      }).catch(err => {
        this.$Message.error(err.message);
      })
    },

    selectContest: function (selection, row) {
      this.selectedContests.push(row.contestId)
    },
    unselectContest: function (selection, row) {
      this.selectedContests.splice(this.selectedContests.indexOf(row.contestId), 1)
    },
    EditConfig: function (row) {
      this.configSelectContest = row.contestId
      this.weight = ''
      this.timeWeightDetail = [
        ['0', 1]
      ]
      this.timeCost = ''
      this.outTimeWeight = ''
      this.changeComprehensiveConfigDetailVisible()
    },
    changeComprehensiveConfigDetailVisible: function () {
      this.comprehensiveConfigDetailVisible = true
    },
    pushComprehensiveConfig: function () {
      this.contestConfig[this.configSelectContest] = {
        contestId: this.configSelectContest,
        weight: this.weight,
        timeoutScoreRatio: this.timeWeightDetail
      }
    },
    changeMenuState: function (name) {
      this.contestConfigShow = (name === '1');
      this.studentConfigShow = !this.contestConfigShow
      this.getSearchContestList()
    },

    unselectStudent: function (username) {
      this.selectedStudent.splice(this.selectedStudent.indexOf(username), 1)
    },
    handleStudentSelectedChange: function (checked, name) {
      if (checked) this.selectedStudent.push(name);
      else this.unselectStudent(name)
    },

    exportComprehensive: function () {
      const contestList = [];
      this.selectedContests.forEach(item => {
        contestList.push(this.contestConfig[item])
      })
      const data = {
        usernameList: Array.from(new Set((split(this.handInParticipants, /[\s,]+/)).concat(this.selectedStudent))),
        contestList: contestList
      };
      api.exportComprehensive(data).catch(err => {
        this.$Message.error(err.message);
      })
      console.log(data)
    },

    addTimeWeight: function () {
      let i;
      for (i = 0; i < this.timeWeightDetail.length; i++) {
        if (this.timeWeightDetail[i][0] >= this.timeCost) break;
      }
      if (i < this.timeWeightDetail.length && this.timeWeightDetail[i][0] === this.timeCost) {
        this.timeWeightDetail[i][1] = parseFloat(this.outTimeWeight)
      } else {
        this.timeWeightDetail.splice(i, 0, [this.timeCost, parseFloat(this.outTimeWeight)])
      }
    },
    deleteTimeConfig: function (item) {
      this.timeWeightDetail.splice(this.timeWeightDetail.indexOf(item), 1)
    }
  },
  filters: {
    // 格式化比赛进行时长
    getDuration: (start, end) => {
      const diff = parseInt(end) - parseInt(start);
      const duration = moment.duration(diff, 'milliseconds');
      const minutes = duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes().toString();
      const seconds = duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds().toString();
      return [Math.floor(duration.asHours()), minutes, seconds].join(':');
    },
    parseInt: val => parseInt(val)
  },
  computed: {
    CONTEST_OPENNESS: () => CONTEST_OPENNESS,
    CONTEST_MODE: () => CONTEST_MODE,
    CONTEST_PROBLEM_STATUS: () => CONTEST_PROBLEM_STATUS,
    moment: () => moment
  }
}
</script>

<style scoped lang="less">

.prefix {
  padding: 5px;
  line-height: 1;
}

.timeline-prefix {
  margin: 5px 5px 20px;
  line-height: 1;
  color: cornflowerblue;
}

.tag-card {
  margin: 10px;
  padding: 10px;
}

.add-config-btn {
  margin: 10px;
  float: right;
}

</style>
