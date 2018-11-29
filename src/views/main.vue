<template>
<el-container>
    <el-header height="72px">
        <v-header ></v-header>
    </el-header>
    <el-container>
        <el-aside width="200px">
            <v-menu ref="menu" :menuList="menuList"></v-menu>
        </el-aside>
        <el-main>
          <div class="container-sub">
            <router-view></router-view>
          </div>  
        </el-main>
    </el-container>
</el-container>
</template>

<script>
import Header from "layout/header";
import LeftMenu from "layout/leftMenu";
import { menuList } from "layout/";
import storage from "@/helper/storage";
export default {
  components: {
    "v-header": Header,
    "v-menu": LeftMenu
  },

  data() {
    return {
      menuList: menuList
    };
  },
  created() {
  
  },
  methods: {

  }
};
</script>

<style lang="scss">
.el-container {
  height: 100%;
  .el-header {
    line-height: 72px;
    padding: 0;
  }
  .el-main {
    .container-sub {
      background-color: #ffffff;
      min-height: 100%;
    }
  }
  .el-aside {
    height: 100%;
    overflow-x: hidden;
    .el-menu {
      height: 100%;
      border: none;
    }
  }
}
</style>
