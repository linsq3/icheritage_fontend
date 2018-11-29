<!-- 用户管理 -->
<template>
<el-row class="u-padding-top-xs">
    <el-row>
        <table-list align="center" :tableData="tableData"  :columns="columns" :pagination="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" ></table-list>
    </el-row>
</el-row>
</template>

<script>
import { getUser, userAgree, userRefused } from "apis/";
import util from '@/helper/util'
export default {
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: "accountId",
          label: "账号名"
        },
        {
          prop: "nickname",
          label: "昵称"
        },
        {
          prop: "avatar",
          label: "用户头像",
          render: (record, index, h) => {
            return (
              <div>
                <img class="menu-img" src={record.avatar} />
              </div>
            );
          }
        },
        {
          prop: "score",
          label: "积分"
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
          prop: "singin",
          label: "签到次数"
        },
        {
          prop: "头像状态",
          label: "status",
          render: (record, index, h) => {
            return (
              <div>
              {record.status == 0 ? '待审核' : record.status == 1 ? '审核通过' : '审核拒绝'}
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
                <div class="user-btn">
                { record.status !=1 &&
                    <el-button onClick={() => this.handleAgree(record.id)} type="primary">通过</el-button>}
                </div>
                <div class="user-btn">    
                { record.status !=2 &&
                    <el-button onClick={() => this.handleRefused(record.id)} type="danger">拒绝</el-button>
                }
                </div>
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
    getList() {
      const params = {
        page: this.pagination.current_page,
        pageSize: this.pagination.page_size
      };
      getUser(params).then(res => {
        this.tableData = res.data.userlist;
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
    handleAgree(id) {
        const params = {
            id
        };
        userAgree(params).then(res => {
            this.$message({
                type: "success",
                message: "审核通过"
            });
            this.getList();
        });
    },
    handleRefused(id) {
        const params = {
            id
        };
        userRefused(params).then(res => {
            this.$message({
                type: "success",
                message: "审核不通过"
            });
            this.getList();
        });
    }
  }
};
</script>
<style lang="scss">
.user-btn + .user-btn {
    margin-top: 10px;
}
</style>

