<template>
  <div>
    <Card :dis-hover="true">
      <p slot="title">Judge Template</p>
      <Table
        :columns="judgeTemplateColumns"
        :data="judgeTemplateData"
        class="template-set-content-table"
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
      </Table>

      <!-- 评测模板修改框 -->
      <Modal
        v-model="templateInfoModal"
        :loading="templateInfoModalLoading"
        :mask-closable="false"
        :title="`Template #${(templateInfo.id || '')}`"
        width="60%"
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
              <Option v-for="type in judgeTemplateType" :key="type" :value="type">
                {{ judgeTemplateProperity[type].name }}
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
              <CodeEditor :mode="templateInfo.type === judgeTemplateType.ADVANCED ? 'shell' : 'json'" :code.sync="templateInfo.shellScript" />
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
                <p>Click or drag files here to upload</p>
                <strong>Only support .zip</strong>
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
import { judgeTemplateType, judgeTemplateProperity } from '_u/types';
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
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { key: 'id' },
        { title: 'Type', slot: 'type' },
        { title: 'Title', key: 'title' },
        { title: 'Comment', key: 'comment' },
        { title: 'Remote OJ', key: 'remoteOj' },
        { title: 'Create', slot: 'create-time' },
        { title: 'Update', slot: 'update-time' },
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
                    api.getOneTemplate(params.row.id).then(ret => {
                      this.templateInfo = ret;
                      this.fileExtensionList = this.templateInfo.acceptFileExtensions;
                      this.isAddTemplate = false;
                      this.templateInfoModal = true;
                    });
                  }
                }
              })
            ])
          }
        }
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
      total: 0
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
          const loading = this.$Message.loading({
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
              }).finally(() => (loading()));
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
            }).finally(() => (loading()));
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
      }]).catch(err => (this.$Message.error(err)));
    },
    // 获取评测模板列表
    getTemplateList: function() {
      api.getTemplateList({
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        title: this.searchTitle
      }).then(ret => {
        this.judgeTemplateData = ret.rows;
        this.total = parseInt(ret.totalPage) * this.pageSize;
      }, err => (this.$Message.error(err.message)));
    }
  },
  computed: {
    judgeTemplateProperity: () => judgeTemplateProperity,
    judgeTemplateType: () => judgeTemplateType
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

<style lang="less" scoped>
  .none-float {
    float: none;
  }
</style>
