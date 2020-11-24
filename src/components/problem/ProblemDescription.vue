<!--
   Copyright 2020-2020 the original author or authors.

   Licensed under the General Public License, Version 3.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

        https://www.gnu.org/licenses/gpl-3.0.en.html
 -->

<template>
   <div class="clearfix">
     <Table
       disabled-hover
       :columns="descriptionColumns"
       :data="descriptions">
       <template slot-scope="{ row }" slot="title">
         <Input
           ref="titleInput"
           v-if="row.isSelected"
           v-model="row.title"
           @on-focus="row.oldTitle = row.title"
           @on-blur="updateDescriptionTitle(row)"
           @keydown.enter.native="row.isSelected = !row.isSelected"
           v-focus />
         <span v-else @click="row.isSelected = !row.isSelected" class="editable">{{ row.title }}</span>
       </template>
       <template slot-scope="{ row }" slot="public">
         <i-switch
           v-model="row.isPublic"
           :true-value="1" :false-value="0"
           @mousedown.native="onMousedown(row.id, row.isPublic)"
           :before-change="updateDescriptionVisibility" />
       </template>
       <template slot-scope="{ row }" slot="default">
         <i-switch
           true-color="#19be6b"
           :value="row.id === problem.defaultDescriptionId"
           @mousedown.native="onMousedown(row.id)"
           :before-change="updateDefaultDescription" />
       </template>
       <template slot-scope="{ row }" slot="edit">
         <span class="clickable" @click="onEditDescription(row)">Edit</span>
         <Divider type="vertical" />
         <span class="clickable" @click="onDeleteDescription(row)">Delete</span>
       </template>
     </Table>
     <div class="footer-tools">
       <Button type="primary" size="small" class="float-right footer-btn" @click="onAddDescription">Add</Button>
     </div>

     <Modal
      v-model="contentModal"
      width="80%"
      :mask-closable="false"
      :loading="true"
      :title="curDescription.title"
      @on-ok="updateDescriptionContent">
       <mavon-editor v-model="curDescription.markdownDescription" style="min-height: 600px"/>
     </Modal>
   </div>
</template>

<script>
import api from '_u/api';
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'ProblemDescription',
  components: { mavonEditor },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
      }
    }
  },
  data: function() {
    return {
      descriptionColumns: [
        { key: 'id', maxWidth: 200 },
        { title: 'Title', slot: 'title' },
        { title: 'Public', slot: 'public' },
        { title: 'Default', slot: 'default' },
        { title: 'Votes', key: 'voteNum' },
        { title: 'Owner', key: 'username' },
        { title: ' ', slot: 'edit' }
      ],
      selectedDescriptions: [],
      descriptions: [],
      curDescription: {
        id: '',
        markdownDescription: ''
      },
      problem: {},
      loading: false,
      contentModal: false
    }
  },
  methods: {
    selectionChange: function(selections) {
      this.selectedDescriptions = selections;
    },
    onAddDescription: function() {
      // 初始化描述内容为空
      const problemCode = this.problem.problemCode;
      api.createDescription({
        problemCode,
        title: this.descriptions.length === 0 ? 'Default' : `New ${this.descriptions.length}`,
        markdownDescription: ''
      }).then(async (ret) => {
        this.$Message.success('Success');
        if (this.descriptions.length === 0) {
          this.curDescription.id = ret;
          await this.updateDefaultDescription();
        }
        this.getProblemDescriptions(problemCode);
      }, err => {
        this.$Message.error(err);
      });
    },
    onDeleteDescription: function(description) {
    },
    updateDescriptionContent: function() {
      api.updateDescription({
        id: this.curDescription.id,
        markdownDescription: this.curDescription.markdownDescription
      }).then(_ => {
        this.$Message.success('Success');
        this.contentModal = false;
      }, err => {
        this.$Message.error(err);
      })
    },
    onMousedown: function(id, isPublic) {
      this.curDescription.id = id;
      if (isPublic !== undefined) {
        this.curDescription.isPublic = isPublic === 1 ? 0 : 1;
      }
    },
    updateDescriptionVisibility: function() {
      return new Promise(resolve => {
        api.updateDescription({
          id: this.curDescription.id,
          isPublic: this.curDescription.isPublic
        }).then(_ => {
          this.$Message.success('Success');
          resolve();
        }, err => {
          this.$Message.error(err.message);
        });
      })
    },
    updateDescriptionTitle: function(row) {
      row.isSelected = !row.isSelected;
      if (row.title !== row.oldTitle) {
        api.updateDescription({
          id: row.id,
          title: row.title
        }).then(_ => {
          this.$Message.success('Success');
        }, err => {
          this.$Message.error(err.message);
        });
      }
    },
    updateDefaultDescription: function() {
      return new Promise(resolve => {
        if (this.problem.defaultDescriptionId === this.curDescription.id) {
          return;
        }
        api.updateProblemInfo({
          problemCode: this.problem.problemCode,
          defaultDescriptionId: this.curDescription.id
        }).then(_ => {
          this.$Message.success('Success');
          resolve();
          this.$nextTick(() => {
            this.problem.defaultDescriptionId = this.curDescription.id;
          })
        }, err => {
          this.$Message.error(err.message);
        })
      })
    },
    onEditDescription: function(row) {
      api.getProblemDescription({
        descriptionId: row.id
      }).then(ret => {
        this.curDescription = ret;
        this.contentModal = true;
      });
    },
    getProblemDescriptions: function(problemCode) {
      this.loading = true;
      api.getProblemDescriptionList({ problemCode })
        .then(ret => {
          this.descriptions = ret.map(o => {
            return { ...o, isSelected: false }
          })
        })
        .finally(() => {
          this.loading = false;
        })
    },
    query: function(problem) {
      this.problem = problem;
      this.getProblemDescriptions(problem.problemCode);
    }
  }
}
</script>

<style lang="less" scoped>
  .editable:hover {
    cursor: pointer;
    border: #ccc 1px solid;
    border-radius: 2px;
  }
</style>
