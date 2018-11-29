<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in menuList" :key="item.id" :label="item.menuName" :name="item.id">
            <keep-alive>
                <produce-content :item="item"></produce-content>
            </keep-alive>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import { getProduceMenu} from "apis/";
import ProduceContent from '@/views/edit/produceContent'
  export default {
    components:{
        ProduceContent
    },  
    data() {
      return {
        menuList: [],
        activeName: ''
      };
    },
    created() {
        this.getMenu();
    },
    methods: {
        getMenu() {
            getProduceMenu().then(res => {
                this.menuList = res.data.menu;
                this.activeName  = this.$route.params.activeName ? this.$route.params.activeName.toString() : res.data.menu[0].id;
            }) 
        },  
        handleClick(tab, event) {
         //   console.log(tab, event);
        }
    }
  };
</script>
