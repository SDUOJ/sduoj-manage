<template>
  <div>
    <Card :dis-hover="true">
      <p slot="title">
        题库管理
      </p>
      <Input placeholder="题目搜索" style="width: auto" slot="extra">
        <Icon type="ios-search" slot="suffix"/>
      </Input>
      <Table
        :columns="problemTableColumns"
        :data="problemTableData"
        class="problem-set-content-table"
        @on-cell-click="handleProblemClick"
        @on-selection-change="selectChange"
        @on-sort-change="handleProblemSort">
        <template slot-scope="{ row }" slot="code">
          <Tooltip v-if="row.problemCode.length > 20" max-width="180">
            <span slot="content" style="white-space: normal; word-break: break-all">
              <ProblemCode :problemCode="row.problemCode" />
            </span>
            <span>{{ row.problemCode.substring(0, 20) + '...' }}</span>
          </Tooltip>
          <ProblemCode v-else :problemCode="row.problemCode" />
        </template>
        <template slot-scope="{ row }" slot="title">
          <span class="hover">{{ row.problemTitle }}</span>
        </template>

      </Table>

      <!-- 导出模块 -->
      <div style="display: none;">
        <Table
          :columns="exportProblemTableColumns"
          ref="exportProblemTable">
        </Table>
      </div>

      <!-- 题目信息修改框 -->
      <Modal
        v-model="problemInfoModal"
        @on-ok="commitProblemInfo">
        <template slot="header">
          <ProblemCode v-if="problemInfo.problemCode" :problemCode="problemInfo.problemCode"/>
          <div v-else class="ivu-modal-header-inner">Add Problem</div>
        </template>
        <Form ref="problemInfoModal" :model="problemInfo" :rules="problemInfoRule" :label-width="115">
          <FormItem label="Title" prop="problemTitle">
            <Input v-model="problemInfo.problemTitle" :placeholder="problemInfo.problemTitle" />
          </FormItem>

          <FormItem label="Public" prop="isPublic">
            <RadioGroup v-model="problemInfo.isPublic">
              <Radio :label='1'>是</Radio>
              <Radio :label='0'>否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="Time Limit" prop="timeLimit">
            <Input v-model.number="problemInfo.timeLimit">
              <span slot="append">ms</span>
            </Input>
          </FormItem>

          <FormItem label="Memory Limit" prop="memoryLimit">
            <Input v-model.number="problemInfo.memoryLimit">
              <span slot="append">KB</span>
            </Input>
          </FormItem>

          <FormItem label="Judge Templates" prop="judgeTemplates">
<!--            TODO: BUG!!!!!!! 远程搜索不能及时渲染-->
            <Select
              v-model="problemInfo.judgeTemplates"
              multiple
              filterable
              :remote-method="queryTemplateOptions"
              :default-label="templateOptions"
              :loading="loading"
              @on-set-default-options="setDefaultTemplateOptions">
              <Tooltip v-for="template in templateOptions" :key="template.id" :content="template.comment" style="width: 100%"  placement="right" transfer>
                <Option :value="template.id" :label="template.id + ':' + template.title">
                  <span>{{ template.id + ':' + template.title}}</span>
                  <span style="float:right;color:#ccc">{{ template.type | judgeTemplateTypeName }}</span>
                </Option>
              </Tooltip>
            </Select>
          </FormItem>

          <FormItem label="Tags">
            <Select v-model="problemInfo.tagDTOList" multiple filterable allow-create>
              <OptionGroup v-for="item in problemTagList" :label="item.value" :key="item.value">
                <Option v-for="item2 in item.tags" :value="item2.value" :key="item2.value">{{ item2.label }}</Option>
              </OptionGroup>
            </Select>
          </FormItem>

          <FormItem label="Source" prop="source">
            <Input v-model="problemInfo.source" :placeholder="problemInfo.source"></Input>
          </FormItem>
        </Form>
      </Modal>
      <!-- 题目信息修改框 -->

    </Card>
    <div class="problem-set-content-footer">
      <Button type="default" size="small" class="problem-set-content-button" @click="addProblem">添加</Button>
      <Button type="default" size="small" class="problem-set-content-button" @click="exportProblem">文件导出</Button>
      <Button type="default" size="small" class="problem-set-content-button" @click="tagsManagement">标签管理</Button>
      <Page
        class="problem-set-content-page"
        size="small" show-elevator show-sizer
        :total="totalNum"
        :current.sync="pageNow"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"/>
    </div>

    <!-- 标签管理模态框 -->
    <Modal
      v-model="tagsManagementModal"
      title="标签管理"
      @on-ok="commitTagsManagement">
      <Tree :data="treeTagsData" :render="renderTreeTags" class="tree-tags"></Tree>
    </Modal>
    <!-- 标签管理模态框 -->
  </div>
</template>

<script>
import api from '@/utils/api'
import ProblemCode from '@/components/ProblemCode';
import { judgeTemplateProperity } from '_u/types';

export default {
  components: { ProblemCode },
  data: function() {
    return {
      problemTableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          key: 'problemCode',
          width: 210,
          slot: 'code'
        },
        {
          title: 'Title',
          key: 'problemTitle',
          slot: 'title'
        },
        {
          title: 'Time Limit (ms)',
          key: 'timeLimit',
          sortable: 'custom'
        },
        {
          title: 'Memory Limit (MB)',
          key: 'memoryLimit',
          sortable: 'custom'
        },
        {
          title: 'Accepts / Submits',
          key: 'acceptNum',
          sortable: 'custom',
          render: (h, params) => {
            return h('span', [params.row.acceptNum, ' / ', params.row.submitNum])
          }
        },
        {
          title: '\b',
          key: 'tagDTOList',
          render: (h, params) => {
            if (params.row.tagDTOList && params.row.tagDTOList.length > 0) {
              return h('div', { class: 'problem-set-problemtags' },
                params.row.tagDTOList.map(item => {
                  return h('div', { class: 'problem-set-rolebox' }, [
                    h('div', { class: 'problem-set-role' }, item.title)
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
                    this.problemInfo = params.row;
                    this.$nextTick(() => {
                      this.templateOptions = this.problemInfo.judgeTemplateListDTOList;
                    })
                    this.isAddProblem = false;
                    this.problemInfoModal = true;
                  }
                }
              })
            ])
          }
        }
      ],
      problemTableData: [],
      selectedProblem: [],
      // 表格导出的数据格式
      exportProblemTableColumns: [
        {
          title: 'problemId',
          key: 'problemId'
        },
        {
          title: 'problemCode',
          key: 'problemCode'
        },
        {
          title: 'problemTitle',
          key: 'problemTitle'
        },
        {
          title: 'isPublic',
          key: 'isPublic'
        },
        {
          title: 'source',
          key: 'source'
        },
        {
          title: 'submitNum',
          key: 'submitNum'
        },
        {
          title: 'acceptNum',
          key: 'acceptNum'
        },
        {
          title: 'judgeTemplates',
          key: 'judgeTemplates'
        },
        {
          title: 'memoryLimit',
          key: 'memoryLimit'
        },
        {
          title: 'timeLimit',
          key: 'timeLimit'
        },
        {
          title: 'defaultDescriptionId',
          key: 'defaultDescriptionId'
        },
        {
          title: 'tags',
          key: 'tags'
        }
      ],
      totalNum: 100,
      pageNow: 1,
      pageSize: 10,
      sortBy: '',
      ascending: false,
      loading: false,
      // 题目信息修改模态框标记
      isAddProblem: false,
      problemInfoModal: false,
      // 标签管理模态框标记
      tagsManagementModal: false,
      problemInfo: {},
      problemInfoRule: {
        problemTitle: [{ required: true, trigger: 'blur' }],
        isPublic: [{ type: 'number', required: true, trigger: 'change' }],
        timeLimit: [{ type: 'number', required: true, trigger: 'blur' }],
        memoryLimit: [{ type: 'number', required: true, trigger: 'blur' }],
        judgeTemplates: [{ required: true }]
      },
      templateOptions: [],
      problemTagList: [
        {
          value: '动态规划',
          label: '动态规划',
          tags: [
            {
              value: '动态规划',
              label: '动态规划'
            },
            {
              value: '线性DP',
              label: '线性DP'
            },
            {
              value: '背包',
              label: '背包'
            },
            {
              value: '区间DP',
              label: '区间DP'
            },
            {
              value: '树形DP',
              label: '树形DP'
            },
            {
              value: '数位DP',
              label: '数位DP'
            }
          ]
        },
        {
          value: '数据结构',
          label: '数据结构',
          tags: [
            {
              value: '数据结构',
              label: '数据结构'
            },
            {
              value: '单调栈',
              label: '单调栈'
            },
            {
              value: '单调队列',
              label: '单调队列'
            },
            {
              value: '线段树',
              label: '线段树'
            },
            {
              value: '树状数组',
              label: '树状数组'
            }
          ]
        }
      ],
      treeTagsData: [
        {
          title: '根标签',
          expand: true,
          render: (h, { root, node, data }) => {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            }, [
              h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-folder-outline'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', data.title)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '32px'
                }
              }, [
                h('Button', {
                  props: Object.assign({}, this.treeButtonProps, {
                    icon: 'ios-add',
                    type: 'primary'
                  }),
                  style: {
                    width: '64px'
                  },
                  on: {
                    click: () => {
                      this.append(data)
                    }
                  }
                })
              ])
            ]);
          },
          children: [
            {
              title: '动态规划',
              expand: true,
              children: [
                {
                  title: '线性 DP',
                  expand: true
                },
                {
                  title: '背包',
                  expand: true
                },
                {
                  title: '区间 DP',
                  expand: true
                },
                {
                  title: '树形 DP',
                  expand: true
                }
              ]
            },
            {
              title: '数据结构',
              expand: true,
              children: [
                {
                  title: '单调栈',
                  expand: true
                },
                {
                  title: '单调队列',
                  expand: true
                },
                {
                  title: '线段树',
                  expand: true
                },
                {
                  title: '树状数组',
                  expand: true
                }
              ]
            }
          ]
        }
      ],
      treeButtonProps: {
        type: 'default',
        size: 'small'
      }
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
    onPageChange: function (pageNow) {
      this.pageNow = pageNow;
    },
    // 更改页面大小
    onPageSizeChange: function (pageSize) {
      this.pageSize = pageSize;
    },
    // 表格列排序
    handleProblemSort: function ({ column, key, order }) {
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
      this.selectedProblem = selection;
    },
    // 题目信息修改模态框确认
    commitProblemInfo: function() {
      this.$refs.problemInfoModal.validate(valid => {
        if (valid) {
          const data = {
            problemCode: this.problemInfo.problemCode,
            isPublic: this.problemInfo.isPublic,
            problemTitle: this.problemInfo.problemTitle,
            source: this.problemInfo.source,
            judgeTemplates: this.problemInfo.judgeTemplates,
            memoryLimit: parseInt(this.problemInfo.memoryLimit),
            timeLimit: parseInt(this.problemInfo.timeLimit)
          }
          api[this.isAddProblem ? 'createProblem' : 'updateProblemInfo'](data)
            .then(_ => (this.$Message.success('Success')), err => (this.$Message.error(err.message)))
            .finally(() => (this.getProblemList()));
        } else {
          this.$Message.error('格式不符');
        }
      })
    },
    // 添加题目按钮
    addProblem: function() {
      this.problemInfo = {
        problemCode: '',
        problemTitle: '',
        isPublic: 0,
        tagDTOList: [],
        judgeTemplates: [],
        timeLimit: '',
        memoryLimit: '',
        source: ''
      };
      this.templateOptions = [];
      this.isAddProblem = true;
      this.problemInfoModal = true;
    },
    handleProblemClick: function (row, col) {
      if (col.key === 'problemTitle') {
        this.$router.push({
          name: 'problem-detail',
          params: { problemCode: row.problemCode }
        });
      }
    },
    // 获取题目列表
    getProblemList() {
      api.getProblemList({
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        sortBy: this.sortBy,
        ascending: this.ascending
      }).then(ret => {
        this.problemTableData = ret.rows;
        this.totalNum = parseInt(ret.total)
      })
    },
    // 题库导出按钮
    exportProblem: function() {
      if (this.selectedProblem.length === 0) {
        this.$Message.error('No problems selected');
      } else {
        var exportProblemTableData = []
        this.selectedProblem.forEach(function (item) {
          var tags = [];
          item.tagDTOList.forEach(function (item2) {
            tags.push(item2.title);
          });
          item.tags = tags;
          exportProblemTableData.push(item);
        });
        this.$refs.exportProblemTable.exportCsv({
          quoted: true,
          filename: '题目数据',
          columns: this.exportProblemTableColumns,
          data: exportProblemTableData
        });
        this.$Message.success('导出成功');
      }
    },
    queryTemplateOptions: function(title) {
      if (title === '') {
        this.templateOptions = [];
      } else if (!this.loading) {
        this.loading = true;
        this.templateOptions = [];
        api.queryTemplateTitle(title).then(ret => {
          ret.forEach(item => (this.templateOptions.push(item)));
        }).finally(() => (this.loading = false));
      }
    },
    setDefaultTemplateOptions: function(options) {
      // this.templateOptions = [];
      // console.log(options);
      // options.forEach(opt => {
      //   api.getOneTemplate(opt.value).then(ret => {
      //     console.log(ret);
      //     this.templateOptions.push(ret);
      //   })
      // })
    },

    // 树形标签函数
    renderTreeTags: function(h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: Object.assign({}, this.treeButtonProps, {
              icon: 'ios-add'
            }),
            style: {
              marginRight: '8px'
            },
            on: {
              click: () => {
                this.append(data)
              }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.treeButtonProps, {
              icon: 'ios-remove'
            }),
            on: {
              click: () => {
                this.remove(root, node, data)
              }
            }
          })
        ])
      ]);
    },
    append: function(data) {
      const children = data.children || [];
      children.push({
        title: '空标签',
        expand: true
      });
      this.$set(data, 'children', children);
    },
    remove: function(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    // 标签管理按钮
    tagsManagement: function() {
      this.tagsManagementModal = true;
    },
    // 标签管理模态框确认
    commitTagsManagement: function() {}
  },
  mounted: function () {
    this.getProblemList();
  },
  watch: {
    pageNow: function() {
      this.getProblemList();
    },
    pageSize: function() {
      this.getProblemList();
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

    .problem-set-content-table {
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
