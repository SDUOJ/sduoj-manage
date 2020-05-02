<template>
  <div>
    <div class="pro-container" :span="20">
      <!-- 筛选框与添加按钮 -->
      <div class="filter-container clear">
        <div style="float: right;">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            icon="el-icon-plus"
            @click="handleAdd()"
          >新 增</el-button>
        </div>
        <div style="float: right;">
          <el-input
            placeholder="请输入关键字搜索"
            style="width: 200px;"
            class="filter-item"
            v-model="search"
          />
        </div>
      </div>
      <!--  -->

      <!-- 题目列表 -->
      <el-table
        class="problem_list_div"
        :data="
          tableData.filter(
            data =>
              !search ||
              data.problem_title.toLowerCase().includes(search.toLowerCase())
          )
        "
        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="problem_id" label="题号" align="center" width="160"></el-table-column>
        <el-table-column label="题目" width="auto">
          <router-link
            class="link_a"
            :to="'/problem/' + scope.row.problem_id"
            slot-scope="scope"
          >{{ scope.row.problem_title }}</router-link>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <template>
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编 辑</el-button>
            </template>
            <template>
              <el-popconfirm
                confirmButtonText="是"
                cancelButtonText="否"
                confirmButtonType="danger"
                icon="el-icon-info"
                iconColor="red"
                :title="'删除' + scope.row.problem_id + '?'"
                style="margin-left: 10px;"
                @onConfirm="handleDelete(scope.$index, scope.row)"
              >
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination_div">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="this.page_size"
          :page-count="this.page_count"
          :hide-on-single-page="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page_now: 1,
      page_size: 50,
      page_count: 1,
      tableData: [],
      search: ""
    };
  },
  methods: {
    fetchProblemList() {
      // 找后端要题目列表
      this.tableData.push({
        problem_id: 1001,
        problem_title: "A+B Problem"
      });
      console.log("fetchProblemList");
    },
    handleAdd() {
      this.$router.push("/problem/add");
    },
    handleEdit(index, row) {
      this.$router.push("/problem/" + row.problem_id);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  },
  mounted() {
    this.fetchProblemList();
  }
};
</script>

<style scoped>
.problem_list_div {
  padding: 11px;
  background-color: white;
  margin-top: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.pro-container {
  padding: 15px 32px;
  margin: 4px 2px;
}
.filter-container {
  margin-top: 15px;
}
.fenye {
  margin-top: 10px;
}
</style>
