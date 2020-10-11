<template>
  <div>
    <!-- 题面管理 -->
    <Row>
      <h2 class="problemTitleBox">{{ problemCode }}. &nbsp; {{ problemInfo.problemTitle }} &nbsp; / &nbsp; {{ currentProblemDescription.title }}</h2>
      <Dropdown class="problemDescriptionButton" style="width: 150px" @on-click="handleProblemDescriptionSwitch">
        <Button type="primary" style="width: 150px" ghost>
          题面切换
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem v-for="item in problemInfo.descriptionList" :name="item.id" :key="item.id">
            <div class="problemDescriptionBox">
              <div class="problemDescriptionBoxTitle">{{ item.title }}</div>
              <div class="problemDescriptionBoxDelete" v-if="item.id === problemInfo.defaultDescriptionId">
                <Icon type="ios-checkmark" />
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown class="problemDescriptionButton" style="width: 70px" @on-click="handleProblemDescriptionSwitch">
        <Button type="error" style="width: 70px" ghost>
          操作
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list" style="width: 70px">
          <DropdownItem style="width: 70px" name="problemDescriptionSave">保存</DropdownItem>
          <DropdownItem style="width: 70px" name="problemDescriptionCreate">创建</DropdownItem>
          <DropdownItem style="width: 70px" name="problemDescriptionDelete">删除</DropdownItem>                
        </DropdownMenu>
      </Dropdown>
    </Row>
    <Row class="problemDatileMarkdown">
      <Col span="12" class="problemDatileMarkdownBox">
        <Input v-model="currentProblemDescription.markdownDescription" type="textarea" :autosize="{minRows: 40,maxRows: 60}" />
      </Col>
      <Col span="12" class="problemDatileMarkdownBox">
        <markdown-it-vue-light :content="currentProblemDescription.markdownDescription" />
      </Col>
    </Row>
    <!-- 题面管理 -->

    <!-- 保存题面模态框 -->
    <Modal
        v-model="problemDescriptionSaveModal"
        title="保存当前题面"
        @on-ok="problemDescriptionModalSave">
        <Form ref="problemDescriptionSaveModal" :model="currentProblemDescriptionForm" :rules="currentProblemDescriptionFormRule" :label-width="80">
          <FormItem label="题面名称" prop="title">
            <Input v-model="currentProblemDescriptionForm.title" :placeholder="currentProblemDescriptionForm.title"></Input>
          </FormItem>
          <FormItem label="默认题面">
            <RadioGroup v-model="currentProblemDescriptionForm.isDefault">
              <Radio :label='1'>是</Radio>
              <Radio :label='0'>否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否公开">
            <RadioGroup v-model="currentProblemDescriptionForm.isPublic">
              <Radio :label='1'>是</Radio>
              <Radio :label='0'>否</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
    </Modal>
    <!-- 保存题面模态框 -->

    <!-- 创建题面模态框 -->
    <Modal
        v-model="problemDescriptionCreateModal"
        title="创建新题面"
        @on-ok="problemDescriptionModalCreate">
        <Form ref="problemDescriptionCreateModal" :model="currentProblemDescriptionForm" :rules="currentProblemDescriptionFormRule" :label-width="80">
          <FormItem label="题面名称" prop="title">
            <Input v-model="currentProblemDescriptionForm.title" :placeholder="currentProblemDescriptionForm.title"></Input>
          </FormItem>
          <FormItem label="是否公开">
            <RadioGroup v-model="currentProblemDescriptionForm.isPublic">
              <Radio :label='1'>是</Radio>
              <Radio :label='0'>否</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
    </Modal>
    <!-- 创建题面模态框 -->

    <!-- 删除题面模态框 -->
    <Modal
        v-model="problemDescriptionDeleteModal"
        title="删除当前题面"
        @on-ok="problemDescriptionModalDelete">
        <Form :model="currentProblemDescriptionForm" :label-width="80">
          <FormItem label="题面名称" prop="title">
            <Input v-model="currentProblemDescriptionForm.title" :placeholder="currentProblemDescriptionForm.title" disabled></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>

</template>

<script>
import api from '@/utils/api'
import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'

export default {
  components: {
    MarkdownItVueLight
  },
  data () {
    return {
      problemDescriptionSaveModal: false,
      problemDescriptionCreateModal: false,
      problemDescriptionDeleteModal: false,
      currentProblemDescription: {
        id: '',
        title: '',
        markdownDescription: '',
        isPublic: 0
      },
      currentProblemDescriptionForm: {
        id: '',
        title: '',
        isDefault: 1,
        isPublic: 1
      },
      problemInfo: {
        problemTitle: '',
        defaultDescriptionId: '2',
        descriptionList: [
          {
            id: '1',
            title: '中文题面中文题面中文题面',
            isPublic: 1
          },
          {
            id: '2',
            title: '英文题面',
            isPublic: 1
          }
        ]
      },
      currentProblemDescriptionFormRule: {
        title: [
          { required: true, message: '题面名称不能为空', trigger: 'blur' },
          { type: 'string', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 题面保存按钮 - 弹出模态框
    problemDescriptionSaveButton: function () {
      this.problemDescriptionSaveModal = true;
      this.currentProblemDescriptionForm.id = this.currentProblemDescription.id;
      this.currentProblemDescriptionForm.title = this.currentProblemDescription.title;
      this.currentProblemDescriptionForm.isDefault = this.currentProblemDescription.id === this.problemInfo.defaultDescriptionId ? 1 : 0;
      this.currentProblemDescriptionForm.isPublic = this.currentProblemDescription.isPublic;
    },
    // 创建新题面按钮 - 弹出模态框
    problemDescriptionCreateButton: function () {
      this.problemDescriptionCreateModal = true;
      this.currentProblemDescriptionForm.id = 1000;
      this.currentProblemDescriptionForm.title = '新建题面';
      this.currentProblemDescriptionForm.isDefault = 0;
      this.currentProblemDescriptionForm.isPublic = 1;
    },
    // 删除题面按钮 - 弹出模态框
    problemDescriptionDeleteButton: function () {
      this.problemDescriptionDeleteModal = true;
      this.currentProblemDescriptionForm.id = this.currentProblemDescription.id;
      this.currentProblemDescriptionForm.title = this.currentProblemDescription.title;
    },
    // 题面切换下拉框的切换按钮
    handleProblemDescriptionSwitch: function (id) {
      if (id === 'problemDescriptionSave') this.problemDescriptionSaveButton();
      else if (id === 'problemDescriptionCreate') this.problemDescriptionCreateButton();
      else if (id === 'problemDescriptionDelete') this.problemDescriptionDeleteButton();
      else {
        this.currentProblemDescription.id = id;
        this.getDescription();
      }
    },
    // 保存题面 - 模态框内
    // 更改默认题面
    defaultDescriptionIdSave: function () {
      var data = {
        problemCode: this.problemCode,
        defaultDescriptionId: this.problemInfo.defaultDescriptionId
      }
      if (this.currentProblemDescriptionForm.isDefault === 1) {
        data.defaultDescriptionId = this.currentProblemDescriptionForm.id;
      }
      api.updateProblemInfo(data).then(_ => {
        this.problemDescriptionInfoSave();
      }, _ => {
        this.$Message.error('保存失败');
      });
    },
    // 更改题面信息
    problemDescriptionInfoSave: function () {
      var data = {
        id: this.currentProblemDescriptionForm.id,
        isPublic: this.currentProblemDescriptionForm.isPublic,
        title: this.currentProblemDescriptionForm.title,
        markdownDescription: this.currentProblemDescription.markdownDescription
      }
      api.updateDescription(data).then(_ => {
        this.updateProblemDescription();
        this.$Message.success('保存成功');
      }, _ => (this.$Message.error('保存失败')));
    },
    // 模态框内的按钮
    problemDescriptionModalSave: function () {
      this.$refs.problemDescriptionSaveModal.validate(valid => {
        if (valid) {
          this.defaultDescriptionIdSave();
        } else {
          this.$Message.error('格式不符');
        }
      })
    },
    // 创建新题面 - 模态框内
    problemDescriptionModalCreate: function () {
      this.$refs.problemDescriptionCreateModal.validate(valid => {
        if (valid) {
          var data = {
            problemCode: this.problemCode,
            title: this.currentProblemDescriptionForm.title,
            markdownDescription: '### 公式示例 \n `$x_1$`',
            isPublic: this.currentProblemDescriptionForm.isPublic
          }
          api.createDescription(data).then(_ => {
            this.updateProblemDescription();
            this.$Message.success('创建成功');
          }, _ => (this.$Message.error('创建失败')));
        } else {
          this.$Message.error('格式不符');
        }
      })
    },
    // 删除题面 - 模态框内
    problemDescriptionModalDelete: function () {

    },
    // 获取题目信息
    getProblem: function (flag) {
      api.getProblem({
        problemCode: this.problemCode
      }).then(ret => {
        this.problemInfo.problemTitle = ret.problemTitle;
        this.problemInfo.defaultDescriptionId = ret.defaultDescriptionId;
        if (flag === 0) {
          // 第一次更新题目信息，因此将当前题面设置为默认题面
          this.currentProblemDescription.id = this.problemInfo.defaultDescriptionId;
          this.getDescription();
        }
      });
    },
    // 获取题面描述列表
    getDescriptionList: function () {
      api.getProblemDescriptionList({
        problemCode: this.problemCode
      }).then(ret => {
        this.problemInfo.descriptionList = ret;
        if (this.problemInfo.descriptionList === null) {
          this.problemInfo.descriptionList = [];
        }
      })
    },
    // 获取具体题面描述
    getDescription: function () {
      api.getProblemDescription({
        descriptionId: this.currentProblemDescription.id
      }).then(ret => {
        this.currentProblemDescription = ret;
        if (this.currentProblemDescription === null) {
          this.currentProblemDescription = {
            id: '',
            title: '',
            isPublic: 0
          }
        }
      })
    },
    // 更新页面数据
    updateProblemDescription: function () {
      this.getProblem();
      this.getDescriptionList();
      this.getDescription();
    }
  },
  computed: {
    problemCode: function () {
      return this.$route.params.problemCode;
    }
  },
  mounted: function () {
    this.getProblem(0);
    this.getDescriptionList();
  }
}
</script>

<style lang="less" scoped>
.problemTitleBox {
  float: left;
  padding-left: 10px;
}

.problemDescriptionButton {
  float: right;
  margin-right: 10px;
}

.problemDatileMarkdown {
  margin-top: 10px;
  .problemDatileMarkdownBox {
    padding: 10px;
    /deep/ .ivu-input:hover {
      border-color: #dcdee2;
    }
    /deep/ .ivu-input:focus {
      border-color: #dcdee2;
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }
}

.problemDescriptionBox {
  position: relative;
  .problemDescriptionBoxTitle {
    display: inline-block;
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .problemDescriptionBoxDelete {
    top: 1.5px;
    position: absolute;
    right: 0px;
    float: right;
  }
}

.dropDownItemBox {
  height: 50px;
}
</style>
