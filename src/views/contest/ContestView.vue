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
        @on-ok="commitContestInfo">
        <Form ref="contestInfoModal" :model="contestInfo" :rules="contestInfoRule" :label-width="115">
          <FormItem label="比赛编号" prop="contestId">
            <Input v-model="contestInfo.contestId" :placeholder="contestInfo.contestId" disabled></Input>
          </FormItem>

          <FormItem label="比赛标题" prop="contestTitle">
            <Input v-model="contestInfo.contestTitle" :placeholder="contestInfo.contestTitle"></Input>
          </FormItem>

          <FormItem label="比赛类型" prop="mode">
            <RadioGroup v-model="contestInfo.features.mode">
              <Radio label="oi">oi</Radio>
              <Radio label="acm">acm</Radio>
              <Radio label="ioi">ioi</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="开放类型" prop="openness">
            <Select v-model="contestInfo.features.openness" :placeholder="contestInfo.features.openness">
                <Option value="public">公开 - 任何人可以看题与提交</Option>
                <Option value="protected">保护 - 任何人都能看题，但只有知道密码才能提交</Option>
                <Option value="private">私有 - 只有知道密码才能看题与提交</Option>
            </Select>
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
            <Input class="problemDatileMarkdownBox" v-model="contestInfo.participants" type="textarea"
            :autosize="{minRows: 3,maxRows: 6}"/>
          </FormItem>
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

    <!-- 添加比赛模态框 -->
    <!-- <Modal
      v-model="addContestModal"
      title="添加用户"
      @on-ok="commitAddContest">
      <Form ref="addContestModal" :model="contestInfo" :rules="contestInfoRule" :label-width="115">
      </Form>
    </Modal> -->
    <!-- 添加比赛模态框 -->
  </div>
</template>

<script>
import api from '@/utils/api'
import utils from '@/utils';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
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
          title: '结束时间',
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
            return h('div', params.row.features.mode);
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
                      this.contestInfoModal = true;
                      this.contestInfo.contestId = params.row.contestId;
                      this.contestInfo.contestTitle = params.row.contestTitle;
                      this.contestInfo.features = params.row.features;
                      this.contestInfo.gmtStart = utils.time2date(parseInt(params.row.gmtStart));
                      this.contestInfo.gmtEnd = utils.time2date(parseInt(params.row.gmtEnd));
                      this.contestInfo.source = params.row.source;
                      this.contestInfo.gmtLength = utils.time2minute(parseInt(params.row.gmtEnd) - parseInt(params.row.gmtStart));
                      // get 获取 password、problems、participants、markdownDescription
                      api.getContest({ contestId: params.row.contestId }).then(ret => {
                        this.contestInfo.password = ret.password;
                        this.contestInfo.problems = ret.problems;
                        this.contestInfo.participants = ret.participants.toString();
                        this.contestInfo.markdownDescription = ret.markdownDescription;
                      });
                    }
                  }
                }
              })
            ])
          }
        }
      ],
      contestTableData: [],
      selectedContest: [],
      // 表格导出的数据格式
      exportContestTableColumns: [
        {
          title: 'contestId',
          key: 'contestId'
        },
        {
          title: 'contestTitle',
          key: 'contestTitle'
        },
        {
          title: 'gmtStart',
          key: 'gmtStart'
        },
        {
          title: 'gmtEnd',
          key: 'gmtEnd'
        },
        {
          title: 'mode',
          key: 'mode'
        },
        {
          title: 'participantNum',
          key: 'participantNum'
        },
        {
          title: 'source',
          key: 'source'
        }
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
      // 比赛字段
      contestInfo: {
        contestId: '',
        contestTitle: '',
        features: {},
        gmtStart: 0,
        gmtEnd: 0,
        source: '',
        markdownDescription: '',
        problems: [],
        participants: '',
        password: '',
        gmtLength: 0
      },
      // 比赛字段规则
      contestInfoRule: {
        contestTitle: [{ required: true, message: '比赛标题不能为空', trigger: 'blur' }],
        mode: [{ required: true, message: '比赛类型不能为空', trigger: 'blur' }],
        openness: [{ required: true, message: '比赛开放类型不能为空', trigger: 'blur' }],
        // gmtStart: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
        // gmtEnd: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
        // gmtLength: [{ required: true, message: '比赛时长不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '比赛密码不能为空', trigger: 'blur' }],
        source: [{ required: false, trigger: 'blur' }],
        markdownDescription: [{ required: false, trigger: 'blur' }],
        problems: [{ required: false, trigger: 'blur' }],
        participants: [{ required: false, trigger: 'change' }]
      }
    }
  },
  methods: {
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
        this.contestInfo.gmtEnd = utils.time2date(parseInt(date2));
      }
    },
    // 修改比赛结束时间
    changeGmtEnd: function () {
      if (this.contestInfo.gmtStart) {
        var date1 = new Date(this.contestInfo.gmtStart).getTime();
        var date2 = new Date(this.contestInfo.gmtEnd).getTime();
        var length = (date2 - date1) / 60000;
        this.contestInfo.gmtLength = length;
      }
    },
    // 比赛信息修改模态框确认
    commitContestInfo() {
      this.$refs.contestInfoModal.validate(valid => {
        if (valid) {
          var data = {
            contestCode: this.contestInfo.contestCode,
            isPublic: this.contestInfo.isPublic,
            contestTitle: this.contestInfo.contestTitle,
            source: this.contestInfo.source,
            languages: this.contestInfo.languages,
            memoryLimit: parseInt(this.contestInfo.memoryLimit),
            timeLimit: parseInt(this.contestInfo.timeLimit)
          }
          api.updateContestInfo(data).then(_ => {
            this.$Message.success('修改成功');
            this.getContestList();
          }, _ => (this.$Message.error('修改失败')));
        } else {
          this.$Message.error('格式不符');
        }
      })
    },
    // 添加比赛按钮
    addContest() {
      this.addContestModal = true;
      this.contestInfo.ProblemCode = '';
      this.contestInfo.contestTitle = '';
      this.contestInfo.acceptNum = '';
      this.contestInfo.submitNum = '';
      this.contestInfo.isPublic = 0;
      this.contestInfo.tagDTOList = [];
      this.contestInfo.languages = [];
      this.contestInfo.timeLimit = '';
      this.contestInfo.memoryLimit = '';
      this.contestInfo.source = '';
    },
    // 添加比赛模态框确认
    commitAddContest() {
      this.$refs.addContestModal.validate(valid => {
        if (valid) {
          var data = {
            isPublic: this.contestInfo.isPublic,
            contestTitle: this.contestInfo.contestTitle,
            source: this.contestInfo.source,
            languages: this.contestInfo.languages,
            memoryLimit: parseInt(this.contestInfo.memoryLimit),
            timeLimit: parseInt(this.contestInfo.timeLimit)
          }
          api.createContest(data).then(_ => {
            this.$Message.success('添加成功');
            this.getContestList();
          }, _ => (this.$Message.error('添加失败')));
        } else {
          this.$Message.error('格式不符');
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
          var tags = [];
          item.tagDTOList.forEach(function (item2) {
            tags.push(item2.title);
          });
          item.tags = tags;
          exportContestTableData.push(item);
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
    .contest-set-content-table {
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
  }

  .ivu-card-bordered {
    border-bottom: none !important;
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
</style>
