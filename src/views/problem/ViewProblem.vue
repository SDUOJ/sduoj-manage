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
        <el-table-column prop="problemId" label="题号" align="center" width="160"></el-table-column>
        <el-table-column label="题目" width="auto">
          <router-link
            class="link_a"
            :to="'/problem/' + scope.row.problemId"
            slot-scope="scope"
          >{{ scope.row.problemTitle }}</router-link>
        </el-table-column>
        <el-table-column prop="isPublic" label="是否公开" width="50" align="center"></el-table-column>
        <el-table-column prop="userId" label="创建者" witdh="50" align="center"></el-table-column>
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
                :title="'删除' + scope.row.problemId + '?'"
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
          :hide-on-single-page="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { post } from "@/api.js";
export default {
  data() {
    return {
      page_now: 1,
      page_size: 20,
      page_count: 1,
      tableData: [],
      search: ""
    };
  },
  methods: {
    async fetchProblemList() {
      // 找后端要题目列表
      let ret = await post("/manage/problem/list", {
        pageNow: this.page_now,
        pageSize: this.page_size
      });
      this.page_count = ret.totalPage;
      this.tableData = [];
      for (var i = 0; i < ret.rows.length; ++i) {
        this.tableData.push({ ...ret.rows[i] });
      }
      console.log("fetchProblemList");
    },
    handleAdd() {
      this.$router.push("/problem/add");
    },
    handleEdit(index, row) {
      this.$router.push("/problem/" + row.problemId);
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
.pagination_div {
  margin: 7px auto auto auto;
  text-align: center;
}
</style>
