<template>
   <el-select
      v-model="submitData[currentField.key]"    
      :placeholder="currentField.placeholder"
      >
      <el-option
        v-for='(item,index) in currentField.options'
        :key="index"
        :value="item.value"
        :label="item.label"></el-option>
    </el-select>
</template>

<script>
export default {
   props: {
        currentField: {
            type: Object,
            required: true
        },
        submitData: {
            type: Object
        }
    }, 
    data() {
        return {
        };
    },
    created() {
        console.log(this.currentField);
    }
};
</script>

<style lang="scss" scoped>

</style>
