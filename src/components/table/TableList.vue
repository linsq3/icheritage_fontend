<template>
<div>
    <!-- <table-header v-if="search" :search="search"></table-header> -->
    <el-table :highlight-current-row="highlightCurrentRow" @row-click="rowClick" @row-dblclick="rowDblclick" :show-header="showHeader" @selection-change="handleSelectionChange" :span-method="spanMethod" :show-summary="showSummary" :sum-text="sumText" :summary-method="summaryMethod" :row-class-name="rowClassName" :max-height="maxHeight" :height="height" :stripe="stripe" :border="border" :default-sort="defaultSort" :data="tableData">
        <el-table-column :align="align" v-if="hasBatch" type="selection">
        </el-table-column>
        <template v-for="(item, index) in columns">
            <el-table-column :align="align" :key="index" v-if="item.type === 'index'" :type="item.type" :index="item.index"></el-table-column>
            <el-table-column :align="align" v-if="item.type !== 'index'" :type="item.type" :filters="item.filters" :filter-method="item.filterMethod || item['filter-method']" :sortable="item.sortable" :fixed="item.fixed" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                <template slot-scope="scope">
                    <my-render v-if="item.render" :index="scope.$index" :row="scope.row" :render="item.render"></my-render>
                    <span v-else>
                    {{scope.row[item.prop]}}
                </span>
                </template>
            </el-table-column>
        </template>
        <!-- todo 多级表头 -->
    </el-table>
    <div class='pagination'>
        <el-pagination v-if='pagination' :prev-text="pagination.prevText || pagination['prev-text']" :next-text="pagination.nextText || pagination['next-text']" :samll="pagination.samll" :background="pagination.background"  :page-sizes="pagination.page_sizes" :page-size="pagination.page_size" :layout="pagination.layout"
            :total="pagination.total" :current-page='pagination.current_page' @size-change="handleSizeChange" @current-change="handleCurrentChange" @prev-click="handlePrev" @next-click="handleNext">
        </el-pagination>
    </div>
</div>
</template>

<script>
export default {
  props: {
    // 居中
    align: {
      type: String,
      default: 'left'
    },
    // 表格属性
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 高亮
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    // 斑马纹
    stripe: {
      type: Boolean,
      default: false
    },
    // 带边框
    border: {
      type: Boolean,
      default: false
    },
    //是否显示表头
    showHeader: {
      type: Boolean,
      default: true
    },
    // 固定头部
    height: [Number, String],
    // 流体高度
    maxHeight: [Number, String],
    // 带状态表格
    rowClassName: [String, Function],
    // 排序
    defaultSort: Object,
    // 合计
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: {
      type: String,
      default: "合计"
    },
    summaryMethod: Function,
    // 合并列或者行
    spanMethod: Function,
    columns: {
      type: Array,
      default: function() {
        return [];
      }
    },
    pagination: {
      type: Object,
      default: null
    },
    hasBatch: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  methods: {
    handleCurrentChange(page) {
      this.$emit("handleCurrentChange", page);
    },
    handleSizeChange(pageSize) {
      this.$emit("handleSizeChange", pageSize);
    },
    handlePrev(page) {
      this.$emit("handlePrev", pageSize);
    },
    handleNext(page) {
      this.$emit("handleNext", pageSize);
    },
    handleSelectionChange(selection) {
      this.$emit("handleSelectionChange", selection);
    },
    rowClick(row, event, column) {
      this.$emit("rowClick", row, event, column);
    },
    rowDblclick(row, event) {
      this.$emit("rowDblclick", row, event);
    }
  }
};
</script>

<style lang="scss">
.pagination {
  text-align: center;
  margin-top: 20px;
  .btn-prev,
  .btn-next {
    span:not([class*="suffix"]) {
      padding: 0 10px;
    }
  }
}
</style>
