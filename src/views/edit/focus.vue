<!-- 用户管理 -->
<template>
<el-row class="u-padding-top-xs">
    <el-row>
        <el-form inline>
            <el-form-item>
                <el-date-picker
                    v-model="filterDate"
                    type="daterange"
                    value-format="yyyyMMdd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item> 
            <el-form-item>
                <el-select placeholder="状态" v-model="filters.status">
                    <el-option :key="2" label="所有" :value="2"></el-option>
                    <el-option :key="1" label="展示中" :value="1"></el-option>
                    <el-option :key="0" label="待展示" :value="0"></el-option>
                </el-select>
            </el-form-item>   
            <el-form-item>
                <el-input placeholder="焦点图标题" v-model="filters.newsTitle"></el-input>
            </el-form-item>  
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleNew">添加</el-button>
            </el-form-item>
            <el-form-item v-if="$route.query.name">
                <el-button type="primary" @click="goBack">{{$route.query.name}}</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row>
        <table-list align="center" :tableData="tableData"  :columns="columns" :pagination="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" ></table-list>
    </el-row>
    <!-- 弹出框 -->
   <el-dialog @closed="handleClose('form')" :title="title" width="620px" :visible.sync="dialogVisible">
        <el-form ref="form" :rules="rules" :model="createForm" label-width="80px">
            <el-form-item label="标题" prop="focusTitle">
               <el-input placeholder="请输入焦点图标题" v-model="createForm.focusTitle"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="link">
               <el-input placeholder="活动地址act://id; 非遗go地址news://id; 非遗圈地址group://id" v-model="createForm.link"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="focusImageUrl" class="focus">
              <div class="avatar-uploader">
                  <div class="avatar-uploader">
                      <div class="el-upload el-upload--text">
                          <keep-alive>
                              <Cropper :uploadUrl="uploadUrl" @imageuploaded="handleAvatarSuccess" ref="imgCrop" :maxFileSize="2097152" @imageuploadedError="imageuploadedError" extensions="png,gif,jpeg,jpg" :aspectRatio="16/9">
                              </Cropper>
                          </keep-alive>
                          <img v-if="createForm.focusImageUrl" :src="createForm.focusImageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </div>
                  </div>
              </div>
              <div class="tips">请上传2M以内的JPG/JPEG/PNG/GIF图片</div>
            </el-form-item>
        </el-form>
         <div slot="footer" class="text-center">
            <el-button   @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
    </el-dialog>
</el-row>
</template>

<script>
import { getFocus, newFocus, editFocus, delFocus, sortFocus, recoverFocus } from "apis/";
import {baseURL,basePath, uploadPath} from '@/config/'
import util from '@/helper/util'
import Cropper from '@/views/cropper'

export default {
  computed:{
    uploadUrl() {
      return  uploadPath + '/admin/focus/goUpload'
    }
  },
  components: {
    Cropper
  },
  data() {
    return {
        filterDate: '',
        filters: {
            source: this.$route.query.type ? this.$route.query.type : 0,
            newsTitle: null,
            status: null,
            startDate: null,
            endDate: null,  
        },
      dialogVisible: false,
      title: null,
      createForm: {
        focusImageUrl: null,
        focusTitle: null,
        link: null
      },
      tableData: [],
      operatorId: null,
      rules: {
        focusTitle: [
          {
            required: true,
            message: "请输入焦点图标题",
            trigger: ["change", "blur"]
          }
        ],
        link: [
          {
            required: true,
            message: "请输入链接",
            trigger: ["change", "blur"]
          }
        ],
        focusImageUrl: [
          {
            required: true,
            message: "请上传焦点图",
            trigger: ["change", "blur"]
          }
        ]
      },
      columns: [
        {
          prop: "sortId",
          label: "调序",
          render: (record, index, h) => {
            return (
              <div>
                <el-button size="small" onClick={() =>this.sort('up',record, index)} disabled={index == 0} icon="el-icon-arrow-up" circle></el-button>
                <el-button size="small" onClick={() =>this.sort('down',record, index)}  disabled={index == this.tableData.length - 1} icon="el-icon-arrow-down" circle></el-button>
              </div>
            );
          }
        },
        {
          prop: "id",
          label: "ID"
        },
        {
          prop: "title",
          label: "焦点图标题"
        },
        {
          prop: "link",
          label: "焦点图链接"
        },
        {
          prop: "createby",
          label: "创建人"
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
          prop: "status",
          label: "状态",
          render: (record, index, h) => {
            return (
              <div>
              {record.status == 1 ? '展示中' : '待展示'}
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
                    <el-dropdown-item command="2">{record.status ? '下架' : '上架'}</el-dropdown-item>
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
    goBack() {
      this.$router.push({name: 'produce', params: {activeName: this.$route.query.type}})
    },
      handleSearch() {
          this.getList();
      },
    handleAvatarSuccess(res, file) {
        this.createForm.focusImageUrl = baseURL + res.data.url;
    },
    imageuploadedError(res) {
      this.$message({
          type: "error",
          message: res
      });
    },
    getList() {
      if(this.filterDate && this.filterDate.length > 0 ) {
          this.filters.startDate = this.filterDate[0];
          this.filters.endDate = this.filterDate[1];
      } else {
          this.filters.startDate = null;
          this.filters.endDate = null;
      }  
      const params = {
        page: this.pagination.current_page,
        pageSize: this.pagination.page_size,
        ...this.filters
      };
      getFocus(params).then(res => {
        this.tableData = res.data.focuslist;
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
    sort(type, record, index) {
        let params = {}
        if(type == 'up') {
            params = {
                nowId: record.id,
                nowNumber: record.ordernumber,
                newId: this.tableData[index - 1].id,
                newNumber: this.tableData[index - 1].ordernumber
            }
        }else {
            params = {
                nowId: record.id,
                nowNumber: record.ordernumber,
                newId: this.tableData[index + 1].id,
                newNumber: this.tableData[index + 1].ordernumber
            }
        }
        
        sortFocus(params).then(res => {
            this.$message({
              type: "success",
              message: "调序成功"
            });
            this.getList();
        });
    },
    handleCommand(command, record) {
        this.operatorId = record.id;
        if(command == 1) {
            // 编辑
            this.title = '编辑焦点图';
            this.dialogVisible = true;
            this.$nextTick(() => {
              this.createForm = {
                focusImageUrl: record.imgurl,
                focusTitle: record.title,
                link: record.link
            }
            })
        } else if (command == 2) {
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
        recoverFocus(params).then(res => {
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
        delFocus(params).then(res => {
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
            id: this.operatorId
          };
          if(this.operatorId) {
            editFocus(params).then(res => {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.getList();
            });
          } else {
            newFocus(params).then(res => {
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
      this.title = '添加焦点图';
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
</style>

