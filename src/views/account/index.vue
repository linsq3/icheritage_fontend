<!-- 用户管理 -->
<template>
<el-row class="u-padding-top-xs">
    <el-row>
        <el-form inline>
            <el-form-item>
                <el-input placeholder="用户名" v-model="username"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch" >查询</el-button>
            </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleNew">添加</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row>
        <table-list align="center" :tableData="tableData"  :columns="columns" :pagination="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" ></table-list>
    </el-row>
    <!-- 弹出框 -->
    <el-dialog @closed="handleClose('form')" title="新建账户" width="420px" :visible.sync="dialogVisible">
        <el-form ref="form" :rules="rules" :model="createForm" label-width="80px">
            <el-form-item label="登录名" prop="user_username">
               <el-input v-model="createForm.user_username"></el-input>
            </el-form-item>
             <el-form-item label="密码" prop="user_password">
               <el-input  type="password" v-model="createForm.user_password"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="user_truename">
               <el-input   v-model="createForm.user_truename"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="user_email">
               <el-input   v-model="createForm.user_email"></el-input>
            </el-form-item>
        </el-form>
         <div slot="footer" class="text-center">
            <el-button  @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog @closed="handleClose('editForm')" title="修改信息" width="420px" :visible.sync="editDialogVisible">
        <el-form ref="editForm" :rules="editFormRules" :model="editForm" label-width="80px">
            <el-form-item label="邮箱" prop="user_email">
               <el-input v-model="editForm.user_email"></el-input>
            </el-form-item>
             <el-form-item label="真实姓名" prop="user_truename">
               <el-input   v-model="editForm.user_truename"></el-input>
            </el-form-item>
        </el-form>
         <div slot="footer" class="text-center">
            <el-button  @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog @closed="handleClose('passwordForm')" title="修改密码" width="420px" :visible.sync="passwodDialogVisible">
        <el-form ref="passwordForm" :rules="passwordRules" :model="passwordForm" label-width="80px">
            <el-form-item label="原密码" prop="oldpassword">
               <el-input  type="password" v-model="passwordForm.oldpassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpassword">
               <el-input type="password" v-model="passwordForm.newpassword"></el-input>
            </el-form-item>
        </el-form>
         <div slot="footer"> 
            <el-button @click="passwodDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="handlePSubmit">确定</el-button>
        </div>
    </el-dialog>
</el-row>
</template>

<script>
import {
  getAccount,
  editAccount,
  unlockAccount,
  lockAccount,
  changePassword,
  newAccount,
  resetPwd
} from "apis/";
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      let regex = new RegExp(
        "^(?![A-Za-z]+$)(?![A-Z\\d]+$)(?![A-Z\\W]+$)(?![a-z\\d]+$)(?![a-z\\W]+$)(?![\\d\\W]+$)\\S+$"
      );
      if (!regex.test(value)) {
        callback(new Error("密码必须包含大小写，数字，特殊字符当中的三种"));
      } else {
        callback();
      }
    };
    let validateLength = (rule, value, callback) => {
      let l = value.length;
      let blen = 0;
      for (let i = 0; i < l; i++) {
        if ((value.charCodeAt(i) & 0xff00) != 0) {
          blen++;
        }
        blen++;
      }
      if (blen > 8) {
        callback(new Error("用户名不超过8个字符"));
      } else {
        callback();
      }
    };
    return {
      username: null,
      dialogVisible: false,
      passwodDialogVisible: false,
      editDialogVisible: false,
      createForm: {
        user_username: null,
        user_truename: null,
        user_email: null,
        user_password: null
      },
      passwordForm: {
        oldpassword: null,
        newpassword: null
      },
      editForm: {
        user_email: null,
        user_truename: null  
      },
      options: [],
      tableData: [],
      operatorId: null,
      passwordRules: {
        oldpassword: [
            {
                required: true,
                message: "请输入密码",
                trigger: ["change", "blur"]
            },
            {
                min: 5,
                message: "密码至少5位",
                trigger: ["change", "blur"]
            },
            {
                validator: validatePass
            }
        ],
        newpassword: [
            {
                required: true,
                message: "请输入密码",
                trigger: ["change", "blur"]
            },
            {
                min: 5,
                message: "密码至少5位",
                trigger: ["change", "blur"]
            },
            {
                validator: validatePass
            }
        ]
      },
      editFormRules: {
        user_truename: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: ["change", "blur"]
          }
        ]
      },
      rules: {
        user_username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"]
          },
          {
            validator: validateLength
          },
          {
            pattern: /^[\S]*$/,
            message: "用户名中不能包含空格"
          }
        ],
        user_password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"]
          },
          {
            min: 5,
            message: "密码至少5位",
            trigger: ["change", "blur"]
          },
          {
            validator: validatePass
          }
        ],
        user_truename: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: ["change", "blur"]
          }
        ]
      },
      columns: [
        {
          prop: "username",
          label: "用户名"
        },
        {
          prop: "truename",
          label: "姓名"
        },
        {
          prop: "email",
          label: "邮箱"
        },
        {
          prop: "isActive",
          label: "状态",
          render: (record, index, h) => {
            return <div>{record.isActive ? "可用" : "锁定"}</div>;
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
                    <el-dropdown-item command="1">修改信息</el-dropdown-item>
                    <el-dropdown-item command="2">修改密码</el-dropdown-item>
                    <el-dropdown-item command="3">{record.isActive ? '锁定' : '解锁'}</el-dropdown-item>
                    <el-dropdown-item command="4">重置密码</el-dropdown-item>
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
        username: this.username,
        page: this.pagination.current_page,
        pageSize: this.pagination.page_size
      };
      getAccount(params).then(res => {
        this.tableData = res.data.userlists;
        this.pagination.total = res.data.total;
      });
    },
    handleSearch() {
        this.pagination.current_page = 1;
        this.getList();
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
            // 修改信息
            this.editDialogVisible = true;
        } else if (command == 2) {
            // 修改密码
            this.passwodDialogVisible = true;
        } else if (command == 3) {
            // 锁定解锁
            if(record.isActive) {
                this.handleLock();
            }else {
                this.handleUnlock();
            }

        } else if (command == 4) {
            // 重置密码
            this.resetPassword();
        }
    },
    resetPassword() {
        const params = {
            id: this.operatorId
        }
        resetPwd(params).then(res => {
            this.$message({
              type: "success",
              message: "重置成功"
            });
            this.getList();
        })
    },
    handleLock() {
        const params = {
            id: this.operatorId
        }
        lockAccount(params).then(res => {
            this.$message({
              type: "success",
              message: "锁定成功"
            });
            this.getList();
        })
    },
    handleUnlock() {
        const params = {
            id: this.operatorId
        }
        unlockAccount(params).then(res => {
            this.$message({
              type: "success",
              message: "解锁成功"
            });
            this.getList();
        })
    },
    handleSubmit() {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          const params = {
            ...this.createForm
          };
          newAccount(params).then(res => {
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.getList();
          });
        }
      });
    },
    handleNew() {
      this.dialogVisible = true;
    },
    handleClose(name) {
      this.$refs[name].resetFields();
    },
    handleEdit() {
        this.$refs.editForm.validate(vaild => {
            if (vaild) {
            const params = {
                ...this.editForm,
                userid: this.operatorId
            };
            editAccount(params).then(res => {
                this.editDialogVisible = false;
                this.$message({
                    type: "success",
                    message: "修改成功"
                });
                this.getList();
            });
            }
        });
    },
    handlePSubmit() {
      this.$refs.passwordForm.validate(vaild => {
        if (vaild) {
          const params = {
            ...this.passwordForm,
            userid: this.operatorId
          };
          changePassword(params).then(res => {
            this.passwodDialogVisible = false;
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.getList();
          });
        }
      });
    }
  }
};
</script>
