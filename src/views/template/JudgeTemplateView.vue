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
        @on-selection-change="selectChange"
        @on-sort-change="handleTableSort">
      </Table>

      <!-- 题目信息修改框 -->
      <Modal
        v-model="templateInfoModal"
        title="题目基本信息"
        @on-ok="commitTemplateInfo">
        <Form ref="templateInfo" :model="templateInfo" :rules="templateInfoRule" :label-width="115">
       </Form>
      </Modal>
      <!-- 题目信息修改框 -->

    </Card>
    <div class="problem-set-content-footer">
      <Button type="default" size="small" class="problem-set-content-button" @click="addProblem">添加</Button>
      <Button type="default" size="small" class="problem-set-content-button" @click="deleteProblem">删除</Button>
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
      title="添加用户"
      @on-ok="commitAddProblem">
      <Form ref="addTemplateModal" :model="templateInfo" :rules="templateInfoRule" :label-width="115">
      </Form>
    </Modal>
    <!-- 添加题目模态框 -->
  </div>
</template>

<script>
import api from '@/utils/api'

export default {
  data() {
    return {
      judgeTemplateColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          key: 'id'
        },
        {
          title: 'Title',
          key: 'title'
        }
      ],
      judgeTemplateData: [],
      selectedTemplate: [],
      totalNum: 100,
      pageNow: 1,
      pageSize: 10,
      totalProblemNum: 0,
      sortBy: '',
      ascending: false,
      // 题目信息修改模态框标记
      templateInfoModal: false,
      // 添加题目模态框标记
      addTemplateModal: false,
      // 标签管理模态框标记
      tagsManagementModal: false,
      templateInfo: {
        isPublic: 0,
        problemCode: '',
        problemTitle: '',
        timeLimit: '',
        memoryLimit: '',
        submitNum: '',
        acceptNum: '',
        source: '',
        tagDTOList: [],
        languages: []
      },
      templateInfoRule: {
        problemCode: [
          {
            required: true,
            message: '题目编码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            message: '中间以 - 分割',
            trigger: 'blur'
          }
        ],
        problemTitle: [
          {
            required: true,
            message: '题目标题不能为空',
            trigger: 'blur'
          }
        ],
        isPublic: [
          {
            type: 'number',
            required: true,
            trigger: 'change'
          }
        ],
        timeLimit: [
          {
            required: true,
            message: '时间限制不能为空',
            trigger: 'blur'
          }
        ],
        memoryLimit: [
          {
            required: true,
            message: '空间限制不能为空',
            trigger: 'blur'
          }
        ],
        source: [
          {
            required: false,
            trigger: 'change'
          }
        ],
        languages: [
          {
            required: false,
            trigger: 'change'
          }
        ],
        tagDTOList: [
          {
            required: false,
            trigger: 'change'
          }
        ]
      }
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
    // 表格列排序
    handleTableSort: function ({ column, key, order }) {
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
      this.selectedTemplate = selection;
    },
    // 题目信息修改模态框确认
    commitTemplateInfo() {
      this.$refs.templateInfo.validate(valid => {
        if (valid) {
          var data = {
            problemCode: this.templateInfo.problemCode,
            isPublic: this.templateInfo.isPublic,
            problemTitle: this.templateInfo.problemTitle,
            source: this.templateInfo.source,
            languages: this.templateInfo.languages,
            memoryLimit: parseInt(this.templateInfo.memoryLimit),
            timeLimit: parseInt(this.templateInfo.timeLimit)
          }
          api.updateProblemInfo(data).then(_ => {
            this.$Message.success('修改成功');
            this.getTemplateList();
          }, _ => (this.$Message.error('修改失败')));
        } else {
          this.$Message.error('格式不符');
        }
      })
    },
    // 添加题目按钮
    addProblem() {
      this.addTemplateModal = true;
      this.templateInfo.ProblemCode = '';
      this.templateInfo.problemTitle = '';
      this.templateInfo.acceptNum = '';
      this.templateInfo.submitNum = '';
      this.templateInfo.isPublic = 0;
      this.templateInfo.tagDTOList = [];
      this.templateInfo.languages = [];
      this.templateInfo.timeLimit = '';
      this.templateInfo.memoryLimit = '';
      this.templateInfo.source = '';
    },
    // 添加题目模态框确认
    commitAddProblem() {
      this.$refs.addTemplateModal.validate(valid => {
        if (valid) {
          var data = {
            isPublic: this.templateInfo.isPublic,
            problemTitle: this.templateInfo.problemTitle,
            source: this.templateInfo.source,
            languages: this.templateInfo.languages,
            memoryLimit: parseInt(this.templateInfo.memoryLimit),
            timeLimit: parseInt(this.templateInfo.timeLimit)
          }
          api.createProblem(data).then(_ => {
            this.$Message.success('添加成功');
            this.getTemplateList();
          }, _ => (this.$Message.error('添加失败')));
        } else {
          this.$Message.error('格式不符');
        }
      })
    },
    // 标签管理按钮
    tagsManagement() {
      this.tagsManagementModal = true;
    },
    // 标签管理模态框确认
    commitTagsManagement() {

    },
    // 删除题目按钮
    deleteProblem() {

    },
    append(data) {
      const children = data.children || [];
      children.push({
        title: '空标签',
        expand: true
      });
      this.$set(data, 'children', children);
    },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    handleTableClick: function (row, col) {
      if (col.key === 'problemTitle') {
        this.$router.push({
          name: 'problem-detail',
          params: {
            problemCode: row.problemCode
          }
        });
      }
    },
    // 获取题目列表
    getTemplateList() {
      var params = {
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        sortBy: this.sortBy,
        ascending: this.ascending
      }
      api.getTemplateList(params).then(ret => {
        this.judgeTemplateData = ret.rows;
        this.totalNum = parseInt(ret.total)
      })
    }
  },
  mounted: function () {
    this.getTemplateList();
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
