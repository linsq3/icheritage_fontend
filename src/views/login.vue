<template>
<div>
    <div class="login-form">
        <el-form  :model="form" :rules="rules" ref="form" class="login-container">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="userName">
                <el-input type="text" v-model="form.userName" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="form.password" @keyup.enter.native="handleLogin" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  type="primary" class="_submit" @click="handleLogin">登录</el-button>
            </el-form-item>
          </el-form>  
    </div>
</div>
</template>

<script>
import { login } from "apis/";
import storage from "@/helper/storage";

export default {
  data() {
    return {
      form: {
        userName: null,
        password: null
      },

      rules: {
        userName: [
          {
            required: true,
            message: "请输入账号",
            trigger: ["change", "blur"]
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  created() {
    window.localStorage.clear();
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form
          };
          if (valid) {
            login(params).then(res => {
              storage.setItem('user',res.data.user);
              this.$router.push({name: 'main'})
            })
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  border-radius: 5px;
  background-clip: padding-box;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.title {
  margin: 0 auto 40px;
  text-align: center;
  color: #505458;
}

.login-form {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

._submit {
  width: 100%;
  border: none;
}

.captcha-img {
  height: 40px;
  margin-left: 19%;
  cursor: pointer;
}

.login-button {
  width: 100%;
}
</style>
