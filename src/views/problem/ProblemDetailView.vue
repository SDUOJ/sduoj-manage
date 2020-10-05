<template>
    <Tabs value="problemDetailMarkdown">
        <!-- 题面管理 -->
        <TabPane label="题面管理" icon="ios-book-outline" name="problemDetailMarkdown">
          <h2 style="text-align: center;">{{ problemInfo.problemCode }}. &nbsp; {{ problemInfo.problemTitle }}</h2>
          <Row>
            <Col span="12" class="problemDatileMarkdownBox">
              <Input v-model="content" type="textarea" :autosize="{minRows: 40,maxRows: 60}" />
            </Col>
            <Col span="12" class="problemDatileMarkdownBox">
              <markdown-it-vue-light class="md-body" :content="content" />
            </Col>
          </Row>
        </TabPane>
        <!-- 题面管理 -->

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
      content: '# your markdown content',
      problemInfo: {
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
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
