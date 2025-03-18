<template>
  <div>
    <transition name="sort">
      <el-container>
      <!-- 侧边栏 -->
      <el-aside style="width: 250px">
        <div
          style="
            height: 60px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <img
            src="../assets/icon/health.png"
            style="width: 40px; height: 40px"
            alt=""
          />
          <span style="margin-left: 2px; font-size: 20px">后台管理</span>
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="$route.path"
          :router="true"
          style="font-size: 29px;"
           @select="handleSelect"
        >
          <!-- 大标题 -->

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>信息管理</span>
            </template>
            <el-menu-item style="padding-left: 70px" index="/user"
              >用户信息</el-menu-item
            >
            <el-menu-item style="padding-left: 70px" index="/admininfo"
              >管理员个人信息</el-menu-item
            >
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-management"></i>
              <span>运动课程管理</span>
            </template>
            <el-menu-item style="padding-left: 70px" index="/classification"
              >课程分类</el-menu-item
            >
            <el-menu-item style="padding-left: 70px" index="/classinfo"
              >课程信息</el-menu-item
            >
          </el-submenu>
          <!-- <el-menu-item index="/cookbook">
            <i class="el-icon-fork-spoon"></i>
            <span>健康食谱信息管理</span></el-menu-item
          > -->
         
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>营养分析信息管理</span>
            </template>
            <el-menu-item style="padding-left: 70px" index="/foodtype"
              >食物分类</el-menu-item
            >
            <el-menu-item style="padding-left: 70px" index="/foodinfo"
              >食物信息</el-menu-item
            >
          </el-submenu>
          <el-menu-item index="/comment">
            <i class="
el-icon-s-comment"></i>
            <span>评论管理</span></el-menu-item
          >
          <el-menu-item index="/order">
            <i class="el-icon-sell"></i>
            <span>订单管理</span></el-menu-item
          >
          <el-menu-item index="/chart">
            <i class="el-icon-pie-chart"></i>
            <span>统计分析</span></el-menu-item
          >
        </el-menu>
        
      </el-aside>

      <el-container>
        <!-- 头部 -->
        <el-header>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user', replace: true }"
              >用户管理</el-breadcrumb-item
            > -->
          </el-breadcrumb>

          <div
            style="
              flex: 1;
              width: 0;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <el-dropdown placement="bottom-end" @command="handleCommand">
              <span class="el-dropdown-link" style="color: #fff">
                {{ adminName }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="toAdminInfo"
                  >个人信息</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
      </transition>
  </div>
</template>

<script>
import { Message } from 'element-ui';
export default {
  data() {
    return {
      adminName: "",
      isCollapse: false,

      activePath: "/welcome", //默认路径
    };
  },
  mounted() {
    //展示管理员姓名
    this.adminName ='admin'
   //  JSON.parse(sessionStorage.getItem("user")).username;
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    handleSelect(key, keyPath) {
      // // 检查当前路由是否与即将跳转的路由相同
      // if (this.$route.path !== key) {
      //   // 如果不相同，则进行跳转
      //   this.$router.push({ path: key });
      // } else {
      //   // 如果相同，则提醒用户
      //   Message({
      //     message: "您已经在当前页面了，无需重复导航。",
      //     type: "warning",
      //     duration: 2000,
      //   });
      //   // 或者可以使用其他方式提醒用户，比如使用 Element UI 的通知组件
      //   // this.$message.warning('您已经在当前页面了！');
      // }
    },
    handleCommand(command) {
      if (command === "changePsw") {
        //改密码
      }
      if (command === "logout") {
        window.sessionStorage.clear(); //清除数据
        this.$router.push("/login");
      }
      if (command === "toAdminInfo") {
        //查看咱管理员信息
        this.$router.push("/admininfo");
      }
    },

    //控制伸缩
    toggleCollapase() {
      this.isCollapse = !this.isCollapse;
    },
    //保存路径
    savaNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu-item:hover {
  color: skyblue;
}

.el-menu-item.is-active {
  // 选中样式
  background-color: #b2bcca !important;
  border-radius: 2px;
  color: #fff;
}

.el-header {
  background-color: #8c939d;
  display: flex;
  justify-content: space-between; // 左右贴边
  padding-left: 0%; // 左边界
  align-items: center; // 水平
  color: #fff;
  font-size: 20px;

  > div {
    //左侧div加布局
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #8c939d;
  min-height: 100vh;

  .el-menu {
    border-right: none; // 对其右边框
    background-color: #e3e3e3;

    .el-menu-item {
      background-color: #e3e3e3;
    }
  }
}

.el-main {
  background-color: #eaedf1;
}

//布局样式
.home-container {
  height: 100%;
}

.logo_img {
  width: 20%;
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer; // 显示鼠标指针为：小手
}
.el-icon-fork-spoon {
  font-size: 20px;
}


        
</style>
