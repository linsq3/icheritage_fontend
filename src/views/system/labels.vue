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
            <el-form-item label="大类" prop="className">
               <el-input placeholder="请输入大类(口味)" v-model="createForm.className"></el-input>
            </el-form-item>
             <el-form-item label="标签名" prop="tagName">
                <el-input placeholder="请输入标签名,以英文逗号分隔(酸,甜,苦,辣,咸)" v-model="createForm.tagName"></el-input>
            </el-form-item>
            <el-form-item label="菜单" prop="menu">
                <el-select v-model="createForm.menu" placeholder="请选择"> 
                    <el-option v-for="item in menuList" :key="item.menuId" :label="item.menuName" :value="item.menuId"></el-option>
              
                </el-select>
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
import { getTag, newTag, editTag, delTag } from "apis/";
import {baseURL,basePath} from '@/config/'
export default {
  data() {
    return {
      dialogVisible: false,
      title: null,
      createForm: {
        tagName: null,
        className: null,
        menu: null
      },
      tableData: [],
      menuList: [],
      operatorId: null,
      rules: {
        className: [
          {
            required: true,
            message: "请输入大类",
            trigger: ["change", "blur"]
          }
        ],
        tagName: [
          {
            required: true,
            message: "请选择标签名",
            trigger: ["change", "blur"]
          }
        ],
        menu: [
          {
            required: true,
            message: "请输入菜单",
            trigger: ["change", "blur"]
          }
        ]
      },
      columns: [
        {
          prop: "menuName",
          label: "菜单名",
          render: (record, index, h) => {
            return (
              <div>
                {record.menuType} | {record.menuName}
              </div>
            );
          }
        },
        {
          prop: "className",
          label: "大类"
        },
        {
          prop: "tagName",
          label: "标签名"
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
      getTag(params).then(res => {
        this.tableData = res.data.taglist;
        this.menuList = res.data.menus;
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
            this.title = '编辑标签';
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.createForm = {
                    tagName: record.tagName,
                    className: record.className,
                    menu: record.menuId
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
        delTag(params).then(res => {
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
            editTag(params).then(res => {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.getList();
            });
          } else {
            newTag(params).then(res => {
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
      this.title = '添加标签';
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
.Tag-img {
    width: 100px;
}
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

