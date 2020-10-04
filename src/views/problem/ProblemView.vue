<template>
  <div>
    <Card :dis-hover="true">
        <p slot="title">
            题库管理
        </p>
        <Input placeholder="题目搜索" style="width: auto" slot="extra">
          <Icon type="ios-search" slot="suffix" />
        </Input>
        <Table 
          :columns="problemTableColumns" 
          :data="problemTableData" 
          class="problem-set-content-table"
          @on-cell-click="handleProblemClick"
          @on-sort-change="handleProblemSort">
        </Table>

        <!-- 用户信息修改框 -->
        <Modal
          v-model="problemInfoModal"
          title="题目基本信息"
          @on-ok="commitProblemInfo">
          <Form :model="problemInfo" :rules="problemInfoRule" :label-width="115">
            <FormItem label="题目编码" prop="problemCode">
              <Input v-model="problemInfo.problemCode" :placeholder="problemInfo.problemCode"></Input>
            </FormItem>

            <FormItem label="题目标题" prop="problemTitle">
              <Input v-model="problemInfo.problemTitle" :placeholder="problemInfo.problemTitle"></Input>
            </FormItem>

            <FormItem label="时间限制 (ms)" prop="timeLimit">
              <Input v-model="problemInfo.timeLimit" :placeholder="problemInfo.timeLimit"></Input>
            </FormItem>

            <FormItem label="空间限制 (MB)" prop="spaceLimit">
              <Input v-model="problemInfo.spaceLimit" :placeholder="problemInfo.spaceLimit"></Input>
            </FormItem>

            <FormItem label="评测语言">
              <Select v-model="problemInfo.languages" multiple>
                <Option value="c++11">c++11</Option>
                <Option value="c++14">c++14</Option>
                <Option value="python2">python2</Option>
                <Option value="java8">java8</Option>
              </Select>
            </FormItem>

            <FormItem label="标签">
              <Select v-model="problemInfo.problemTags" multiple filterable allow-create>
                <OptionGroup v-for="item in problemTagList" :label="item.value" :key="item.value">
                  <Option v-for="item2 in item.tags" :value="item2.value" :key="item2.value">{{ item2.label }}</Option>
                </OptionGroup>
              </Select>
            </FormItem>

            <FormItem label="题目来源" prop="problemSource">
              <Input v-model="problemInfo.problemSource" :placeholder="problemInfo.problemSource"></Input>
            </FormItem>
          </Form>
        </Modal>
        <!-- 用户信息修改框 -->
        
    </Card>
    <div class="problem-set-content-footer">
      <Button type="default" size="small" class="problem-set-content-button" @click="addProblem">添加</Button>
      <Button type="default" size="small" class="problem-set-content-button" @click="deleteProblem">删除</Button>
      <Button type="default" size="small" class="problem-set-content-button" @click="exportProblem">文件导出</Button>
      <Button type="default" size="small" class="problem-set-content-button" @click="tagsManagement">标签管理</Button>
      <Page 
          class="problem-set-content-page"
          size="small" show-elevator show-sizer
          :total="totalPage"
          :current.sync="pageNow"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"/>
    </div>

    <!-- 添加用户模态框 -->
    <Modal
        v-model="addProblemModal"
        title="添加用户"
        @on-ok="commitAddProblem">
        <Form :model="problemInfo" :rules="problemInfoRule" :label-width="115">
          <FormItem label="题目编码" prop="problemCode">
            <Input v-model="problemInfo.problemCode" placeholder="输入题目编码"></Input>
          </FormItem>

          <FormItem label="题目标题" prop="problemTitle">
            <Input v-model="problemInfo.problemTitle" placeholder="输入题目标题"></Input>
          </FormItem>

          <FormItem label="时间限制 (ms)" prop="timeLimit">
            <Input v-model="problemInfo.timeLimit" placeholder="输入时间限制"></Input>
          </FormItem>

          <FormItem label="空间限制 (MB)" prop="spaceLimit">
            <Input v-model="problemInfo.spaceLimit" placeholder="输入空间限制"></Input>
          </FormItem>

          <FormItem label="评测语言">
            <Select v-model="problemInfo.languages" multiple>
              <Option value="c++11">c++11</Option>
              <Option value="c++14">c++14</Option>
              <Option value="python2">python2</Option>
              <Option value="java8">java8</Option>
            </Select>
          </FormItem>

          <FormItem label="标签">
            <Select v-model="problemInfo.problemTags" multiple filterable allow-create>
              <OptionGroup v-for="item in problemTagList" :label="item.value" :key="item.value">
                <Option v-for="item2 in item.tags" :value="item2.value" :key="item2.value">{{ item2.label }}</Option>
              </OptionGroup>
            </Select>
          </FormItem>

          <FormItem label="题目来源" prop="problemSource">
              <Input v-model="problemInfo.problemSource" placeholder="输入题目来源"></Input>
            </FormItem>
        </Form>
    </Modal>
    <!-- 添加用户模态框 -->

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
import ProblemCode from '@/components/ProblemCode';

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value !== '') {
        this.$ref.problemInfo.validateField('passWordCheck');
      }
      callback();
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value !== this.problemInfo.passWord) {
        callback(new Error('两次输入的密码不匹配'));
      } else {
        callback();
      }
    };
    return {
      problemTableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '题目编码',
          key: 'problemCode',
          render: (h, params) => {
            if (params.row.problemCode !== undefined) {
              if (params.row.problemCode.length > 20) {
                const texts = params.row.problemCode.substring(0, 20) + '...';
                return h('Tooltip', {
                  props: {
                    placement: 'top',
                    maxWidth: '180'
                  }
                }, [
                  h(ProblemCode, {
                    props: {
                      problemCode: texts
                    }
                  }),
                  h('span', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-all'
                    }
                  }, params.row.problemCode)
                ]);
              } else {
                return h(ProblemCode, {
                  props: {
                    problemCode: params.row.problemCode
                  }
                });
              }
            }
          }
        },
        {
          title: '题目标题',
          key: 'problemTitle',
          render: (h, params) => {
            return h('div', {
              style: {
                cursor: 'pointer'
              }
            }, params.row.problemTitle)
          }
        },
        {
          title: '时间限制 (ms)',
          key: 'timeLimit',
          width: 150,
          sortable: 'custom'
        },
        {
          title: '空间限制 (MB)',
          key: 'spaceLimit',
          width: 150,
          sortable: 'custom'
        },
        {
          title: '通过 / 提交',
          key: 'acceptNum',
          sortable: 'custom',
          width: 130,
          render: (h, params) => {
            return h('span', [
              params.row.acceptNum,
              ' / ',
              params.row.submitNum
            ])
          }
        },
        {
          title: '\b',
          key: 'problemTags',
          render: (h, params) => {
            return h('div', { class: 'problem-set-problemtags' },
              params.row.problemTags.map(item => {
                return h('div', { class: 'problem-set-rolebox' }, [
                  h('div', { class: 'problem-set-role' }, item)
                ])
              }));
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
                    this.problemInfoModal = 'true';
                    this.problemInfo.problemCode = params.row.problemCode;
                    this.problemInfo.problemTitle = params.row.problemTitle;
                    this.problemInfo.timeLimit = params.row.timeLimit;
                    this.problemInfo.spaceLimit = params.row.spaceLimit;
                    this.problemInfo.problemTags = params.row.problemTags;
                    this.problemInfo.languages = params.row.languages;
                    this.problemInfo.problemSource = params.row.problemSource;
                  }
                }
              })
            ])
          }
        }
      ],
      problemTableData: [
        {
          problemCode: 'POJ-1001',
          problemTitle: 'A + B Problem',
          timeLimit: '1000',
          spaceLimit: '1024',
          acceptNum: '530',
          submitNum: '2030',
          problemSource: '北京大学在线评测系统',
          problemTags: ['线段树', '动态规划'],
          languages: ['c++11', 'c++14', 'python2', 'java8']
        }
      ],
      totalPage: 100,
      pageNow: 1,
      pageSize: 10,
      totalProblemNum: 0,
      sortBy: '',
      ascending: false,
      // 题目信息修改模态框标记
      problemInfoModal: false,
      // 添加题目模态框标记
      addProblemModal: false,
      // 标签管理模态框标记
      tagsManagementModal: false,
      problemInfo: {
        problemCode: '',
        problemTitle: '',
        timeLimit: '',
        spaceLimit: '',
        submitNum: '',
        acceptNum: '',
        problemSource: '',
        problemTags: [],
        languages: []
      },
      problemInfoRule: {
        problemCode: [
          { required: true, message: '题目编码不能为空', trigger: 'blur' },
          { type: 'string', message: '中间以 - 分割', trigger: 'blur' }
        ],
        problemTitle: [
          { required: true, message: '题目标题不能为空', trigger: 'blur' }
        ],
        timeLimit: [
          { required: true, message: '时间限制不能为空', trigger: 'blur' }
        ],
        spaceLimit: [
          { required: true, message: '空间限制不能为空', trigger: 'blur' }
        ],
        problemSource: [
          { required: false, trigger: 'change' }
        ],
        languages: [
          { required: false, trigger: 'change' }
        ],
        problemTags: [
          { required: false, trigger: 'change' }
        ]
      },
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
              value: '线性 DP',
              label: '线性 DP'
            },
            {
              value: '背包',
              label: '背包'
            },
            {
              value: '区间 DP',
              label: '区间 DP'
            },
            {
              value: '树形 DP',
              label: '树形 DP'
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
                    click: () => { this.append(data) }
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
  methods: {
    onPageChange: function(curPage) {
      this.pageNow = curPage;
      this.getProblemList();
    },
    onPageSizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.getProblemList();
    },
    handleProblemSort: function({ column, key, order }) {
      if (order === 'normal') {
        this.sortBy = '';
        this.ascending = false
      } else {
        this.sortBy = key;
        this.ascending = order === 'asc';
      }
    },
    commitProblemInfo () {
      // this.$Message.info('Clicked ok');
    },
    commitProblemPassword () {

    },
    // 添加用户按钮
    addProblem () {
      this.addProblemModal = 'true';
      this.problemInfo.ProblemCode = '';
      this.problemInfo.problemTitle = '';
      this.problemInfo.acceptNum = '';
      this.problemInfo.submitNum = '';
      this.problemInfo.problemTags = [];
      this.problemInfo.languages = [];
      this.problemInfo.timeLimit = '';
      this.problemInfo.spaceLimit = '';
      this.problemInfo.problemSource = '';
    },
    // 添加用户模态框确认
    commitAddProblem () {

    },
    // 标签管理按钮
    tagsManagement () {
      this.tagsManagementModal = 'true';
    },
    // 标签管理模态框确认
    commitTagsManagement () {

    },
    // 删除用户按钮
    deleteProblem () {

    },
    // 文件导出按钮
    exportProblem () {

    },
    // 树形标签函数
    renderTreeTags (h, { root, node, data }) {
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
              click: () => { this.append(data) }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.treeButtonProps, {
              icon: 'ios-remove'
            }),
            on: {
              click: () => { this.remove(root, node, data) }
            }
          })
        ])
      ]);
    },
    append (data) {
      const children = data.children || [];
      children.push({
        title: '空标签',
        expand: true
      });
      this.$set(data, 'children', children);
    },
    remove (root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    handleProblemClick: function(row, col) {
      if (col.key === 'problemTitle') {
        console.log(row.problemCode);
        console.log(this.$router)
        this.$router.push({
          name: 'problem-detail',
          params: {
            problemCode: row.problemCode
          }
        });
      }
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
.tree-tags .ivu-tree-title{
  width: 100%;
}
</style>