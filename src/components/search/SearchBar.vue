<template>
<div v-if="searchData.fields && searchData.fields.length">
    <form-list :submitData="searchData.submitData" :fields="searchData.fields">
        <el-form-item>
            <el-button @click="$emit('onSearch')" :type="searchData.searchButton.type">{{searchData.searchButton.name}}</el-button>
        </el-form-item>
    </form-list>
</div>
</template>

<script>
export default {
  props: {
    searchData: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
