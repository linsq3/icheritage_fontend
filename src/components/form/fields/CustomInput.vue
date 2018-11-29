<template>
   <el-input 
      v-model="submitData[currentField.key]"  :placeholder="currentField.placeholder"></el-input>
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
    } 
}
</script>
<style lang="scss" scoped>

</style>

