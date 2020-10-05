<template>
    <Tabs value="problemDetailMarkdown">
        <!-- 题面管理 -->
        <TabPane label="题面管理" icon="ios-book-outline" name="problemDetailMarkdown">
          <Row>
            <h2 class="problemTitleBox">{{ problemInfo.problemCode }}. &nbsp; {{ problemInfo.problemTitle }} &nbsp; / &nbsp; {{ currentProblemDescription.title }}</h2>
            <Dropdown class="problemDescriptionButton" style="width: 150px" @on-click="handleProblemDescriptionSwitch">
              <Button type="primary" style="width: 150px">
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
            <Button type="error" class="problemDescriptionButton" ghost @click="problemDescriptionCreateButton">创建</Button>
            <Button type="primary" class="problemDescriptionButton" ghost @click="problemDescriptionSaveButton">保存</Button>
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
            v-model="problemDescriptionModal"
            title="题面保存"
            @on-ok="problemDescriptionModalSave">
            <Form :model="currentProblemDescriptionForm" :label-width="80">
              <FormItem label="题面名称">
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

        <!-- 数据管理 -->
        <TabPane label="数据管理" icon="ios-build-outline" name="problemDetailData">
          标签二的内容
        </TabPane>
        <!-- 数据管理 -->
    </Tabs>
</template>

<script>
import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'

export default {
  components: {
    MarkdownItVueLight
  },
  data () {
    return {
      problemDescriptionModal: false,
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
      }
    }
  },
  methods: {
    // 题面保存按钮 - 弹出模态框
    problemDescriptionSaveButton: function () {
      this.problemDescriptionModal = true;
      this.currentProblemDescriptionForm.id = this.currentProblemDescription.id;
      this.currentProblemDescriptionForm.title = this.currentProblemDescription.title;
      this.currentProblemDescriptionForm.isDefault = this.currentProblemDescription.id === this.problemInfo.defaultDescriptionId ? 1 : 0;
      this.currentProblemDescriptionForm.isPublic = this.currentProblemDescription.isPublic;
    },
    // 题面保存模态框中的确认按钮
    problemDescriptionModalSave: function () {

    },
    // 题面切换下拉框的切换按钮
    handleProblemDescriptionSwitch: function (id) {
      for (let i = 0; i < this.problemInfo.problemDescriptionDTO.length; i++) {
        var item = this.problemInfo.problemDescriptionDTO[i];
        if (item.id === id) {
          this.currentProblemDescription = item;
          break;
        }
      }
    },
    // 创建新题面按钮
    problemDescriptionCreateButton: function (id) {
      var item = this.currentProblemDescription;
      item.id = String(this.problemInfo.problemDescriptionDTO.length + 1);
      item.title = '空题面';
      item.content = '### 公式示例 \n `$x_1$`';
      item.isPublic = 0;
      this.problemInfo.problemDescriptionDTO.push(item);
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
</style>
