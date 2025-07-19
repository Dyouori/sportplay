<template>
  <div>
    <!-- 搜索 -->
    <el-row :gutter="25">
      <el-col :span="10">
        <el-input
          placeholder="请输入搜索内容"
          clearable
          v-model="queryInfo.query"
          @clear="getOrder"
          style="margin-top: 10px"
        >
          <!-- 内容清除后再查询一遍 -->
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getNewOrder"
          ></el-button>
        </el-input>
      </el-col>
      <!-- 搜索按钮 -->
    </el-row>
    <el-row>
        <el-empty  v-if="!orderList || orderList.length === 0" :image-size="200"></el-empty>
      <el-col
        style="width: 100%; margin-top: 20px"
        :span="10"
        v-for="(order, index) in orderList"
        :key="index"
      >
      
        <el-card style="width: 80%;background-color:rgba(242, 246, 252, 0.5);">
          <div class="header clearfix">
            <div class="left">
              <span class="text">订单编号：</span>
              <span class="num">{{ order.orderNumber }}</span>
            </div>
            <div class="right" style="display: flex; align-items: center; height: 40px; padding-right: 10px">
              <span class="time right">{{
                formatTimestamp(order.payTime)
              }}</span>
              <el-button :disabled="order.status!=='已支付'" size="mini" type="primary" style="margin:auto;" @click="cancelStatus(order)">取消</el-button>
            </div>
          </div>
          <div class="context">
            <div class="leftCon">
              <img
                 v-if="'http://localhost:9000/classes/'+order.cover"
                :src="'http://localhost:9000/classes/'+order.cover"
                class="image"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="middle">
                <h2 class="name" style="padding-left: 14px">
                  {{ order.title }}
                </h2>
                <span class="count">x{{ order.count }} </span>
              </div>
            </div>

            <div class="rightCon">
              <div class="flex-between flex-center">
                <span class="type"></span>
                <span class="price">¥{{ order.price }}</span>
              </div>
            </div>
          </div>

          <div class="bottom clearfix">
           <div class="status left">
            <span>状态：</span>
            <el-tag v-if="order.status==='已支付'" type="success">已支付</el-tag>
            <el-tag v-else type="danger">已取消</el-tag>
           </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页 size-change每页最大变化  current-change当前最大变化 layout功能组件 -->
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageStart"
        :page-sizes="[1, 2, 5]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    var userString = window.sessionStorage.getItem("user");

    // 将字符串转换回JavaScript对象
    var user = JSON.parse(userString);
    this.userId = user.id;
    this.getOrder();
  },
  data() {
    return {
      currentDate: new Date(),
      userId: "",
      //查询信息实体
      queryInfo: {
        query: "", //查询信息，名字，string
        pageStart: 1, //当前页
        pageSize: 5,
        queryId: "",
      },
      total: 0, //总记录数
      orderList: [],
      nextOrderNumber: 1000 // 初始订单编号
    };
  },
  methods: {
    formatTimestamp(timestamp) {
      // 将时间戳（假设是毫秒）转换为日期对象
      const date = new Date(timestamp);
      // 返回格式化的日期字符串
      return (
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2) +
        " " +
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2) +
        ":" +
        ("0" + date.getSeconds()).slice(-2)
      );
    },
    async getOrder() {
      this.queryInfo.queryId = this.userId;
      const { data: res } = await this.$https.get("getorder", {
        params: this.queryInfo,
      });
      this.total = res.numbers;
      this.orderList = res.data;
      
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
    getNewOrder() {
      this.queryInfo.pageStart = 1;
      this.getOrder();
    },
   async cancelStatus(order){    
        const confirmResult = await this.$confirm(
          "此操作将取消本次订单，是否继续？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        // 如果用户确认取消订单，confirmResult 将是 'confirm'
        if (confirmResult !== "confirm") {
         
          return this.$message.info("已取消");
        }
        else if(confirmResult === "confirm"){
          this.$store
              .dispatch("backMoney", {
                userId: this.userId,
                orderId: order.id,
                money: order.price,
              })
              const { data: res } = await this.$https.delete("cancelOrder?id=" + order.id);
        if (res !== "success") {
          return this.$message.error("取消失败，请稍后再试");
        }
        this.$message.success("取消成功");
        }
       
        this.getOrder();
    }
  },
};
</script>

<style scoped lang="less">
.status{
    font-size: 18px;
    margin-bottom: 10px;
}
.footer {
  display: flex;
  margin-top: 78px;
  margin-bottom: 40px;
}
.context {
  height: 127px;
}
.middle {
  width: 736px;
  display: flex; // 使用flex布局
  justify-content: space-between; // 在主轴上两端对齐
  align-items: center; // 在交叉轴上居中对齐
}
.leftCon {
  display: flex; // 使用flex布局来对齐图片和标题
  align-items: center; // 垂直居中对齐
}
.rightCon {
  display: flex; // 使用flex布局来对齐图片和标题
  justify-content: flex-end; // 在主轴上两端对齐
  padding-right: 50px;
}
.rightCon .price {
  color: #ff4231;
  font-weight: 600;
  font-size: 20px;
}
.count {
  color: #484848;
  font-size: 14px;
  padding-left: 0;
}
.right {
  float: right;
}
.left {
  float: left;
  padding-left: 20px;
}
.header {
  border-bottom: 1px solid #cedce4;

  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 14px;

  .text {
    color: #6f6f6f;
  }

  .num {
    font-weight: 500;
    color: #152844;
  }
}

::v-deep .el-card__body {
  padding: 0 !important; /* 使用 !important 来确保覆盖默认样式 */
  border-radius: 4px;
  padding: 16px;
  margin-top: 12px;
}

.time {
  width: 189px;
  font-size: 13px;
  color: #999;
  padding-right: 20%;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 11%;
  display: block;
  padding: 16px 0 0 16px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
