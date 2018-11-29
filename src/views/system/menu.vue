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
            <el-form-item label="菜单名称" prop="menuName">
               <el-input placeholder="请输入菜单名称" v-model="createForm.menuName"></el-input>
            </el-form-item>
             <el-form-item label="父菜单" prop="menuClass">
                <el-select v-model="createForm.menuClass" placeholder="默认"> 
                    <el-option :key="1" label="非遗go" value="非遗go"></el-option>
                    <el-option :key="2" label="活动" value="活动"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图标" prop="logo">
              <div class="avatar-uploader">
                  <div class="avatar-uploader">
                      <div class="el-upload el-upload--text">
                          <keep-alive>
                              <Cropper :uploadUrl="uploadUrl" @imageuploaded="handleAvatarSuccess" ref="imgCrop" :maxFileSize="2097152" @imageuploadedError="imageuploadedError" extensions="png,gif,jpeg,jpg" :aspectRatio="1">
                              </Cropper>
                          </keep-alive>
                          <img v-if="createForm.logo" :src="createForm.logo" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </div>
                  </div>
              </div>
              <div class="tips">请上传2M以内的JPG/JPEG/PNG/GIF图片</div>
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
import { getMenu, newMenu, editMenu, delMenu } from "apis/";
import {baseURL,basePath, uploadPath} from '@/config/'
import Cropper from '@/views/cropper'
export default {
  computed:{
    uploadUrl() {
      return  uploadPath + '/admin/menu/upload'
    }
  },
  components: {
    Cropper
  },
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
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: ["change", "blur"]
          }
        ],
        menuClass: [
          {
            required: true,
            message: "请选择父菜单",
            trigger: ["change", "blur"]
          }
        ],
        logo: [
          {
            required: true,
            message: "请上传图片",
            trigger: ["change", "blur"]
          }
        ]
      },
      columns: [
        {
          prop: "menuName",
          label: "菜单名称"
        },
        {
          prop: "menuImg",
          label: "菜单图标",
          render: (record, index, h) => {
            return (
              <div>
                <img class="menu-img" src={record.menuImg} />
              </div>
            );
          }
        },
        {
          prop: "menuType",
          label: "父菜单"
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
    handleAvatarSuccess(res, file) {
      console.log(res);
        this.createForm.logo = baseURL + res.data.url;
    },
    imageuploadedError(res) {
      this.$message({
          type: "error",
          message: res
      });
    },
    // beforeAvatarUpload(file) {
    //     const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    //     const isLt2M = file.size / 1024 / 1024 < 2;

    //     if (!isJPG) {
    //       this.$message.error('上传图片只能是JPG/JPEG/PNG/GIF格式!');
    //     }
    //     if (!isLt2M) {
    //       this.$message.error('上传图片大小不能超过 2MB!');
    //     }
    //     return isJPG && isLt2M;
    // },
    getList() {
      const params = {
        page: this.pagination.current_page,
        pageSize: this.pagination.page_size
      };
      getMenu(params).then(res => {
        this.tableData = res.data.menulist;
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
              menuName: record.menuName,
              menuClass: record.menuType,
              logo: record.menuImg
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
        delMenu(params).then(res => {
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
            editMenu(params).then(res => {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.getList();
            });
          } else {
            newMenu(params).then(res => {
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
      this.title = '添加菜单';
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
.menu-img {
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

