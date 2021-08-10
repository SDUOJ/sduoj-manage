<template>
  <div>
    <Modal v-model="visible"
           title="Edit announcement">
      <Table :columns="contestColumns"
             :data="notice" >
        <template slot="action" >
          <a href="#">Edit Content</a>
          <divider type="vertical" />
          <a href="#">First</a>
        </template>
        <template slot-scope="{ row }" slot="id">
          <span>{{ row.id }}</span>
        </template>
        <template slot-scope="{ row }" slot="title">
          <span>{{ row.title }}</span>
        </template>
      </Table>

      <div class="footer-tools">
        <Page
          class="float-right"
          size="small" show-elevator show-sizer
          :total="total"
          :current.sync="PageNow"
          :page-size="PageSize"
          :page-size-opts="pageSizeOpts"
        />
      </div>
    </Modal>
  </div>
</template>

<script>
import api from '_u/api.js'
export default {
  data: function () {
    return {
      contestColumns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: 'Id', slot: 'id', align: 'center' },
        { title: 'Title', slot: 'title', minWidth: 150 },
        { title: '\b', slot: 'action' }
      ],

      visible: false,

      notice: [],

      PageNow: 1,
      PageSize: 10,
      total: 0,
      pageSizeOpts: [10, 20, 30]
    }
  },
  methods: {
    getNoticeList: function () {
      api.queryNotice({
        pageSize: this.PageSize,
        pageNumber: this.PageNow
      }).then(ret => {
        this.notice = ret
        console.log(this.notice)
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  },
  mounted() {
    this.getNoticeList()
  }
}
</script>

<style scoped>

</style>
