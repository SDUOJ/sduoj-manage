<template>
  <div>
    <Card :dis-hover="true">
      <p slot="title">
        评测模板管理
      </p>
      <Input placeholder="评测模板搜索" style="width: auto" slot="extra" v-model.lazy="searchTitle">
        <Icon type="ios-search" slot="suffix"/>
      </Input>
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
        :mask-closable="false"
        v-model="templateInfoModal"
        :title="'Template #' + (templateInfo.id || '')"
        width="1000"
        @on-ok="commitTemplateInfo">
        <Form ref="templateInfo" :model="templateInfo" :rules="templateInfoRule" label-position="top">
          <FormItem label="ID">
            <Input :placeholder="templateInfo.id || ''" disabled />
          </FormItem>
          <FormItem label="Title" prop="title">
            <Input v-model="templateInfo.title" />
          </FormItem>
          <FormItem label="Comment">
            <Input v-model="templateInfo.comment" />
          </FormItem>
          <FormItem label="Type" prop="type">
            <Select v-model="templateInfo.type">
              <Option v-for="type in judgeTemplateType" :key="type" :value="type">
                {{ judgeTemplateProperity[type].name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="File Extensions" prop="acceptFileExtensions">
            <Select
              v-model="templateInfo.acceptFileExtensions"
              filterable
              multiple
              allow-create
              :default-label="templateInfo.acceptFileExtensions"
              @on-create="handleCreateExtension">
              <Option v-for="item in fileExtensionList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="Script" prop="shellScript">
            <div style="border: 1px solid #dcdee2; border-radius: 4px">
              <ShellEditor v-if="templateInfo.type === judgeTemplateType.ADVANCED" :code.sync="templateInfo.shellScript" />
              <JsonEditor v-else :code.sync="templateInfo.shellScript" />
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
              </div>
            </Upload>
          </FormItem>
        </Form>
      </Modal>
      <!-- 题目信息修改框 -->

    </Card>
    <div class="footer-tools">
      <Button type="default" size="small" class="float-left footer-btn" @click="addJudgeTemplate">添加</Button>
      <Page
        class="float-right"
        size="small" show-elevator show-sizer
        :total="totalNum"
        :current.sync="pageNow"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"/>
    </div>
  </div>
</template>

<script>
import api from '_u/api';
import { judgeTemplateType, judgeTemplateProperity } from '_u/types';
import JsonEditor from '_c/editor/JsonEditor';
import ShellEditor from '_c/editor/ShellEditor';
import Upload from '_c/upload/upload';

export default {
  components: {
    ShellEditor,
    JsonEditor,
    Upload
  },
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
      totalNum: 100,
      pageNow: 1,
      pageSize: 10,
      isAddTemplate: false,
      templateInfoModal: false,
      templateInfo: {},
      templateInfoRule: {
        title: [{ required: true, trigger: 'blur' }],
        type: [{ type: 'number', required: true, trigger: 'change' }],
        acceptFileExtensions: [{ type: 'array', required: true, trigger: 'change' }],
        shellScript: [{ required: true, trigger: 'change' }]
      },
      fileList: [],
      fileExtensionList: [],
      searchTitle: ''
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
    // 题目信息修改模态框确认
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
            }).finally(() => (loading()));
          }
        } else {
          this.$Message.error('格式不符');
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
        downloadFilename: Date.now() + '.zip'
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
        this.totalNum = parseInt(ret.total);
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
    searchTitle: function() {
      this.getTemplateList();
    },
    pageSize: function() {
      this.getTemplateList();
    },
    pageNow: function() {
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
