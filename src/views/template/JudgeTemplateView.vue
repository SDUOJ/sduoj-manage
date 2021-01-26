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
      <p slot="title">Judge Template</p>
      <Table
        :columns="judgeTemplateColumns"
        :data="judgeTemplateData"
        :loading="tableLoading"
        class="content-table"
        @on-selection-change="selectChange">
        <template slot-scope="{ row }" slot="type">
          <Tag :color="row.type | judgeTemplateTypeClass">{{ row.type | judgeTemplateTypeName }}</Tag>
        </template>
        <template slot-scope="{ row }" slot="create-time">
          <Time slot="extra" :time="row.gmtCreate | parseInt" type="datetime"/>
        </template>
        <template slot-scope="{ row }" slot="update-time">
          <Time slot="extra" :time="row.gmtModified | parseInt" type="datetime"/>
        </template>
        <template slot-scope="{ row }" slot="action">
          <span class="clickable" @click="initializeJudgeTemplateModal(row, false)">Edit</span>
          <Divider type="vertical" />
          <span class="clickable" @click="initializeJudgeTemplateModal(row, true)">Fork</span>
        </template>
      </Table>

      <!-- 评测模板修改框 -->
      <Modal
        v-model="templateInfoModal"
        width="60%"
        :loading="templateInfoModalLoading"
        :mask-closable="false"
        :title="isAddTemplate ? 'Add Judge Template' : `Template #${templateInfo.id}`"
        @on-ok="commitTemplateInfo">
        <Form ref="templateInfo" :model="templateInfo" label-position="top">
          <FormItem label="Title" prop="title" required>
            <Input v-model="templateInfo.title" />
          </FormItem>
          <FormItem label="Comment">
            <Input v-model="templateInfo.comment" />
          </FormItem>
          <FormItem label="Type" prop="type" required>
            <Select v-model="templateInfo.type">
              <Option v-for="type in JUDGE_TEMPLATE_TYPE" :key="type" :value="type">
                {{ JUDGE_TEMPLATE_PROPERTY[type].name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="File Extensions" prop="acceptFileExtensions" required>
            <Select
              v-model="templateInfo.acceptFileExtensions"
              filterable
              multiple
              allow-create
              @on-create="handleCreateExtension">
              <Option v-for="item in fileExtensionList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="Script" prop="shellScript" required>
            <div style="">
              <CodeEditor :mode="templateInfo.type === JUDGE_TEMPLATE_TYPE.ADVANCED ? 'shell' : 'json'" :code.sync="templateInfo.shellScript" />
            </div>
          </FormItem>
          <FormItem>
            <div slot="label">
              <span>ZIP</span>
              <Divider type="vertical" />
              <Tooltip content="Download" placement="right" v-if="!!templateInfo.zipFileId" >
                <Tag class="hover" closable @on-close="templateInfo.zipFileId=''" @click.native="handleDownload(templateInfo.zipFileId)">
                  {{ templateInfo.zipFileId }}
                </Tag>
              </Tooltip>
              <span class="clickable" style="margin-left: 5px" v-if="fileList.length > 0" @click="clearFileList">Clear</span>
            </div>
            <Upload
              paste
              type="drag"
              accept=".zip"
              :format="['zip']"
              :file-list.sync="fileList"
              ref="upload">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <strong>Only support .zip</strong>
                <p>Click or drag files here to upload</p>
              </div>
            </Upload>
          </FormItem>
        </Form>
      </Modal>

    </Card>
    <div class="footer-tools">
      <Button type="default" size="small" class="float-left footer-btn" @click="addJudgeTemplate">Add</Button>
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
  </div>
</template>

<script>
import api from '_u/api';
import { JUDGE_TEMPLATE_TYPE, JUDGE_TEMPLATE_PROPERTY } from '_u/constants';
import CodeEditor from '_c/editor/CodeEditor';
import Upload from '_c/upload/upload';

import { Page } from '_c/mixins';

export default {
  components: {
    CodeEditor,
    Upload
  },
  mixins: [Page],
  data: function() {
    return {
      judgeTemplateColumns: [
        // { type: 'selection', width: 60, align: 'center' },
        { key: 'id', maxWidth: 80 },
        { title: 'Type', slot: 'type' },
        { title: 'Owner', key: 'username' },
        { title: 'Title', key: 'title' },
        { title: 'Comment', key: 'comment' },
        { title: 'Remote OJ', key: 'remoteOj' },
        { title: 'Create', slot: 'create-time', minWidth: 50 },
        { title: 'Update', slot: 'update-time', minWidth: 50 },
        { title: '\b', slot: 'action' }
      ],
      judgeTemplateData: [],
      selectedTemplate: [],
      isAddTemplate: false,
      templateInfoModal: false,
      templateInfoModalLoading: true,
      templateInfo: {},
      fileList: [],
      fileExtensionList: [],
      searchTitle: '',
      tableLoading: false
    }
  },
  filters: {
    parseInt: (val) => parseInt(val),
    judgeTemplateTypeClass: type => {
      return JUDGE_TEMPLATE_PROPERTY[type].color;
    },
    judgeTemplateTypeName: type => {
      return JUDGE_TEMPLATE_PROPERTY[type].name;
    }
  },
  methods: {
    // 表格全选
    selectChange: function (selection) {
      this.selectedTemplate = selection;
    },
    clearFileList: function() {
      this.fileList = [];
      this.$refs.upload.clearFiles()
    },
    commitTemplateInfo: function() {
      this.$refs.templateInfo.validate(async valid => {
        if (valid) {
          const removeLoading = this.$Message.loading({
            content: 'Uploading',
            duration: 0
          });
          // check md5
          if (this.fileList.length > 0) {
            const file = this.fileList[0];
            let ret = await api.checkMD5(file.md5);
            if (!ret) {
              const form = new FormData();
              form.append('files', file.file)
              ret = await api.multiUpload(form);
              this.templateInfo.zipFileId = ret[0].id;
            } else {
              this.templateInfo.zipFileId = ret.id;
            }
            this.clearFileList();
          }

          if (this.isAddTemplate) {
            api.createTemplate(this.templateInfo)
              .then(_ => {
                this.$Message.success('Success');
                this.getTemplateList();
                this.templateInfoModal = false;
              }).catch(_ => {
                this.templateInfoModalLoading = false;
                this.$nextTick(() => {
                  this.templateInfoModalLoading = true;
                })
              }).finally(() => {
                removeLoading();
              });
          } else {
            api.updateTemplate({
              id: this.templateInfo.id,
              type: this.templateInfo.type,
              title: this.templateInfo.title,
              shellScript: this.templateInfo.shellScript,
              zipFileId: this.templateInfo.zipFileId || '',
              acceptFileExtensions: this.templateInfo.acceptFileExtensions,
              comment: this.templateInfo.comment
            }).then(_ => {
              this.$Message.success('Updated');
              this.templateInfoModal = false;
            }).catch(_ => {
              this.templateInfoModalLoading = false;
              this.$nextTick(() => {
                this.templateInfoModalLoading = true;
              })
            }).finally(() => {
              removeLoading();
            });
          }
        } else {
          this.$Message.error('Invalid format');
          this.templateInfoModalLoading = false;
          this.$nextTick(() => {
            this.templateInfoModalLoading = true;
          })
        }
      })
    },
    addJudgeTemplate: function() {
      this.templateInfo = {
        title: '',
        comment: '',
        type: 0,
        shellScript: '',
        acceptFileExtensions: [],
        zipFileId: ''
      };
      this.fileExtensionList = [];
      this.isAddTemplate = true;
      this.templateInfoModal = true;
    },
    handleCreateExtension: function(val) {
      this.templateInfo.acceptFileExtensions.push(val);
    },
    handleDownload: function(zipFileId) {
      api.zipDownload([{
        id: zipFileId,
        downloadFilename: `${Date.now()}.zip`
      }]).catch(err => {
        this.$Message.error(err.message)
      });
    },
    // 获取评测模板列表
    getTemplateList: function() {
      this.tableLoading = true;
      api.getTemplateList({
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        title: this.searchTitle
      }).then(ret => {
        this.judgeTemplateData = ret.rows;
        this.total = parseInt(ret.totalPage) * this.pageSize;
      }).catch(err => {
        this.$Message.error(err.message);
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    initializeJudgeTemplateModal: function (row, fork) {
      const removeLoading = this.$Message.loading({
        content: 'Loading',
        duration: 0
      });
      api.getOneTemplate(row.id).then(ret => {
        this.templateInfo = ret;
        this.fileExtensionList = this.templateInfo.acceptFileExtensions;
        this.isAddTemplate = fork;
        this.templateInfoModal = true;
      }).catch(err => {
        this.$Message.error(err.message);
      }).finally(() => {
        removeLoading();
      });
    }
  },
  computed: {
    JUDGE_TEMPLATE_PROPERTY: () => JUDGE_TEMPLATE_PROPERTY,
    JUDGE_TEMPLATE_TYPE: () => JUDGE_TEMPLATE_TYPE
  },
  mounted: function () {
    this.getTemplateList()
  },
  watch: {
    $route: function() {
      this.getTemplateList();
    },
    searchTitle: function() {
      this.getTemplateList();
    }
  }
}
</script>
