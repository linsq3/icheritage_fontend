<!-- 用户管理 -->
<template>
<el-row class="u-padding-top-xs">
    <el-row>
        <el-form inline>
            <el-form-item>
                <el-date-picker
                    v-model="filterDate"
                    type="daterange"
                    value-format="yyyyMMdd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item> 
            <el-form-item>
                <el-select placeholder="状态" v-model="filters.status">
                    <el-option :key="3" label="全部" :value="3"></el-option>
                    <el-option :key="1" label="已签发" :value="1"></el-option>
                    <el-option :key="0" label="撤稿" :value="0"></el-option>
                    <el-option :key="2" label="待审核" :value="2"></el-option>
                </el-select>
            </el-form-item>   
            <el-form-item>
                <el-input placeholder="新闻标题" v-model="filters.newsTitle"></el-input>
            </el-form-item>  
              <el-form-item>
                <el-input placeholder="新闻ID" v-model="filters.newsId"></el-input>
            </el-form-item>  
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleNew">添加</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row>
        <table-list align="center" :tableData="tableData"  :columns="columns" :pagination="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" ></table-list>
    </el-row>
</el-row>
</template>

<script>
import { getGroup, delGroup, sortGroup, recoverGroup, agreeGroup} from "apis/";
import util from '@/helper/util'
export default {
  data() {
    return {
        filterDate: '',
        filters: {
            newsId: null,
            newsTitle: null,
            status: null,
            startDate: null,
            endDate: null,  
        },
      tableData: [],
      operatorId: null,
      columns: [
        {
          prop: "sortId",
          label: "调序",
          render: (record, index, h) => {
            return (
              <div>
                <el-button size="small" onClick={() =>this.sort('up',record, index)} disabled={index == 0} icon="el-icon-arrow-up" circle></el-button>
                <el-button size="small" onClick={() =>this.sort('down',record, index)}  disabled={index == this.tableData.length - 1} icon="el-icon-arrow-down" circle></el-button>
              </div>
            );
          }
        },
        {
          prop: "id",
          label: "新闻ID"
        },
        {
          prop: "title",
          label: "新闻标题"
        },
        {
          prop: "createby",
          label: "创建人"
        },
        {
          prop: "createat",
          label: "创建时间",
          render: (record, index, h) => {
            return (
              <div>
              {util.getTime(record.createat, 'yy-mm-dd h:m:s')}
              </div>
            );
          }
        },
        {
          prop: "status",
          label: "状态",
          render: (record, index, h) => {
            return (
              <div>
              {record.status == 1 ? '已签发' : record.status == 2 ? '待审核' : '撤稿' }
              </div>
            );
          }
        },
        {
          prop: "operator",
          label: "操作",
          render: (record, index, h) => {
            return (
              <div>
                <el-dropdown onCommand={(command) =>this.handleCommand(command, record)}>
                  <span class="el-dropdown-link">
                    <i class="el-icon-setting el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">编辑</el-dropdown-item>
                    <el-dropdown-item command="2">
                    {record.status == 1 ? '撤稿' : record.status == 2 ? '通过' : '恢复' }
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            );
          }
        }
      ],
      pagination: {
        current_page: 1,
        total: 0,
        page_size: 10,
        page_sizes: [10, 20, 50, 100],
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        prevText: "上一页",
        nextText: "下一页"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
      handleSearch() {
          this.getList();
      },
    getList() {
      if(this.filterDate && this.filterDate.length > 0 ) {
          this.filters.startDate = this.filterDate[0];
          this.filters.endDate = this.filterDate[1];
      } else {
          this.filters.startDate = null;
          this.filters.endDate = null;
      }  
      const params = {
        page: this.pagination.current_page,
        pageSize: this.pagination.page_size,
        ...this.filters
      };
      getGroup(params).then(res => {
        this.tableData = res.data.groupList;
        this.pagination.total = res.data.total;
      });
    },
    handleSizeChange(pageSize) {
        this.pagination.page_size = pageSize;
        this.getList();
    },
    handleCurrentChange(page) {
        this.pagination.current_page = page;
        this.getList();
    },
    sort(type, record, index) {
        let params = {}
        if(type == 'up') {
            params = {
                nowId: record.id,
                nowNumber: record.ordernumber,
                newId: this.tableData[index - 1].id,
                newNumber: this.tableData[index - 1].ordernumber
            }
        }else {
            params = {
                nowId: record.id,
                nowNumber: record.ordernumber,
                newId: this.tableData[index + 1].id,
                newNumber: this.tableData[index + 1].ordernumber
            }
        }
        
        sortGroup(params).then(res => {
            this.$message({
              type: "success",
              message: "调序成功"
            });
            this.getList();
        });
    },
    handleCommand(command, record) {
        this.operatorId = record.id;
        if(command == 1) {
            // 编辑
            this.$router.push({name: 'groupNew',query: {id: record.id}})
        } else if (command == 2) {
             // 上下架
            if(record.status === 1) {
                this.handleDel();
            }else if(record.status === 2) {
                this.handleAgree();
            } else {
              this.handleRecover();
            }
        } 
    },
    handleDel() {
        const params = {
            id: this.operatorId
        }
        delGroup(params).then(res => {
            this.$message({
              type: "success",
              message: "撤稿成功"
            });
            this.getList();
        })
    },
    handleAgree() {
        const params = {
            id: this.operatorId
        }
        agreeGroup(params).then(res => {
            this.$message({
              type: "success",
              message: "审核通过"
            });
            this.getList();
        })
    },
    handleRecover() {
        const params = {
            id: this.operatorId
        }
        recoverGroup(params).then(res => {
            this.$message({
              type: "success",
              message: "恢复成功"
            });
            this.getList();
        })
    },
    handleNew() {
      this.$router.push({name: 'groupNew'})
    }
  }
};
</script>
<style lang="scss">
</style>

