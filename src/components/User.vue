<template>
  <el-container style="width: 100vw">
    <el-header style="padding: 0">
      <div class="line"></div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="width: 100%;display: flex; justify-content: center;"
      >
       
        <el-menu-item index="/indexHome">首页</el-menu-item>
        <el-menu-item index="/showClass">学习课程</el-menu-item>
        <el-menu-item index="/foodHealth">饮食记录</el-menu-item>
        <el-menu-item index="/bodyHealth">身体数据记录</el-menu-item>
        <el-menu-item index="/myInfo">个人中心</el-menu-item>
      

        <el-submenu index="2">
          <template slot="title">
            <el-avatar :src="'http://localhost:9000/avaters/' + userPic" size="large" @error="errorHandler">
              <img
                :src="avatarUrl"
                alt="备用头像"
                v-if="showFallback"
              />
            </el-avatar>
          </template>
          <el-menu-item  index="/myInfo/editInfo">编辑资料</el-menu-item>
          <el-menu-item index="/myInfo/myOrder">我的订单</el-menu-item>
          <el-menu-item index="2-3">系统通知</el-menu-item>
          <el-menu-item index="/login">退出登录</el-menu-item>
          <el-menu-item index="/myInfo/healthData">健康数据</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>

    <el-main style="padding: 0">
      <router-view></router-view>
    </el-main>

    <el-footer>
      <div class="footer-box">
        <a class="foot-link" href="">意见反馈</a>
        <a class="foot-link" href="">后台管理</a>
        <a class="foot-link" href="">关于我们</a>
      </div>
      <div class="address">2025 © 管理系统演示 · All Rights Reserved</div>
    </el-footer>
  </el-container>
</template>

<script>
import { Message } from 'element-ui';
export default {
  created(){
    var userString = window.sessionStorage.getItem("user");

// 将字符串转换回JavaScript对象
    var user = JSON.parse(userString);
    this.userPic = this.userPic = user.pic ? user.pic : ''; 
  },
  data() {
    return {
      avatarUrl: "", // 原始头像 URL
      showFallback: false, // 控制是否显示备用头像
      userPic:''
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // 检查当前路由是否与即将跳转的路由相同
      if (this.$route.path !== key) {
        // 如果不相同，则进行跳转
        this.$router.push({ path: key });
      } else {
        // 如果相同，则提醒用户
        Message({
          message: "您已经在当前页面了，无需重复导航。",
          type: "warning",
          duration: 2000,
        });
        // 或者可以使用其他方式提醒用户，比如使用 Element UI 的通知组件
        // this.$message.warning('您已经在当前页面了！');
      }
    },
    // error图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
    errorHandler() {
      return true;
    },
    handleAvatarError() {
      // 头像加载失败，设置备用头像的 URL
      this.avatarUrl =
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
      this.showFallback = true; // 显示备用头像
      return false; // 阻止默认的 fallback 行为
    },
  },
};
</script>

<style scoped>

el-footer {
  max-width: 1108px;
  margin: 0 auto;
  padding: 24px 0;
}
.footer-box {
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 24px auto;
  justify-content: center;
}
.foot-link {
  margin: 0 16px;
  color: #2a4f88;
  text-decoration: none;
}
.address {
  text-align: center;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  color: #aeaeae;
  margin-top: 8px;
}
</style>
