<template>
  <div>
    <Card dis-hover>
      <p slot="title">Problem</p>
      <!--      TODO: 题目列表和题面一样可以在table上直接修改-->
      <Table
        :loading="loading"
        :columns="problemColumns"
        :data="problems"
        no-data-text=""
        class="content-table"
        @on-sort-change="onSort">
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
        <template slot-scope="{ row }" slot="ratio">
          <span>{{ `${row.acceptNum} / ${row.submitNum}` }}</span>
        </template>
        <template slot-scope="{ row }" slot="time">
          <span class="time">{{ row.timeLimit || 0 }}</span>
        </template>
        <template slot-scope="{ row }" slot="mem">
          <span class="mem">{{ row.memoryLimit || 0 }}</span>
        </template>
        <template slot-scope="{ row }" slot="tag">
          <div class="tags">
            <Tag v-for="item in row.tagDTOList" :key="item.id">{{ item.title }}</Tag>
          </div>
        </template>
        <template slot-scope="{ row }" slot="edit">
          <span class="clickable" @click="onEditProblem(row)">Edit</span>
          <Divider type="vertical" />
          <span class="clickable" @click="showProblemDescriptions(row)">Description</span>
          <Divider type="vertical" />
          <span class="clickable" @click="showProblemCheckpoints(row)">Checkpoints</span>
        </template>
      </Table>
    </Card>
    <div class="footer-tools">
      <Button type="default" size="small" class="float-left footer-btn" @click="addProblem">Add</Button>
      <Button type="default" size="small" class="float-left footer-btn" @click="tagsManagement">Tags</Button>
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

    <Modal
      v-model="problemInfoModal"
      :loading="problemInfoModalLoading"
      @on-ok="handleUpdateProblem">
      <template slot="header">
        <ProblemCode v-if="problemInfo.problemCode" :problemCode="problemInfo.problemCode"/>
        <div v-else class="ivu-modal-header-inner">Add Problem</div>
      </template>

      <Form :model="problemInfo" :rules="problemColumnRules" ref="problemInfo">
        <FormItem label="Title" prop="problemTitle">
          <Input v-model="problemInfo.problemTitle" />
        </FormItem>
        <FormItem label="Public" required>
          <i-switch :value="problemInfo.isPublic" :true-value="1" :false-value="0" />
        </FormItem>
        <FormItem label="Time Limit" required>
          <Input v-model.number="problemInfo.timeLimit">
            <span slot="append">ms</span>
          </Input>
        </FormItem>
        <FormItem label="Memory Limit" required>
          <Input v-model.number="problemInfo.memoryLimit">
            <span slot="append">KB</span>
          </Input>
        </FormItem>
        <FormItem label="Juidge Template" v-if="problemInfoModal">
          <Select
            multiple
            filterable
            v-model="problemInfo.judgeTemplates"
            :loading="judgeTemplateQueryLoading"
            :remote-method="queryTemplateOptions"
            :default-label="(this.problemInfo.judgeTemplateListDTOList || []).map(o => `${o.id}: ${o.title}`)"
            @on-set-default-options="setJudgeTemplateSet">
            <Option v-for="template in judgeTemplateSet" :key="template.value" :value="template.value" :label="template.label">
              <span>{{ template.label }}</span>
              <span style="color: #ccc"> {{ template.comment }}</span>
              <span style="float: right;color: #ccc; margin-right: 20px">{{ template.type }}</span>
            </Option>
          </Select>
        </FormItem>
        <!--        tag 暂不可用-->
        <!--        <FormItem label="Tags">-->

        <!--        </FormItem>-->
        <FormItem label="Source">
          <Input v-model="problemInfo.source" />
        </FormItem>
      </Form>
    </Modal>

    <Modal
      v-model="descriptionModel"
      width="80%"
      footer-hide
      :closable="false">
      <ProblemDescription ref="ProblemDescription" />
    </Modal>

    <Modal
      v-model="checkpointModel"
      width="80%"
      ok-text="Save"
      cancel-text="Unsave"
      :mask-closable="false"
      :loading="uploadModalLoading"
      @on-ok="saveCheckpoints">
      <ProblemCheckpoint ref="ProblemCheckpoint" />
    </Modal>
  </div>
</template>

<script>
import ProblemCode from '_c/ProblemCode';
import ProblemCheckpoint from '_c/problem/ProblemCheckpoint';
import ProblemDescription from '_c/problem/ProblemDescription';
import api from '_u/api';
import { JUDGE_TEMPLATE_PROPERTY } from '_u/constants';
import { Page } from '_c/mixins';
export default {
  name: 'ProblemView',
  components: {
    ProblemCode,
    ProblemCheckpoint,
    ProblemDescription
  },
  mixins: [Page],
  data: function() {
    return {
      problemColumns: [
        { title: 'Id', key: 'problemId', maxWidth: 80 },
        { key: 'problemCode', maxWidth: 130, slot: 'code' },
        { title: 'Title', key: 'problemTitle' },
        { title: 'Time Limit', key: 'timeLimit', sortable: 'custom', slot: 'time' },
        { title: 'Memory Limit', key: 'memoryLimit', sortable: 'custom', slot: 'mem' },
        { title: 'AC Ratio', sortable: 'custom', slot: 'ratio' },
        { title: 'Source', key: 'source' },
        { title: 'Owner', key: 'username' },
        { title: '\b', slot: 'tag' },
        { title: '\b', slot: 'edit', minWidth: 150 }
      ],
      problemColumnRules: {
        problemTitle: [{ required: true, max: 96, trigger: 'blur' }]
      },
      problems: [],
      problemInfo: {},
      judgeTemplateSet: [],
      loading: false,
      problemInfoModalLoading: true,
      uploadModalLoading: true,
      judgeTemplateQueryLoading: false,
      problemInfoModal: false,
      checkpointModel: false,
      descriptionModel: false,
      isAddProblem: false
    }
  },
  methods: {
    getProblemList: function() {
      this.loading = true;
      api.getProblemList({
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        sortBy: this.sortBy,
        ascending: this.ascending
      }).then(ret => {
        this.problems = ret.rows;
        this.total = parseInt(ret.totalPage) * this.pageSize;
      }).finally(() => (this.loading = false));
    },
    handleUpdateProblem: function() {
      this.$refs.problemInfo.validate(valid => {
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
            .then(_ => {
              this.$Message.success('Success');
              this.getProblemList();
              this.problemInfoModal = false;
            }, err => {
              this.$Message.error(err.message);
              this.problemInfoModalLoading = false;
              this.$nextTick(() => {
                this.problemInfoModalLoading = true;
              })
            })
        } else {
          this.problemInfoModalLoading = false;
          this.$nextTick(() => {
            this.problemInfoModalLoading = true;
          })
        }
      })
    },
    addProblem: function() {
      this.problemInfo = {
        problemCode: '',
        problemTitle: '',
        isPublic: 1,
        tagDTOList: [],
        judgeTemplateListDTOList: [],
        judgeTemplates: [],
        timeLimit: 1000,
        memoryLimit: 262144,
        source: ''
      };
      this.isAddProblem = true;
      this.problemInfoModal = true;
    },
    onEditProblem: function(problem) {
      this.problemInfo = problem;
      this.isAddProblem = false;
      this.problemInfoModal = true;
    },
    showProblemDescriptions: function(problem) {
      this.$refs.ProblemDescription.query(problem);
      this.descriptionModel = true;
    },
    showProblemCheckpoints: function(problem) {
      this.$refs.ProblemCheckpoint.query(problem.problemCode);
      this.checkpointModel = true;
    },
    saveCheckpoints: function() {
      this.$refs.ProblemCheckpoint.save(() => {
        this.checkpointModel = false;
      }, () => {
        this.uploadModalLoading = false;
        this.$nextTick(() => {
          this.uploadModalLoading = true;
        });
      })
    },
    queryTemplateOptions: function(query) {
      if (query !== '') {
        this.judgeTemplateQueryLoading = true;
        api.queryTemplateTitle(query).then(ret => {
          this.judgeTemplateSet = ret.map(o => {
            return {
              value: o.id,
              label: `${o.id}: ${o.title}`,
              comment: o.comment,
              type: JUDGE_TEMPLATE_PROPERTY[o.type].name
            }
          });
          this.judgeTemplateQueryLoading = false;
        })
      } else {
        this.judgeTemplateSet = [];
      }
    },
    setJudgeTemplateSet: function() {
      this.judgeTemplateSet = this.problemInfo.judgeTemplateListDTOList.map(o => {
        return {
          value: o.id,
          label: `${o.id}: ${o.title}`,
          comment: o.comment,
          type: JUDGE_TEMPLATE_PROPERTY[o.type].name
        }
      });
    },
    tagsManagement: function() {
    }
  },
  mounted: function() {
    this.getProblemList();
  },
  watch: {
    $route: function () {
      this.getProblemList()
    }
  }
}
</script>

<style lang="less" scoped>
  .time::after {
    content: " ms\0A";
    white-space: pre;
  }
  .mem::after {
    content: " KB\0A";
    white-space: pre;
  }
</style>
