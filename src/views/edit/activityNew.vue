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
      <el-form-item label="地区" prop="area">
          <el-cascader
            size="large"
            :options="options"
            v-model="createForm.area">
          </el-cascader>
      </el-form-item>
      <el-form-item label="主办方" prop="sponsor">
          <el-input  placeholder="请输入主办方" v-model="createForm.sponsor"></el-input>
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
      <el-form-item label="人数上限" prop="limitNum">
          <el-input placeholder="请输入人数上限" v-model="createForm.limitNum"></el-input>
      </el-form-item>
      <el-form-item label="虚拟增量" prop="increment">
          <el-input placeholder="请输入虚拟增量" v-model="createForm.increment"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" prop="datePicker">
        <el-date-picker
          v-model="createForm.datePicker"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> 
      <el-form-item label="正文内容" prop="editorContent">
          <div ref="editor" style="text-align:left"></div>
      </el-form-item>
      <el-form-item  label="报名表" prop="signAble">
        <el-switch
          v-model="createForm.signAble">
        </el-switch>
      </el-form-item>
      <el-form-item v-if="createForm.signAble"  label="报名设置" prop="explanation">
        <el-row :gutter="0" class="activity-setting">
          <el-col :span="6">
            <el-input
              type="textarea"
              placeholder="请输入报名表说明"
              v-model="createForm.explanation">
            </el-input>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <el-row :gutter="20" class="activity-setting">
          <el-col :span="6">
            <el-input :disabled="true" value="姓名"></el-input>
          </el-col>
          <el-col :span="6">
              <el-checkbox v-model="name.enable">启用</el-checkbox>
              <el-checkbox v-model="name.require">必填</el-checkbox>
          </el-col>
        </el-row>
       <el-row :gutter="20" class="activity-setting">
          <el-col :span="6">
            <el-input :disabled="true" value="电话"></el-input>
          </el-col>
          <el-col :span="6">
              <el-checkbox v-model="phone.enable">启用</el-checkbox>
              <el-checkbox v-model="phone.require">必填</el-checkbox>
          </el-col>
        </el-row>
       <el-row :gutter="20" class="activity-setting">
          <el-col :span="6">
            <el-input :disabled="true" value="邮箱"></el-input>
          </el-col>
          <el-col :span="6">
              <el-checkbox v-model="email.enable">启用</el-checkbox>
              <el-checkbox v-model="email.require">必填</el-checkbox>
          </el-col>
        </el-row>
       <el-row :gutter="20" class="activity-setting">
          <el-col :span="6">
            <el-input :disabled="true" value="身份证"></el-input>
          </el-col>
          <el-col :span="6">
              <el-checkbox v-model="cert.enable">启用</el-checkbox>
              <el-checkbox v-model="cert.require">必填</el-checkbox>
          </el-col>
        </el-row>                
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
import { newActivity, editActivity, viewActivity, getActivityTag, getActivityDetail} from "apis/";
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
      options: regionData,
      checkList: [],
      editor: null,
      tagList: [],
      createForm: {
        datePicker: null,
        title: null,
        imageUrl: null,
        sponsor: null,
        address: null,
        lat: null,
        lng: null,
        limitNum: null,
        increment: null,
        editorContent: '',
        signAble: false,
        startTime: null,
        endTime: null,
        formJson: {},
        area: null,
        explanation: null
      },
      name: {
        enable: true,
        require: true
      },
      phone: {
        enable: true,
        require: true
      },
      email: {
        enable: false,
        require: false
      },
      cert: {
        enable: false,
        require: false
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
        limitNum: [
          {
            required: true,
            message: "请输入人数上限",
            trigger: ["change", "blur"]
          }
        ],
        datePicker: [
          {
            required: true,
            message: "请选择活动时间",
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
    if(this.$route.query.id) {
      this.getList();
    } 
    this.getTag();
  },

  methods: {
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
      const type =this.$route.query.type
      if(id) {
        const params = {
          id,
          type
        }
        getActivityDetail(params).then(res => {
          const {address, begin, end, title, logo, sponsor, lat, lng, upperlimit, increment, signable, formjson, area, explanation, tip} = res.data.activity;
          const {content,url, contenttype} = res.data.article;
          const privince = TextToCode[area.split(',')[0]].code;
          const city = TextToCode[area.split(',')[0]][area.split(',')[1]].code;
          const zone = TextToCode[area.split(',')[0]][area.split(',')[1]][area.split(',')[2]].code;
          this.createForm = {
            datePicker: [begin*1000, end*1000],
            title,
            imageUrl: logo,
            sponsor,
            address,
            lat,
            lng,
            limitNum: upperlimit,
            increment,
            editorContent: content,
            signAble: signable,
            explanation,
            area: [privince, city, zone]
          }
          
          this.editor.txt.html(content);
          if(JSON.parse(formjson)) {
            const {name, phone, email, cert} = JSON.parse(formjson).formJson;
            this.name = name;
            this.phone = phone;
            this.email = email;
            this.cert = cert;
          }
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
          const formJson = {
            formJson: {
              name: this.name,
              phone: this.phone,
              email: this.email,
              cert: this.cert
            }
          }
          let startTime = null;
          let endTime = null;
          if(this.createForm.datePicker && this.createForm.datePicker.length > 0) {
            startTime = this.createForm.datePicker[0];
            endTime = this.createForm.datePicker[1];
          }
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
            formJson: JSON.stringify(formJson),
            startTime,
            endTime,
            checkList: this.checkList.length ? JSON.stringify(checkList) : []
          };
    
          if(this.$route.query.id) {
            editActivity(params).then(res => {
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.$router.push({name: 'activity'})
            });
          } else {
            newActivity(params).then(res => {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.$router.push({name: 'activity'})
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
  .activity-setting + .activity-setting {
    margin-top: 20px;

  }
  .reset-height .el-form-item__content {
    line-height: 0;
  }
</style>

