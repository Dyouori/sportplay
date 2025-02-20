<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体 -->
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-input
            placeholder="请输入搜索内容"
            clearable
            v-model="queryInfo.query"
            @clear="getOrderList"
          >
            <!-- 内容清除后再查询一遍 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getNewUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 搜索按钮 -->
      </el-row>
      <!-- 表格 -->
      <!-- 隔行变色 -->
      <el-table :data="OrderList" :border="true" stripe style="font-size: 16px">
        <!-- 索引列 -->
        <el-table-column align="center" type="index"></el-table-column>
        <!-- 表格 -->
        <el-table-column
          align="center"
          width="100px"
          label="用户"
          prop="username"
        ></el-table-column>
        <el-table-column
          align="center"
          width="200px"
          label="课程名"
          prop="title"
        ></el-table-column>
        <el-table-column align="center" label="状态" prop="status">
          <template v-slot:default="{ row }">
            <div class="status-container" style="text-align: center">
              <el-button
              
                :type="getButtonType(row.status)"
                size="mini"
                @click="handleButtonClick(row)"
              >
                {{ row.status }}
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="预留姓名"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号"
          prop="phone"
        ></el-table-column>
        <el-table-column
          align="center"
          label="订单时间"
          prop="pay_time"
        >
        <template slot-scope="scope">
    {{ formatTimestamp(scope.row.pay_time) }}
  </template>
      </el-table-column>

        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <!-- 取消订单 -->
            <el-button
            :disabled="scope.row.status === '已取消' ? true : false"
              type="primary"
              icon="el-icon-close"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
           
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 size-change每页最大变化  current-change当前最大变化 layout功能组件 -->
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageStart"
          :page-sizes="[1, 2, 5, 100]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    var userString = window.sessionStorage.getItem("user");

// 将字符串转换回JavaScript对象
var user = JSON.parse(userString);
this.userId = user.id;
    this.getOrderList();
    
  },
  data() {
    return {
      // 权限
      radio1: "普通用户",

      //查询信息实体
      queryInfo: {
        query: "", //查询信息
        pageStart: 1, //当前页
        pageSize: 5,
      },
      OrderList: [],
      total: 0, //总记录数
      userId: "",
      //添加表单信息
    };
  },

  methods: {
    formatTimestamp(timestamp) {
    // 将时间戳（假设是毫秒）转换为日期对象
    const date = new Date(timestamp);
    // 返回格式化的日期字符串
    return date.getFullYear() + '-' +
           ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
           ('0' + date.getDate()).slice(-2) + ' ' +
           ('0' + date.getHours()).slice(-2) + ':' +
           ('0' + date.getMinutes()).slice(-2) + ':' +
           ('0' + date.getSeconds()).slice(-2);
  },
    getButtonType(status) {
      if (status === "已支付") {
        return "success";
      } else if (status === "已取消") {
        return "danger"; 
      }
    },
    handleButtonClick(row) {
      // 按钮点击时的处理逻辑
      
    },
   async showEditDialog(item){
    console.log(item);
    
        const confirmResult = await this.$confirm(
          "此操作将取消用户订单，是否继续？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        // 如果用户确认删除，confirmResult 将是 'confirm'
        if (confirmResult !== "confirm") {
          return this.$message.info("已取消");
        }else if(confirmResult === "confirm"){
        //   this.$store
        // .dispatch("getMoney", this.userId)
        // .then(() => {
        //   this.curMoney = this.$store.state.money;
        // })
        // .catch((error) => {
        //   // 处理错误
        // });
          this.$store
              .dispatch("backMoney", {
                userId: item.user_id,
                orderId: item.id,
                money: item.price,
              })
              const { data: res } = await this.$https.delete("cancelOrder?id=" + item.user_id);

        if (res !== "success") {
          return this.$message.error("取消失败");
        }
        this.$message.success("取消成功");
      }
        this.getOrderList();
    },
   
    //获取所有用户
    async getOrderList() {
      // 调用post请求
      const { data: res } = await this.$https.get("allorder", {
        params: this.queryInfo,
      });
      this.OrderList = res.data; // 将返回数据赋值，数据封装
      this.total = res.numbers; // 总个数
    },
    // 最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList();
    },
    //pagesart触发,变化时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pageStart = newPage;
      this.getUserList();
    },
    getNewUserList() {
      this.queryInfo.pageStart = 1;
      this.getOrderList();
    },

    //删除
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除订单，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果用户确认删除，confirmResult 将是 'confirm'
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$https.delete("deleteorder?id=" + id);
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getOrderList();
    },
  },
};
</script>

<style scoped lang="less">
/* 面包屑样式 */
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
