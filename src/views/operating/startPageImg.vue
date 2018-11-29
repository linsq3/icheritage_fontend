<!-- 用户管理 -->
<template>
<el-row class="u-padding-top-xs">
    <el-row>
        <el-form inline>
             <el-form-item>
               <div>主题：{{$route.query.title}}</div>
            </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleNew">添加图片</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row>
        <table-list align="center" :tableData="tableData"  :columns="columns" ></table-list>
    </el-row>
    <!-- 弹出框 -->
   <el-dialog @closed="handleClose('form')" :title="title" width="620px" :visible.sync="dialogVisible">
        <el-form ref="form" :rules="rules" :model="createForm" label-width="80px">
            <el-form-item label="图片" prop="imageUrl">
                <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess">
                    <img v-if="createForm.imageUrl" :src="createForm.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
             <el-form-item label="尺寸" prop="value">
                <el-select v-model="createForm.value" placeholder="请选择类型">
                  <el-option :key="1" label="尺寸（16:9）" value="16:9"></el-option>
                  <el-option :key="2" label="尺寸（9:18）" value="9:18"></el-option>
                  <el-option :key="3" label="尺寸（621:1344）" value="621:1344"></el-option>
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
import { getStartImg, newStartImg, editStartImg, delStartImg }  from "apis/";
import {baseURL,basePath,uploadPath} from '@/config/'
import util from '@/helper/util'
export default {
  computed:{
    uploadUrl() {
      return  uploadPath + '/admin/startpage/upload'
    }
  },
  data() {
    return {
      dialogVisible: false,
      title: null,
      createForm: {
        imageUrl: null,
        value: null,
        imgWidth: 0,
        imgHeight: 0
      },
      tableData: [],
      operatorId: null,
      rules: {
        imageUrl: [
          {
            required: true,
            message: "请选择图片",
            trigger: ["change", "blur"]
          }
        ],
        value: [
          {
            required: true,
            message: "请选择类型",
            trigger: ["change", "blur"]
          }
        ]
      },
      columns: [
        {
          prop: "url",
          label: "预览图",
          width: '300px',
          render: (record, index, h) => {
            return (
              <div>
               <img class="start-img" src={record.url} />
              </div>
            );
          }
        },
        {
          prop: "type",
          label: "类型"
        },
        {
          prop: "operator",
          label: "操作",
          render: (record, index, h) => {
            return (
              <div>
                <el-button onClick={() => this.handleEdit(record)}  type="info">编辑</el-button>
                <el-button onClick={() => this.handleDel(record)} type="danger">删除</el-button>
              </div>
            );
          }
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleAvatarSuccess(res, file) {
        this.createForm.imageUrl = baseURL + res.data.url;
        this.createForm.imgWidth = res.data.imgWidth;
        this.createForm.imgHeight = res.data.imgHeight;
    },
    getList() {
      const params = {
        pageid: this.$route.query.id
      };
      getStartImg(params).then(res => {
        this.tableData = res.data.startpageimgs;
      });
    },
    handleDel(record) {
        const params = {
            id: record.id
        }
        delStartImg(params).then(res => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getList();
        })
    },
    handleEdit(record) {
      this.dialogVisible = true;
      this.operatorId = record.id;
      this.title = '编辑图片';
      this.$nextTick(() => {
        this.createForm = {
          imageUrl: record.url,
          value: record.type,
          imgWidth: record.width,
          imgHeight: record.height
        }
      })
    },
    handleSubmit() {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          if(this.operatorId) {
            const params = {
              ...this.createForm,
              id: this.operatorId
            };
            editStartImg(params).then(res => {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.getList();
            });
          } else {
            const params = {
              ...this.createForm,
              id: this.$route.query.id
            };
            newStartImg(params).then(res => {
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
      this.title = '添加图片';
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
.start-img {
  width: 100%;
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
</style>

