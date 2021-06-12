<!--
   Copyright 2020-2021 the original author or authors.

   Licensed under the General Public License, Version 3.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

        https://www.gnu.org/licenses/gpl-3.0.en.html
 -->

<template>
  <div>
    <Form :model="problem" :rules="problemColumnRules" ref="problem" label-position="top">
      <Tabs v-model="tabName" :animated="false">
        <TabPane :label="tabLabels.basic" name="basic">
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
          <FormItem label="Output Limit" required>
            <Input v-model.number="problem.outputLimit">
              <span slot="append">KiB</span>
            </Input>
          </FormItem>
          <!--        tag 暂不可用-->
          <!--        <FormItem label="Tags">-->

          <!--        </FormItem>-->
          <FormItem label="Manager Groups">
            <Select
              transfer
              multiple
              filterable
              v-model="problem.managerGroups"
              :loading="groupQueryLoading"
              :remote-method="queryGroups"
              :default-label="(problem.managerGroupDTOList || []).map(o => `${o.groupId}: ${o.title}`)"
              @on-set-default-options="setGroupSet">
              <Option v-for="group in groupSet" :key="group.groupId" :value="group.groupId" :label="`${group.groupId}: ${group.title}`" />
            </Select>
          </FormItem>
          <FormItem label="Source">
            <Input v-model="problem.source" />
          </FormItem>
        </TabPane>
        <TabPane :label="tabLabels.jt" name="Judge Template">
          <FormItem label="Type" required>
            <RadioGroup v-model="jtType">
              <Radio :label="JUDGE_TEMPLATE_TYPE.IO">{{ JUDGE_TEMPLATE_PROPERTY[JUDGE_TEMPLATE_TYPE.IO].name }}</Radio>
              <Radio :label="JUDGE_TEMPLATE_TYPE.ADVANCED">{{ JUDGE_TEMPLATE_PROPERTY[JUDGE_TEMPLATE_TYPE.ADVANCED].name }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="Judge Template" required v-if="problemReady">
            <Select
              transfer
              multiple
              filterable
              v-model="problem.judgeTemplates"
              :loading="judgeTemplateQueryLoading">
              <Option v-for="template in judgeTemplateSet" :key="template.value" :value="template.value" :label="template.label">
                <span>{{ template.label }}</span>
                <span style="color: #ccc"> {{ template.comment }}</span>
                <span style="float: right;color: #ccc; margin-right: 20px">{{ template.type }}</span>
              </Option>
            </Select>
          </FormItem>
          <div v-if="jtType === JUDGE_TEMPLATE_TYPE.IO">
            <FormItem label="Checker" required>
              <Select v-model="checker" transfer >
                <Option value="custom">Customized Checker</Option>
                <Option v-for="ch in PREDEFINED_CHECKERS" :value="ch.name" :key="ch.name">
                  {{ `${ch.name} - ${ch.description}` }}
                </Option>
              </Select>
            </FormItem>
            <div v-if="checker === 'custom'">
              <FormItem label="Source Code" required>
                <div style="border: 1px solid #dcdee2; border-radius: 4px; padding: 1px">
                  <CodeEditor mode="cpp" :code.sync="checkerCode" />
                </div>
              </FormItem>
              <FormItem label="Config" required>
                <div style="border: 1px solid #dcdee2; border-radius: 4px; padding: 1px">
                  <CodeEditor mode="json" :code.sync="checkerConfig" />
                </div>
              </FormItem>
            </div>
          </div>
          <div v-else-if="jtType === JUDGE_TEMPLATE_TYPE.ADVANCED">

          </div>
        </TabPane>
      </Tabs>
    </Form>
  </div>
</template>

<script>
import CodeEditor from '_c/editor/CodeEditor';
import api from '_u/api';
import { JUDGE_TEMPLATE_PROPERTY, JUDGE_TEMPLATE_TYPE, PREDEFINED_CHECKERS } from '_u/constants';

export default {
  name: 'ProblemForm',
  components: { CodeEditor },
  data: function() {
    return {
      problemColumnRules: {
        problemTitle: [{ required: true, max: 96, trigger: 'blur' }]
      },
      problem: {},
      groupSet: [],
      groupQueryLoading: false,
      jtType: 0,
      checker: PREDEFINED_CHECKERS[0].name,
      checkerCode: '',
      checkerConfig: '',
      judgeTemplateSet: [],
      judgeTemplateQueryLoading: false,
      tabName: 'basic',
      problemReady: false
    }
  },
  computed: {
    JUDGE_TEMPLATE_TYPE: () => JUDGE_TEMPLATE_TYPE,
    JUDGE_TEMPLATE_PROPERTY: () => JUDGE_TEMPLATE_PROPERTY,
    PREDEFINED_CHECKERS: () => PREDEFINED_CHECKERS,
    tabLabels: function () {
      const labels = {
        basic: 'Basic',
        // ft: 'Function Template',
        jt: 'Judge Template'
      }
      return  labels;
    }
  },
  methods: {
    setProblem: function (problem) {
      if (problem.checkerConfig) {
        if (problem.checkerConfig.spj === null) {
          // predefined checker
          this.checker = problem.checkerConfig.source;
          this.checkerCode = '';
          this.checkerConfig = '';
        } else {
          // customized checker
          this.checker = 'custom';
          this.checkerCode = problem.checkerConfig.source;
          this.checkerConfig = JSON.stringify(JSON.parse(problem.checkerConfig.spj), null, 2);
        }
      }
      if (this.problem.problemCode !== problem.problemCode) {
        this.tabName = 'basic';
      }
      this.problem = problem;
      this.queryJudgeTemplateList();
      this.problemReady = true;
    },
    queryJudgeTemplateList: function() {
      this.judgeTemplateQueryLoading = true;
      api.getJudgeTemplateList({
        type: this.jtType,
        problemCode: this.problem.problemCode
      }).then(ret => {
        this.judgeTemplateSet = ret.map(o => {
          return {
            value: o.id,
            label: `${o.id}: ${o.title}`,
            comment: o.comment,
            type: JUDGE_TEMPLATE_PROPERTY[o.type].name
          };
        });
        this.judgeTemplateQueryLoading = false;
      }).catch(err => {
        this.$Message.error(err.message);
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
    save: function (apiName) {
      return new Promise((resolve, reject) => {
        this.$refs.problem.validate(valid => {
          if (!valid) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ message: 'Invalid Form' });
            return;
          }
          const data = {
            problemCode: this.problem.problemCode,
            isPublic: this.problem.isPublic,
            problemTitle: this.problem.problemTitle,
            source: this.problem.source,
            judgeTemplates: this.problem.judgeTemplates,
            managerGroups: this.problem.managerGroups,
            memoryLimit: parseInt(this.problem.memoryLimit),
            outputLimit: parseInt(this.problem.outputLimit),
            timeLimit: parseInt(this.problem.timeLimit)
          }

          if (this.jtType === JUDGE_TEMPLATE_TYPE.IO) {
            if (this.checker === 'custom') {
              data.checkerConfig = {
                source: this.checkerCode,
                spj: this.checkerConfig
              };
            } else {
              data.checkerConfig = {
                source: this.checker,
                spj: null
              };
            }
          }

          api[apiName](data).then(resolve).catch(reject);
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
