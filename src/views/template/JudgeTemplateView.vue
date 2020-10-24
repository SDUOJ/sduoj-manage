<template>
  <div>
    <Card :dis-hover="true">
      <p slot="title">
        评测模板管理
      </p>
      <Input placeholder="评测模板搜索" style="width: auto" slot="extra">
        <Icon type="ios-search" slot="suffix"/>
      </Input>
      <Table
        :columns="judgeTemplateColumns"
        :data="judgeTemplateData"
        class="template-set-content-table"
        @on-cell-click="handleTableClick"
        @on-selection-change="selectChange">
        <template slot-scope="{ row }" slot="title-comment">
          <Tooltip :content="row.comment" transfer>
            <span>{{ row.title }}</span>
          </Tooltip>
        </template>
        <template slot-scope="{ row }" slot="type">
          <Tag :color="row.type | judgeTemplateTypeClass">{{ row.type | judgeTemplateTypeName }}</Tag>
        </template>
        <template slot-scope="{ row }" slot="create-time">
          <Time slot="extra" :time="row.gmtCreate | parseInt" type="datetime"/>
        </template>
        <template slot-scope="{ row }" slot="update-time">
          <Time slot="extra" :time="row.gmtModified | parseInt" type="datetime"/>
        </template>
      </Table>

      <!-- 题目信息修改框 -->
      <Modal
        :mask-closable="false"
        v-model="templateInfoModal"
        :title="'Template #' + templateInfo.id"
        @on-ok="commitTemplateInfo">
        <Form ref="templateInfo" :model="templateInfo" :rules="templateInfoRule">
          <FormItem label="Title">
            <Input v-model="templateInfo.title" />
          </FormItem>
          <FormItem label="Comment">
            <Input v-model="templateInfo.comment" />
          </FormItem>
          <FormItem label="Type">
            <Select v-model="templateInfo.type">
              <Option v-for="type in judgeTemplateType" :key="type" :value="type">
                {{ judgeTemplateProperity[type].name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="File Extensions">
            <Select
              v-model="templateInfo.acceptFileExtensions"
              filterable
              multiple
              allow-create
              :default-label="templateInfo.acceptFileExtensions"
              @on-create="handleCreateExtension">
              <Option v-for="item in templateInfo.acceptFileExtensions" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
          <template v-if="judgeTemplateProperity[templateInfo.type].zipFile">

          </template>
          <template v-else>

          </template>
        </Form>
      </Modal>
      <!-- 题目信息修改框 -->

    </Card>
    <div class="problem-set-content-footer">
      <Button type="default" size="small" class="problem-set-content-button" @click="addJudgeTemplate">添加</Button>
      <Page
        class="problem-set-content-page"
        size="small" show-elevator show-sizer
        :total="totalNum"
        :current.sync="pageNow"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"/>
    </div>

    <!-- 添加题目模态框 -->
    <Modal
      v-model="addTemplateModal"
      title="添加评测模板"
      @on-ok="commitAddProblem">
      <Form ref="addTemplateModal" :model="templateInfo" :rules="templateInfoRule" :label-width="115">

      </Form>
    </Modal>
    <!-- 添加题目模态框 -->
  </div>
</template>

<script>
import api from '_u/api';
import { judgeTemplateType, judgeTemplateProperity } from '_u/types';

export default {
  data: function() {
    return {
      judgeTemplateColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          key: 'id',
          render: (h, params) => {
            return h('span', {
              class: 'hover'
            }, params.row.id);
          }
        },
        { title: 'Type', slot: 'type' },
        { title: 'Title', slot: 'title-comment' },
        { title: 'Remote OJ', key: 'remoteOj' },
        { title: 'Create', slot: 'create-time' },
        { title: 'Update', slot: 'update-time' }
      ],
      judgeTemplateData: [],
      selectedTemplate: [],
      totalNum: 100,
      pageNow: 1,
      pageSize: 10,
      // 评测修改模态框标记
      templateInfoModal: false,
      // 添加评测模态框标记
      addTemplateModal: false,
      templateInfo: {},
      templateInfoRule: {}
    }
  },
  filters: {
    parseInt: (val) => parseInt(val),
    judgeTemplateTypeClass: type => {
      return judgeTemplateProperity[type].color;
    },
    judgeTemplateTypeName: type => {
      return judgeTemplateProperity[type].name;
    }
  },
  methods: {
    // 切换页面
    onPageChange: function (curPage) {
      this.pageNow = curPage;
      this.getTemplateList();
    },
    // 更改页面大小
    onPageSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      this.getTemplateList();
    },
    // 表格全选
    selectChange: function (selection) {
      this.selectedTemplate = selection;
    },
    // 题目信息修改模态框确认
    commitTemplateInfo: function() {
      this.$refs.templateInfo.validate(valid => {
        if (valid) {
        } else {
          this.$Message.error('格式不符');
        }
      })
    },
    // 添加题目按钮
    addJudgeTemplate: function() {
      this.addTemplateModal = true;
    },
    // 添加题目模态框确认
    commitAddProblem: function() {
      this.$refs.addTemplateModal.validate(valid => {
        if (valid) {
        } else {
          this.$Message.error('格式不符');
        }
      })
    },
    handleTableClick: function (row, col) {
      api.getOneTemplate(row.id).then(ret => {
        this.templateInfo = ret;
        console.log(this.templateInfo);
        this.templateInfoModal = true;
      });
    },
    handleCreateExtension: function(val) {
      if (!this.templateInfo.acceptFileExtensions.includes(val)) {
        this.templateInfo.acceptFileExtensions.push(val);
      }
    },
    // 获取评测模板列表
    getTemplateList: function() {
      api.getTemplateList({
        pageNow: this.pageNow,
        pageSize: this.pageSize
      }).then(ret => {
        this.judgeTemplateData = ret.rows;
        this.totalNum = parseInt(ret.total)
      })
    }
  },
  computed: {
    judgeTemplateProperity: () => judgeTemplateProperity,
    judgeTemplateType: () => judgeTemplateType
  },
  mounted: function () {
    this.getTemplateList()
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

    .template-set-content-table {
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
      .problem-set-name {
        float: left;
      }
    }
  }

  .ivu-card-bordered {
    border-bottom: none !important;
  }

  // 分页栏
  .problem-set-content-footer {
    margin-top: 12px;

    .problem-set-content-page {
      float: right;
    }

    .problem-set-content-button {
      float: left;
      margin-right: 5px;
    }
  }
</style>

<style lang="less">
  // 权限标签
  .problem-set-problemtags {
    float: right;

    .problem-set-rolebox {
      margin: 2px;
      background-color: #F8F9F9;
      float: right;
      border-radius: 4px;

      .problem-set-role {
        user-select: none;
        margin: 4px 6px;
      }
    }
  }

  // 树形标签
  .tree-tags .ivu-tree-title {
    width: 100%;
  }
</style>
