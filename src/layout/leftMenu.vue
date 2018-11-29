<template>
<div class="left-menu">
    <el-menu  text-color="#303133"
      active-text-color="#409eff" :default-active="$route.name" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <template v-for="(menu,index) in menuList">
            <el-submenu :key="menu.goto" :index="''+index" v-if="menu.hasSubmenu">
                <template slot="title">
                    <i class="icon iconfont icon-rigint" :class="menu.icon"></i>
                    <span>{{menu.title}}</span>
                </template>
                <template v-for="(n,i) in menu.children">
                    <el-submenu :key="n.goto" v-if="n.hasSubmenu" :index="index+'-'+i">
                        <template slot="title"><i :class="n.icon"></i>{{n.title}}</template>
                        <el-menu-item class="item" :index="index+'-'+i+'-'+i" v-for="(t,i) in n.children" :key="i" v-on:click="handleOpen(t)"><i :class="t.icon"></i>{{t.title}}</el-menu-item>
                    </el-submenu>
                    <el-menu-item :key="n.goto" :index="n.goto" v-on:click="handleOpen(n)">
                        <i class="icon iconfont icon-rigint" :class="n.icon"></i>{{n.title}}
                    </el-menu-item>
                </template>
            </el-submenu>
            <el-menu-item :key="menu.goto" :index="menu.goto" v-if="!menu.hasSubmenu" v-on:click="handleOpen(menu)">
                <i class="icon iconfont icon-rigint" :class="menu.icon"></i>
                <span slot="title">{{menu.title}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</div>
</template>

<script>
export default {
  props: {
    menuList: {
      type: Array,
      require: true
    }
  },
  created() {},
  methods: {
    handleOpen(key) {
      this.$router.push({
        name: key.goto
      });
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss" scoped>
// .left-menu {
//   height: 100%;
//   .el-menu-item {
//     &.is-active {
//       background-color: #4786FF;
//     }
//     width: 200px;
//     font-size: 16px;
//     .icon-rigint {
//       margin-right: 15px;
//     }
//   }
// }
</style>
