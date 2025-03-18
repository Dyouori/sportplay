<template>
  <el-container class="main">

    <!--头部区域-->
    <el-header>
      <div>
        <img :src="imageLogo" class="logo-image">
        <router-link to="/desktop" class="logo-title">&nbsp;&nbsp;FACE-UI</router-link>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <!--页面主体区域-->
    <el-container>

      <!--侧边栏-->
      <el-aside width="200px">
        <el-menu text-color="#008390" active-text-color="#ade2e0">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user" style="color: #008390"></i>
              <span>人脸管理</span>
            </template>
            <router-link v-for="(item, index) in menuItems" :key="index" class="router-link-active" :to="item.path">
              <el-menu-item :index="`1-${index + 1}`">
                {{ item.name }}
              </el-menu-item>
            </router-link>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!--右侧内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      username: localStorage.getItem("username") || 'admin',
      imageLogo: require('@/assets/face_logo.png'),
      menuItems: [
        { name: '人脸列表', path: '/faceList' },
        { name: '日志列表', path: '/faceLog' }
      ]
    };
  },
  methods: {
    //退出登录
    loginOut() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>

<style>
@import "./index.css";

.logo-image {
  width: 40px;
  height: 40px;
  margin-left: 20px;
}
</style>
