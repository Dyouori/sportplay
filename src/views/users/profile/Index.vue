<template>
  <div style="height: 100%;width: 100%;">
    <!-- <el-skeleton :rows="6" animated /> -->
    <el-container>
      <el-container>
        <el-aside align="center" style="width: 26%">
          <div class="block">
            <el-image
              class="avater"
              :src="'http://localhost:9000/avaters/' + userPic"
            >
              <div slot="error" class="image-slot">
                <img
                  style="width: 260px; height: 260px"
                   :src="'http://localhost:9000/avaters/' + userPic"
                  alt=""
                />
              </div>
            </el-image>
            <el-menu
              style="overflow: hidden"
              default-active="2"
              class="el-menu-vertical-demo"
              @select="handleSelect"
            >
              <el-menu-item index="/myInfo/editInfo">
                <i class="el-icon-edit-outline"></i>
                <span slot="title">编辑资料</span>
              </el-menu-item>
              <el-menu-item index="/myInfo/myOrder">
                <i class="el-icon-s-order"></i>
                <span slot="title">我的订单</span>
              </el-menu-item>
              <el-menu-item index="/myInfo/money">
                <i class="iconfont icon-qianbao"></i>
                <span slot="title"> 我的钱包 </span>
              </el-menu-item>
              <el-menu-item index="/myInfo/charts">
                <i class="iconfont icon-mubiao" style="font-size: 20px;margin-right: 4px;"></i>
                <span slot="title">我的目标</span>
              </el-menu-item>
              <el-menu-item index="/myInfo/healthData">
                <i class="el-icon-document" style="font-size: 20px;margin-right: 4px;"></i>
                <span slot="title">健康数据</span>
              </el-menu-item>
              <el-menu-item index="/myInfo/runData">
                <i class="iconfont icon-paobu" style="font-size: 20px;margin-right: 4px;"></i>
                <span slot="title">运动步数</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>

        <el-main
          align="center"
          style="padding: 0; width: 67%; overflow-x: hidden"
        >
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script src="//unpkg.com/@element-plus/icons-vue"></script>
<script>
import { Message } from "element-ui";

export default {
  name: "RadarChart",
  created() {
    var userString = window.sessionStorage.getItem("user");
    
    // 将字符串转换回JavaScript对象
    var user = JSON.parse(userString);
    this.getUserPic(user.id);
    this.userPic = user.pic ? user.pic : "";
  },

  data() {
    return {
      userPic: "",
    };
  },
  methods: {
    getUserPic(id){
      this.$https.get("getUserPic?id=" + id).then((res) => {
        if(res.status === 200){
          this.userPic = res.data
        }
       else {
          Message.error(res.data.msg);
        }
      });
    },
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
  },
};
</script>

<style scoped>
.el-menu-item {
  font-size: 16px;
  font-weight: 500;
}

.avater {
  height: 260px;
  width: 260px;
  border-radius: 50%;
}
.el-menu-vertical-demo {
  border: none;
}
</style>
