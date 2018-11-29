<!-- 用户管理 -->
<template>
<el-row class="u-padding-top-xs">
    <el-row>
        <el-form inline>
              <el-form-item>
                <el-button type="primary" @click="handleNew">添加</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row>
        <table-list align="center" :tableData="tableData"  :columns="columns" :pagination="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" ></table-list>
    </el-row>
    <!-- 弹出框 -->
   <el-dialog @closed="handleClose('form')" :title="title" width="620px" :visible.sync="dialogVisible">
        <el-form ref="form" :rules="rules" :model="createForm" label-width="80px">
            <el-form-item label="热搜词" prop="words">
               <el-input placeholder="请输入热搜词" v-model="createForm.words"></el-input>
            </el-form-item>
        </el-form>
         <div slot="footer" class="text-center">
            <el-button  @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
    </el-dialog>
</el-row>
</template>

<script>
import { getSearch, newSearch, editSearch, delSearch } from "apis/";
import {baseURL,basePath} from '@/config/'
import util from '@/helper/util'
export default {
  data() {
    return {
      dialogVisible: false,
      title: null,
      createForm: {
        words: null
      },
      tableData: [],
      operatorId: null,
      rules: {
        words: [
          {
            required: true,
            message: "请输入热搜词",
            trigger: ["change", "blur"]
          }
        ]
      },
      columns: [
        {
          prop: "words",
          label: "热搜词"
        },
        {
          prop: "createat",
          label: "创建时间",
          render: (record, index, h) => {
            return (
              <div>
              {util.getTime(record.createat, 'yy-mm-dd h:m:s')}

              </div>
            );
          }
        },
        {
          prop: "operator",
          label: "操作",
          render: (record, index, h) => {
            return (
              <div>
                <el-dropdown onCommand={(command) =>this.handleCommand(command, record)}>
                  <span class="el-dropdown-link">
                    <i class="el-icon-setting el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">编辑</el-dropdown-item>
                    <el-dropdown-item command="2">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            );
          }
        }
      ],
      pagination: {
        current_page: 1,
        total: 0,
        page_size: 10,
        page_sizes: [10, 20, 50, 100],
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        prevText: "上一页",
        nextText: "下一页"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {
        page: this.pagination.current_page,
        pageSize: this.pagination.page_size
      };
      getSearch(params).then(res => {
        this.tableData = res.data.searchlist;
        this.pagination.total = res.data.total;
      });
    },
    handleSizeChange(pageSize) {
        this.pagination.page_size = pageSize;
        this.getList();
    },
    handleCurrentChange(page) {
        this.pagination.current_page = page;
        this.getList();
    },
    handleCommand(command, record) {
        this.operatorId = record.id;
        if(command == 1) {
            // 编辑
            this.title = '编辑热搜词';
            this.dialogVisible = true;
            this.$nextTick(() => {
              this.createForm = {
              words: record.words
            }
            })
        } else if (command == 2) {
            // 删除
            this.handleDel();
        } 
    },
    handleDel() {
        const params = {
            id: this.operatorId
        }
        delSearch(params).then(res => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getList();
        })
    },
    handleSubmit() {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          const params = {
            ...this.createForm,
            id: this.operatorId
          };
          if(this.operatorId) {
            editSearch(params).then(res => {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.getList();
            });
          } else {
            newSearch(params).then(res => {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.getList();
            });
          }
         
        }
      });
    },
    handleNew() {
      this.title = '添加热搜词';
      this.dialogVisible = true;
    },
    handleClose(name) {
      this.$refs[name].resetFields();
      this.operatorId = null;
    }
  }
};
</script>
<style lang="scss">
</style>

