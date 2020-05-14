<template>
  <div>
    <el-page-header @back="$router.go(-1)" content="题目列表"></el-page-header>
    <!--    <div :span="20">-->
    <!-- 筛选框与添加按钮 -->
    <div class="clear">
      <div style="float: right;">
        <el-button
            type="success"
            style="margin-left: 10px;"
            icon="el-icon-plus"
            @click="handleAdd()"
        >新 增
        </el-button>
      </div>
      <div style="float: right;">
        <el-input
            placeholder="请输入关键字搜索"
            style="width: 200px;"
            v-model="search"
        />
      </div>
    </div>
    <!--  -->

    <!-- 题目列表 -->
    <el-table
        :data="
          tableData.filter(
            data =>
              !search ||
              data.problemTitle.toLowerCase().includes(search.toLowerCase()) ||
              data.problemId.toString().includes(search.toLowerCase())
          )
        "
        class="list_div"
        stripe
        fit
        highlight-current-row
    >
      <el-table-column align="center" label="题号" min-width="20%" prop="problemId"></el-table-column>
      <el-table-column label="题目" min-width="auto">
        <template slot-scope="scope">
          <router-link
              :to="'/problem/' + scope.row.problemId"
              class="link_a"
          >{{ scope.row.problemTitle }}
          </router-link>&nbsp;
          <el-tag size="mini" type="success" v-if="scope.row.isPublic">公开</el-tag>
          <el-tag size="mini" type="warning" v-else>私有</el-tag>&nbsp;
          <el-tag
              :type="scope.row.checkpointNum ? 'info' : 'warning'"
              @click="$router.push({ name: 'checkpoint', params: { pid: scope.row.problemId } })"
              size="mini"
              style="cursor: pointer;"
          >
            <span>{{ scope.row.checkpointNum + '组数据'}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建者" min-witdh="10%" prop="userId"></el-table-column>
      <el-table-column align="center" label="操作" min-width="80%">
        <template slot-scope="scope">
          <template>
            <el-button @click="handleEdit(scope.$index, scope.row)" size="mini">编 辑</el-button>
          </template>
          <template>
            <el-popconfirm
                confirmButtonText="是"
                cancelButtonText="否"
                confirmButtonType="danger"
                icon="el-icon-info"
                iconColor="red"
                :title="'删除' + scope.row.problemId + '?'"
                style="margin-left: 5px;"
                @onConfirm="handleDelete(scope.$index, scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger">删除</el-button>
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
  <!--  </div>-->
</template>

<script>
  import {post} from "@/api.js";
  import Vue from "vue";

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
      handleAdd() {
        this.$router.push("/problem/add");
      },
      handleEdit(index, row) {
        this.$router.push("/problem/" + row.problemId);
      },
      async fetchProblemList() {
        // 找后端要题目列表
        try {
          let ret = await post("/manage/problem/list", {
            pageNow: this.page_now,
            pageSize: this.page_size
          });
          this.page_count = ret.totalPage;
          this.tableData = ret.rows;
        } catch (err) {
          Vue.prototype.$error(err);
        }
      },
      async handleDelete(index, row) {
        try {
          let ret = await post("/manange/problem/delete", {problemId: row.problemId});
        } catch (err) {
          Vue.prototype.$error(err);
        }
        console.log(index, row);
      }
    },
    mounted() {
      this.fetchProblemList();
    }
  };
</script>

<style scoped>
  .list_div {
    padding: 11px;
    background-color: white;
    margin-top: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }

  .pagination_div {
    margin: 7px auto auto auto;
    text-align: center;
  }
</style>
