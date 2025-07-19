<template>
  <div>
    <div :class="['circle', circleColorClass]">
      <div class="circle-text">
        <!-- 条件渲染提示信息 -->
        <div v-if="todayCalorie < 1500" class="prompt">摄入卡路里过少</div>
        <div>今日已摄入：</div>
        <div>{{ this.todayCalorie }}</div>
        <div>卡路里</div>
        <el-button style="margin-top: 15px; font-weight: bold" @click="open()"
          >记录</el-button
        >
      </div>
    </div>
    <div class="content">
      <!-- 搜索 -->
      <div class="search">
        <el-input
          placeholder="请输入食物名称"
          clearable
          v-model="queryInfo.query"
          @clear="getFoodList"
        >
          <!-- 内容清除后再查询一遍 -->
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getFoodList"
          ></el-button>
        </el-input>
      </div>

      <div class="foodCards">
        <div class="card">
          <el-card
            shadow="hover"
            class="box-card"
            v-for="food in foodList"
            :key="food.id"
          >
            <div slot="header" class="clearfix">
              <span>{{ food.foodName }}</span>
              <el-input-number
                style="float: right; width: 124px"
                v-model="food.quantity"
                @change="handleQuantityChange(food)"
                :min="0"
              ></el-input-number>
            </div>
            <div class="text item">{{ food.calorie }} 大卡/100g</div>
            <div class="text item">
              <span>评分:</span>
              <el-rate disabled v-model="food.score" :colors="colors"></el-rate>
            </div>
          </el-card>
        </div>
      </div>
      <!-- 分页 size-change每页最大变化  current-change当前最大变化 layout功能组件 -->
      <div style="background-color: #fff">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageStart"
          :page-sizes="[1, 2, 6, 12]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      foodList: [],
      //查询的数据
      queryInfo: {
        query: "", //查询信息
        pageStart: 1, //当前页
        pageSize: 6,
      },
      total: 0, //总记录数
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      todayCalorie: 0,
      num: 0,
      circleColorClass: "", // 初始化类名为空
      user_id: "",
    };
  },
  created() {
    var userString = window.sessionStorage.getItem("user");
    var user = JSON.parse(userString);
    this.user_id = user.id;
    this.getFoodList();
    this.getTodayCalorie();
  },
  methods: {
    async getTodayCalorie() {
      const { data: res } = await this.$https.get(
        "getAllCalorie?user_id=" + this.user_id
      );
      //this.todayCalorie = res.data.todayCalorie
      console.log(res.data);
      // 获取当前年月日，格式如 "YYYY-MM-DD"
      const today = new Date().toISOString().split("T")[0];
      // 查找数组中 createTime 与当前年月日相符的数据
      const todayCalorieData = res.data.find(
        (item) => new Date(item.creatTime).toISOString().split("T")[0] === today
      );
      // 如果找到了匹配的数据，则设置 todayCalorie，否则可能设置为 null 或默认值
      this.todayCalorie = todayCalorieData ? todayCalorieData.calorie : null;
    },
    handleChange(value) {},
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getFoodList();
    },
    //pagesart触发,变化时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pageStart = newPage;
      this.getFoodList();
    },
    async getFoodList() {
      const { data: res } = await this.$https.get("allfood", {
        params: this.queryInfo,
      });

      this.foodList = res.data.map((food) => ({
        ...food,
        quantity: 0, // 初始化数量为0
      })); // 将返回数据赋值，数据封装
      this.total = res.numbers; // 总个数
    },
    handleQuantityChange(food) {
      this.todayCalorie = this.foodList.reduce((total, food) => {
        return total + food.calorie * food.quantity;
      }, 0);
      if (this.todayCalorie < 1500) {
        this.circleColorClass = "yellow-background";
      } else if (this.todayCalorie > 2000) {
        this.circleColorClass = "red-background";
      } else {
        this.circleColorClass = ""; // 如果在1500到2000之间，可以保持默认颜色或设置其他类名
      }
    },
    open() {
      if (this.todayCalorie > 2000) {
        this.addTodayCalorie();
        this.$confirm(
          "今日卡路里摄入已超量，是否进入运动课程进行减脂训练?",
          "提示",
          {
            confirmButtonText: "前往",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.$router.push("/showClass");
        });
      } else {
        this.addTodayCalorie();
      }
    },
    async addTodayCalorie() {
      const res = await this.$https.post(
        `addTodayCalorie?user_id=${this.user_id}&calorie=${this.todayCalorie}`
      );
      if (res.data === "success") {
        this.$message({
          type: "success",
          message: "记录成功",
        });
      } else if (res.data === "success2") {
        this.$message({
          type: "success",
          message: "更新成功",
        });
      }
    },
    getAddTodayCalorie() {},
  },
};
</script>

<style scoped>
.prompt {
  cursor: pointer;
  color: rgb(14, 14, 14);
  background-color: #eff5ff;
  border-radius: 5px;
  font-weight: 200;
  font-size: 14px;
  width: 120px;
  margin-left: 32px;
  margin-bottom: 10px;
}
.circle-text {
  font-size: 22px;
  font-weight: 800;
  margin-top: 150px;
}
.circle {
  float: left;
  background-color: #87ceeb; /* 天蓝色 */
  width: 200px; /* 半圆的半径增加 */
  height: 400px; /* 半圆的直径增加 */
  border-radius: 0 200px 200px 0; /* 更新border-radius以匹配新的半径 */
  text-align: center; /* 文本居中 */
}
.yellow-background {
  background-color: rgb(230, 230, 127);
  color: black;
}

.red-background {
  background-color: rgb(245, 127, 127);
}
.box-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}
.content {
  /* 使用 block 布局或者设置 flex 方向为列 */
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 在内容区域中心对齐 */
  height: 564px;
}

.search {
  width: 500px;
  margin: 21px auto;
}
.foodCards {
  display: flex; /* 卡片水平排列 */
  flex-wrap: wrap; /* 允许卡片换行 */
  justify-content: space-around; /* 卡片之间的间隔 */
  margin-bottom: 20px; /* 添加底部外边距 */
  margin-left: 10px;
  width: 898px;
}
.card {
  display: flex;
  width: 132%;
  flex-wrap: wrap; /* 允许卡片换行 */
}
.text {
  font-size: 16px;
}

.item {
  margin-bottom: 15px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 274px;
  height: 170px;
  background-color: #eff5ff;
  margin: 10px 10px;
}
::v-deep .el-card__header {
  padding: 13px;
  font-size: 16px;
  font-weight: bold;
}
::v-deep .el-card__body {
  padding: 7px;
}
</style>
