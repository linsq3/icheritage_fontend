<!-- 用户管理 -->
<template>
<el-row>
  <el-form ref="form" :rules="rules" :model="createForm" label-width="80px">
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{$route.query.name}}</span>
    </div>
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
      <el-form-item label="级别" prop="tag">
        <el-radio-group v-model="createForm.tag">
          <el-radio label="联合国">联合国</el-radio>
          <el-radio label="国家级">国家级</el-radio>
          <el-radio label="省级">省级</el-radio>
          <el-radio label="市级">市级</el-radio>
        </el-radio-group>
      </el-form-item>
        <el-form-item label="日期" prop="dateValue">
          <el-date-picker
              v-model="createForm.dateValue"
              value-format="timestamp"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="地区" prop="area">
          <el-cascader
            size="large"
            :options="options"
            v-model="createForm.area">
          </el-cascader>
      </el-form-item>
      <el-form-item label="地址" prop="address">
          <el-input  placeholder="请输入地址" v-model="createForm.address"></el-input>
      </el-form-item>
      <el-form-item label="经度" prop="lng">
          <el-input  placeholder="请输入经度" v-model="createForm.lng"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
          <el-input  placeholder="请输入纬度" v-model="createForm.lat"></el-input>
      </el-form-item>
      <el-form-item class="reset-height" v-for="item in tagList" :key="item.id" :label="item.className">
        <el-checkbox-group v-model="checkList">
           <el-checkbox v-for="(key, i) in item.tagName.split(',')" :key="i"  :label="item.className+','+key">{{key}}</el-checkbox>
        </el-checkbox-group>   
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
    <el-card>
      <el-form-item  label="相关活动" prop="activityId">
        <el-switch
          v-model="createForm.activityId">
        </el-switch>
      </el-form-item>
      <el-form-item v-if="createForm.activityId">
         <el-select
            v-model="createForm.selected"
            filterable
            multiple
            remote
            reserve-keyword
            placeholder="请输入活动标题"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in activityList"
              :key="item.id"
              :label="item.value"
              :value="item">
            </el-option>
          </el-select>
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
import { newProduce, editProduce, viewGroup, getActivityTag, getState, editInfoProduce} from "apis/";
import {baseURL,basePath, uploadPath} from '@/config/'
import util from '@/helper/util'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
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
      activityList: [],
      loading: false,
      options: regionData,
      checkList: [],
      editor: null,
      createForm: {
        tag: '联合国',
        editorContent: null,
        title: null,
        imageUrl: null,
        author: null,
        newsTag: 0,
        link: null,
        selected: []
      },
      operatorId: null,
      tagList: [],
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
         area: [
          {
            required: true,
            message: "请选择地区",
            trigger: ["change", "blur"]
          }
        ],
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: ["change", "blur"]
          }
        ],
        lng: [
          {
            required: true,
            message: "请输入经度",
            trigger: ["change", "blur"]
          }
        ],
        lat: [
          {
            required: true,
            message: "请输入纬度",
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
    this.getTag();
  },

  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        const params = {
          state: query
        }
        getState(params).then(res => {
          this.activityList = res.data.activtylist;
          this.loading = false;
        })
      } else {
        this.activityList = [];
      }
    },
    getTag() {
      const params = {
        type: this.$route.query.type
      }
       getActivityTag(params).then(res => {
         this.tagList = res.data.tags;
        })
    },
    getList() {
    const id = this.$route.query.id;
    if(id) {
      const params = {
        id
      }
      editInfoProduce(params).then(res => {
        const {address,area, pic1,lat,level,lng,tip,title, createat} = res.data.news;
        const {content,url, contenttype, author} = res.data.article;
        this.activityList = res.data.relation;
        const privince = TextToCode[area.split(',')[0]].code;
        const city = TextToCode[area.split(',')[0]][area.split(',')[1]].code;
        const zone = TextToCode[area.split(',')[0]][area.split(',')[1]][area.split(',')[2]].code;
        this.createForm = {
          editorContent: content,
          title,
          imageUrl: pic1,
          author,
          newsTag: contenttype,
          link: url,
          address,
          lat,
          lng,
          tag: level,
          activityId: this.activityList.length > 0,
          dateValue: createat*1000,
          selected: this.activityList,
          area: [privince, city, zone]
        }
        this.editor.txt.html(content);
          const tags = JSON.parse(tip);
          if(!tags) {
            return false;
          }
          for(let tag of tags) {
            let tagNameList = tag.tagName.split(',');
            for(let key in tagNameList) {
              this.checkList.push(
                tag.className + ',' + tagNameList[key]
              )
            }
          }
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
          const area = [CodeToText[this.createForm.area[0]], CodeToText[this.createForm.area[1]], CodeToText[this.createForm.area[2]]];
          let checkList = this.tagList.map(v => {
            return {className: v.className};
          });
          for(let j = 0; j < checkList.length; j++) {
            for (let i = 0; i < this.checkList.length; i++) {
              let className = this.checkList[i].split(',')[0];
              let tagName = this.checkList[i].split(',')[1];
              if(checkList[j].className === className) {
                if(checkList[j].tagName) {
                  checkList[j].tagName = `${checkList[j].tagName},${tagName}`;
                } else {
                  checkList[j].tagName = tagName;  
                }
                
              }
            }
          }
          const params = {
            ...this.createForm,
            id: this.$route.query.id,
            type: this.$route.query.type,
            area,
            dateValue: this.createForm.dateValue,
            checkList: this.checkList.length ? JSON.stringify(checkList) : []
          };
          if(this.$route.query.id) {
            editProduce(params).then(res => {
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.$router.push({name: 'produce',params: {activeName: this.$route.query.type}})
            });
          } else {
            newProduce(params).then(res => {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.$router.push({name: 'produce',params: {activeName: this.$route.query.type}})
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
    .reset-height .el-form-item__content {
    line-height: 0;
  }
</style>

