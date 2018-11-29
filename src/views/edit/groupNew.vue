<!-- 用户管理 -->
<template>
<el-row>
  <el-form ref="form" :rules="rules" :model="createForm" label-width="80px">
    <el-card class="box-card">
      <el-form-item label="标题" prop="title">
          <el-input  placeholder="请输入标题" v-model="createForm.title"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="imageUrl" class="focus">
        <div class="avatar-uploader">
          <div class="avatar-uploader">
              <div class="el-upload el-upload--text">
                  <keep-alive>
                      <Cropper :uploadUrl="uploadUrl" @imageuploaded="handleAvatarSuccess" ref="imgCrop" :maxFileSize="2097152" @imageuploadedError="imageuploadedError" extensions="png,gif,jpeg,jpg" :aspectRatio="16/9">
                      </Cropper>
                  </keep-alive>
                  <img v-if="createForm.imageUrl" :src="createForm.imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
          </div>
        </div>
        <div class="tips">请上传2M以内的JPG/JPEG/PNG/GIF图片</div>
      </el-form-item>
    </el-card>  
      <el-card class="box-card">
      <el-form-item label="新闻类型" prop="newsTag">
          <el-radio-group v-model="createForm.newsTag">
            <el-radio :label="0">普通新闻</el-radio>
            <el-radio :label="1">网页新闻</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="署名作者" prop="author">
          <el-input placeholder="请输入署名作者" v-model="createForm.author"></el-input>
      </el-form-item>
      <el-form-item v-show="createForm.newsTag == 0" label="正文内容" prop="editorContent">
                <div ref="editor" style="text-align:left"></div>
      </el-form-item>
      <el-form-item v-if="createForm.newsTag == 1" label="正文内容" prop="link">
          <el-input placeholder="请输入网页链接" v-model="createForm.link"></el-input>
      </el-form-item>
    </el-card>  
    <div class="sc-top-attach">
      <el-button @click="handleSubmit" type="primary">提交</el-button>
    </div>
  </el-form>
</el-row>
</template>

<script>
import E from 'wangeditor'
import { newGroup, editGroup, viewGroup} from "apis/";
import {baseURL,basePath, uploadPath} from '@/config/'
import util from '@/helper/util'
import Cropper from '@/views/cropper'

export default {
  computed:{
    uploadUrl() {
      return  uploadPath + '/admin/group/goUpload'
    }
  },
  components: {
    Cropper
  },
  data() {
    return {
      editor: null,
      createForm: {
        editorContent: null,
        title: null,
        imageUrl: null,
        author: null,
        newsTag: 0,
        link: null,
      },
      operatorId: null,
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: ["change", "blur"]
          }
        ],
        author: [
          {
            required: true,
            message: "请输入署名作者",
            trigger: ["change", "blur"]
          }
        ],
        link: [
          {
            required: true,
            message: "请输入网页链接",
            trigger: ["change", "blur"]
          }
        ],
        imageUrl: [
          {
            required: true,
            message: "请上传图片",
            trigger: ["change", "blur"]
          }
        ]
      },
    };
  },
  mounted() {
    this.editor = new E(this.$refs.editor)
    this.editor.customConfig.onchange = (html) => {
      this.createForm.editorContent = html
    }
    this.editor.customConfig.uploadImgServer = uploadPath + '/admin/produce/wangUpload';
    this.editor.customConfig.uploadFileName = 'file';
    this.editor.customConfig.zIndex = 100;
    this.editor.customConfig.uploadImgHooks = {
       customInsert: function (insertImg, result, editor) {
        let url = result.data[0].url
        insertImg(url)
      }
    }
    this.editor.create();
    this.getList();
  },

  methods: {
    getList() {
    const id = this.$route.query.id;
    if(id) {
      const params = {
        id
      }
      viewGroup(params).then(res => {
        const {title, pic1, author} = res.data.group;
        const {content,url, contenttype} = res.data.article;
        this.createForm = {
          editorContent: content,
          title,
          imageUrl: pic1,
          author,
          newsTag: contenttype,
          link: url,
        }
        this.editor.txt.html(content)
      })
    }
    },
    handleAvatarSuccess(res, file) {
        this.createForm.imageUrl = baseURL + res.data.url;
    },
    imageuploadedError(res) {
      this.$message({
          type: "error",
          message: res
      });
    },
    handleSubmit() {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          const params = {
            ...this.createForm,
            id: this.$route.query.id
          };
          if(this.$route.query.id) {
            editGroup(params).then(res => {
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.$router.push({name: 'group'})
            });
          } else {
            newGroup(params).then(res => {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.$router.push({name: 'group'})
            });
          }
         
        }
      });
    }
  }
};
</script>
<style lang="scss">
.menu-img {
    width: 100px;
}
.focus {
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
    width: 144px;
    height: 96px;
    line-height: 96px;
    text-align: center;
  }
  .avatar {
    width: 144px;
    height: 96px;
    display: block;
  }
}  
  .el-card {
    margin-top: 20px;
  }
  .sc-top-attach {
    height: 44px;
    background-color: #fff;
    z-index: 101;
    box-shadow: 1px 0 5px #848484;
    opacity: .8;
    text-align: right;
    transition: all .3s ease;
    line-height: 42px;
    padding-right: 42px;
    position: fixed;
    top: 72px;
    left: 201px;
    right: 0;
  }
</style>

