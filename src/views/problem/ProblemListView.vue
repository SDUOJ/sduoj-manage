<!--
   Copyright 2020-2021 the original author or authors.

   Licensed under the General Public License, Version 3.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

        https://www.gnu.org/licenses/gpl-3.0.en.html
 -->

<template>
  <div>
    <Card dis-hover>
      <p slot="title">Problem</p>
      <!--      TODO: 题目列表和题面一样可以在table上直接修改-->
      <Table
        :loading="tableLoading"
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
          <span>{{ row.problemTitle }}</span>
          <Tag v-if="row.isPublic === 0" style="margin-left: 5px" color="volcano">Private</Tag>
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
          <span class="clickable" @click="onEditProblem(row, false)">Edit</span>
          <Divider type="vertical" />
          <span class="clickable" @click="onEditProblem(row, true)">Fork</span>
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
      v-model="problemModal"
      :loading="problemInfoModalLoading"
      @on-ok="handleUpdateProblem">
      <template slot="header">
        <div v-if="isAddProblem" class="ivu-modal-header-inner">Add Problem</div>
        <ProblemCode v-else :problemCode="problem.problemCode"/>
      </template>

      <Form :model="problem" :rules="problemColumnRules" ref="problem">
        <FormItem label="Title" prop="problemTitle">
          <Input v-model="problem.problemTitle" />
        </FormItem>
        <FormItem label="Public" required>
          <i-switch v-model="problem.isPublic" :true-value="1" :false-value="0" />
        </FormItem>
        <FormItem label="Time Limit" required>
          <Input v-model.number="problem.timeLimit">
            <span slot="append">ms</span>
          </Input>
        </FormItem>
        <FormItem label="Memory Limit" required>
          <Input v-model.number="problem.memoryLimit">
            <span slot="append">KiB</span>
          </Input>
        </FormItem>
        <FormItem label="Judge Template" v-if="problemModal">
          <Select
            transfer
            multiple
            filterable
            v-model="problem.judgeTemplates"
            :loading="judgeTemplateQueryLoading"
            :remote-method="queryTemplateOptions"
            :default-label="(problem.judgeTemplateListDTOList || []).map(o => `${o.id}: ${o.title}`)"
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
<!--        <FormItem label="Manager Groups" v-if="problemModal">-->
<!--          <Select-->
<!--            transfer-->
<!--            multiple-->
<!--            filterable-->
<!--            v-model="problem.managerGroups"-->
<!--            :loading="groupQueryLoading"-->
<!--            :remote-method="queryGroups"-->
<!--            :default-label="(problem.managerGroupDTOList || []).map(o => `${o.groupId}: ${o.title}`)"-->
<!--            @on-set-default-options="setGroupSet">-->
<!--            <Option v-for="group in groupSet" :key="group.groupId" :value="group.groupId" :label="`${group.groupId}: ${group.title}`" />-->
<!--          </Select>-->
<!--        </FormItem>-->
        <FormItem label="Source">
          <Input v-model="problem.source" />
        </FormItem>
      </Form>
    </Modal>

    <Modal
      v-model="descriptionModel"
      width="80%"
      footer-hide>
      <template slot="header">
        <ProblemCode :problemCode="problem.problemCode"/>
        <span>{{ problem.problemTitle }}</span>
      </template>
      <ProblemDescription ref="ProblemDescription" />
    </Modal>

    <Modal
      v-model="checkpointModel"
      width="80%"
      ok-text="Save"
      :mask-closable="false"
      :loading="uploadModalLoading"
      @on-ok="saveCheckpoints">
      <template slot="header">
        <ProblemCode :problemCode="problem.problemCode"/>
        <span>{{ problem.problemTitle }}</span>
      </template>
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
        { title: 'Title', slot: 'title' },
        { title: 'Time Limit', key: 'timeLimit', sortable: 'custom', slot: 'time' },
        { title: 'Memory Limit', key: 'memoryLimit', sortable: 'custom', slot: 'mem' },
        { title: 'AC Ratio', sortable: 'custom', slot: 'ratio' },
        { title: 'Source', key: 'source' },
        { title: 'Owner', key: 'username' },
        // { title: '\b', slot: 'tag' },
        { title: '\b', slot: 'edit', minWidth: 150 }
      ],
      problemColumnRules: {
        problemTitle: [{ required: true, max: 96, trigger: 'blur' }]
      },
      problems: [],
      problem: {},
      judgeTemplateSet: [],
      // groupSet: [],
      tableLoading: false,
      problemInfoModalLoading: true,
      uploadModalLoading: true,
      judgeTemplateQueryLoading: false,
      // groupQueryLoading: false,
      problemModal: false,
      checkpointModel: false,
      descriptionModel: false,
      isAddProblem: false
    }
  },
  methods: {
    getProblemList: function() {
      this.tableLoading = true;
      api.getProblemList({
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        sortBy: this.sortBy,
        ascending: this.ascending
      }).then(ret => {
        this.problems = ret.rows;
        this.total = parseInt(ret.totalPage) * this.pageSize;
      }).catch(err => {
        this.$Message.error(err.message);
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    handleUpdateProblem: function() {
      this.$refs.problem.validate(valid => {
        if (valid) {
          const data = {
            problemCode: this.problem.problemCode,
            isPublic: this.problem.isPublic,
            problemTitle: this.problem.problemTitle,
            source: this.problem.source,
            judgeTemplates: this.problem.judgeTemplates,
            // managerGroups: this.problem.managerGroups,
            memoryLimit: parseInt(this.problem.memoryLimit),
            timeLimit: parseInt(this.problem.timeLimit)
          }
          api[this.isAddProblem ? 'createProblem' : 'updateProblemInfo'](data)
            .then(_ => {
              this.$Message.success('Success');
              this.getProblemList();
              this.problemModal = false;
            }).catch(err => {
              this.$Message.error(err.message);
              this.problemInfoModalLoading = false;
              this.$nextTick(() => {
                this.problemInfoModalLoading = true;
              });
            });
        } else {
          this.problemInfoModalLoading = false;
          this.$nextTick(() => {
            this.problemInfoModalLoading = true;
          });
        }
      })
    },
    addProblem: function() {
      this.problem = {
        problemCode: '',
        problemTitle: '',
        isPublic: 1,
        tagDTOList: [],
        judgeTemplateListDTOList: [],
        judgeTemplates: [],
        timeLimit: 1000,
        memoryLimit: 262144,
        source: ''
        // managerGroupDTOList: [],
        // managerGroups: []
      };
      this.isAddProblem = true;
      this.problemModal = true;
    },
    onEditProblem: function(row, fork) {
      const removeLoading = this.$Message.loading({
        content: 'Loading',
        duration: 0
      });
      api.getProblem({ problemCode: row.problemCode }).then(ret => {
        this.problem = Object.assign(ret, row);
        this.isAddProblem = fork;
        this.problemModal = true;
      }).catch(err => {
        this.$Message.error(err.message);
      }).finally(() => {
        removeLoading();
      });
    },
    showProblemDescriptions: function(problem) {
      const removeLoading = this.$Message.loading({
        content: 'Loading',
        duration: 0
      });
      this.$refs.ProblemDescription.query(problem).then(() => {
        this.problem = problem;
        this.descriptionModel = true;
      }).catch(err => {
        this.$Message.error(err.message);
      }).finally(() => {
        removeLoading();
      });
    },
    showProblemCheckpoints: function(problem) {
      const removeLoading = this.$Message.loading({
        content: 'Loading',
        duration: 0
      });
      this.$refs.ProblemCheckpoint.query(problem.problemCode).then(() => {
        this.problem = problem;
        this.checkpointModel = true;
      }).catch(err => {
        this.$Message.error(err.message);
      }).finally(() => {
        removeLoading();
      });
    },
    saveCheckpoints: function() {
      this.$refs.ProblemCheckpoint.save(() => {
        this.checkpointModel = false;
      }, () => {
        this.uploadModalLoading = false;
        this.$nextTick(() => {
          this.uploadModalLoading = true;
        });
      });
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
      this.judgeTemplateSet = this.problem.judgeTemplateListDTOList.map(o => {
        return {
          value: o.id,
          label: `${o.id}: ${o.title}`,
          comment: o.comment,
          type: JUDGE_TEMPLATE_PROPERTY[o.type].name
        };
      });
    },
    queryGroups: function (title) {
      if (title !== '') {
        this.groupQueryLoading = true;
        api.queryGroupTitle({ title }).then(ret => {
          this.groupSet = ret;
          this.groupQueryLoading = false;
        }).catch(err => {
          this.$Message.error(err.message);
        })
      } else {
        this.groupSet = [];
      }
    },
    setGroupSet: function () {
      this.groupSet = this.problem.managerGroupDTOList;
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
