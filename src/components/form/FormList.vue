<template>
<el-form label-width="100px" ref='form' :inline="true" >
    <el-form-item  v-for='(field,index) in fields' :key="index" :label="field.label" :prop="field.prop">
        <component  :currentField="field" :submitData="submitData" :is="componentsName[field.type] || componentsName['CustomInput']">
        </component>
    </el-form-item>
    <slot></slot>
</el-form>
</template>

<script>
import component from "./fields/";
export default {
  props: {
    fields: {
      type: Array,
      required: true
    },
    submitData: {
      type: Object
    }
  },
  data() {
    return {
     value: '111'
    };
  },
  computed: {
    componentsName() {
      return component;
    }
  },
  created() {
  },
  methods: {
   
  }
};
</script>

<style lang="scss" scoped>
</style>
