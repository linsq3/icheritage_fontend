<template>
<div v-if="search.fields && search.fields.length">
    <form-list :fields="search.fields">
        <el-form-item>
            <el-button :type="search.searchButton.type" @click='onSubmit("form-data")'>{{search.searchButton.name}}</el-button>
        </el-form-item>
    </form-list>
</div>
</template>

<script>
export default {
  props: {
    search: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
