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
            <el-form-item label="主题" prop="title">
               <el-input placeholder="请输入主题" v-model="createForm.title"></el-input>
            </el-form-item>
             <el-form-item label="链接地址" prop="link">
                <el-input placeholder="请输入链接地址" v-model="createForm.link"></el-input>
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
import { getStartPage, newStartPage, editStartPage, shelveStartPage, offshelveStartPage }  from "apis/";
import {baseURL,basePath} from '@/config/'
import util from '@/helper/util'
export default {
  data() {
    return {
      dialogVisible: false,
      title: null,
      createForm: {
        menuName: null,
        menuClass: null,
        logo: null
      },
      tableData: [],
      operatorId: null,
      rules: {
        title: [
          {
            required: true,
            message: "请输入主题",
            trigger: ["change", "blur"]
          }
        ]
      },
      columns: [
        {
          prop: "title",
          label: "主题"
        },
        {
          prop: "link",
          label: "链接"
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
          prop: "createby",
          label: "创建人"
        },
        {
          prop: "status",
          label: "状态",
          render: (record, index, h) => {
            return (
              <div>
                {record.status ? '显示中' : '下架'}
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
                    <el-dropdown-item command="2">查看图片</el-dropdown-item>
                    <el-dropdown-item command="3">{record.status ? '下架' : '上架'}</el-dropdown-item>
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
      getStartPage(params).then(res => {
        this.tableData = res.data.startpagelists;
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
            this.title = '编辑菜单';
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.createForm = {
                    title: record.title,
                    link: record.link
                }
            })
        } else if (command == 2) {
            // 查看图片
            this.$router.push({name: 'startPageImg',query: {id: record.id, title: record.title}});
        } else if (command == 3) {
            // 上下架
            if(record.status) {
                this.handleOffshelve();
            }else {
                this.handleShelve();
            }
        } 
    },
    handleShelve() {
        const params = {
            id: this.operatorId
        }
        shelveStartPage(params).then(res => {
            this.$message({
              type: "success",
              message: "上架成功"
            });
            this.getList();
        })
    },
    handleOffshelve() {
        const params = {
            id: this.operatorId
        }
        offshelveStartPage(params).then(res => {
            this.$message({
              type: "success",
              message: "下架成功"
            });
            this.getList();
        })
    },
    handleSubmit() {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          const params = {
            ...this.createForm,
            pageid: this.operatorId
          };
          if(this.operatorId) {
            editStartPage(params).then(res => {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.getList();
            });
          } else {
            newStartPage(params).then(res => {
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
      this.title = '添加启动页';
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

