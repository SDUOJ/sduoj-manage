<template>
    <Tabs value="problemDetailMarkdown">
        <!-- 题面管理 -->
        <TabPane label="题面管理" icon="ios-book-outline" name="problemDetailMarkdown">
          <Row>
            <h2 class="problemTitleBox">{{ problemInfo.problemCode }}. &nbsp; {{ problemInfo.problemTitle }} &nbsp; / &nbsp; {{ currentProblemDescription.title }}</h2>
            <Dropdown class="problemDescriptionButton" style="width: 150px" @on-click="handleProblemDescriptionSwitch">
              <Button type="primary" style="width: 150px" ghost>
                题面切换
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem v-for="item in problemInfo.problemDescriptionDTO" :name="item.id" :key="item.id">
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
              <Input v-model="currentProblemDescription.content" type="textarea" :autosize="{minRows: 40,maxRows: 60}" />
            </Col>
            <Col span="12" class="problemDatileMarkdownBox">
              <markdown-it-vue-light :content="currentProblemDescription.content" />
            </Col>
          </Row>
        </TabPane>
        <!-- 题面管理 -->

        <!-- 保存题面模态框 -->
        <Modal
            v-model="problemDescriptionSaveModal"
            title="保存当前题面"
            @on-ok="problemDescriptionModalSave">
            <Form :model="currentProblemDescriptionForm" :rules="currentProblemDescriptionFormRule" :label-width="80">
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
            <Form :model="currentProblemDescriptionForm" :rules="currentProblemDescriptionFormRule" :label-width="80">
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
        <!-- 删除题面模态框 -->

        <!-- 数据管理 -->
        <TabPane label="数据管理" icon="ios-build-outline" name="problemDetailData">
          <CheckpointList :problemCode="problemInfo.problemCode" />
        </TabPane>
        <!-- 数据管理 -->
    </Tabs>
</template>

<script>
import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'

import CheckpointList from '_c/checkpoints/CheckpointList';

export default {
  components: {
    MarkdownItVueLight,
    CheckpointList
  },
  data () {
    return {
      problemDescriptionSaveModal: false,
      problemDescriptionCreateModal: false,
      problemDescriptionDeleteModal: false,
      currentProblemDescription: {
        id: '1',
        title: '中文题面',
        content: 'Chinese Version',
        isPublic: 1
      },
      currentProblemDescriptionForm: {
        id: '',
        title: '',
        isDefault: 0,
        isPublic: 0
      },
      problemInfo: {
        problemCode: 'POJ-1001',
        problemTitle: 'A + B Problem',
        timeLimit: '1000',
        spaceLimit: '1024',
        acceptNum: '530',
        submitNum: '2030',
        problemSource: '北京大学在线评测系统',
        problemTags: ['线段树', '动态规划'],
        languages: ['c++11', 'c++14', 'python2', 'java8'],
        defaultDescriptionId: '2',
        problemDescriptionDTO: [
          {
            id: '1',
            title: '中文题面中文题面中文题面',
            content: 'Chinese Version',
            isPublic: 1
          },
          {
            id: '2',
            title: '英文题面',
            content: 'English Version',
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
        for (let i = 0; i < this.problemInfo.problemDescriptionDTO.length; i++) {
          var item = this.problemInfo.problemDescriptionDTO[i];
          if (item.id === id) {
            this.currentProblemDescription = item;
            break;
          }
        }
      }
    },
    // 保存题面 - 模态框内
    problemDescriptionModalSave: function () {

    },
    // 创建新题面 - 模态框内
    problemDescriptionModalCreate: function () {
      // var item = this.currentProblemDescription;
      // item.id = String(this.problemInfo.problemDescriptionDTO.length + 1);
      // item.title = '空题面';
      // item.content = '### 公式示例 \n `$x_1$`';
      // item.isPublic = 0;
      // this.problemInfo.problemDescriptionDTO.push(item);
    },
    // 删除题面 - 模态框内
    problemDescriptionModalDelete: function () {

    }
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
