<template>
<div class="header">
    <div class="u-logo">
        <div class="title">非遗app管理后台</div>
    </div>
    <div class="u-text-right u-name-panel">
        <el-dropdown placement="top-end" trigger="hover">
            <div class="user-name">
                {{sysUserName}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logoutEvent">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</div>
</template>

<script>
import { logout } from "apis/";
import storage from "@/helper/storage"
export default {
  data() {
    return {
      sysUserName: storage.getItem('user').userName
    };
  },
  methods: {
    logoutEvent() {
      logout().then(res => {
        storage.clear();
        this.$router.push({
          path: "/login"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  background-color: #242f42;
  color: #ffffff;
  .u-logo .title {
    height: 70px;
    line-height: 70px;
    margin: 0;
    padding-left: 35px;
    background-repeat: no-repeat;
    font-size: 18px;
  }
  .u-name-panel {
    flex: 1;
    color: #ffffff;
    margin-right: 50px;
    text-align: right;
    .user-name {
      color: #ffffff;
      line-height: 0;
    }
  }
}
</style>
