<template>
  <div>
    <div class="container"">
      <div class=" login-form">
      <h1 class="h1">欢迎新用户注册</h1>
      <el-form class="rgs-form" label-width="120px">
        <el-form-item label="账号" class="input">
          <el-input v-model="ruleForm.username" autocomplete="off" placeholder="账号" />
        </el-form-item>
        <el-form-item label="姓名" class="input">
          <el-input v-model="ruleForm.name" autocomplete="off" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="密码" class="input">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item label="重复密码" class="input">
          <el-input type="password" v-model="ruleForm.repetitionPassword" autocomplete="off" show-password />
        </el-form-item>
       
        <el-form-item label="联系方式" class="input">
          <el-input v-model="ruleForm.phone" autocomplete="off" placeholder="联系方式" />
        </el-form-item>

        <el-form-item label="邮箱" class="input">
          <el-input v-model="ruleForm.email" autocomplete="off" placeholder="邮箱" />
        </el-form-item>

        <div style="
              display: flex;
              flex-wrap: wrap;
              width: 111%;
              justify-content: center;
            " class="btns">
          <el-button class="btn" type="primary" @click="login()">注册</el-button>
          <el-button class="btn close" type="primary" @click="close()">取消</el-button>
          <el-button class="btn" type="success" @click="$router.push('/login')">去登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
  </div>
</template>
<script>
import { isMobile } from '../utils/validate';

export default {
  data() {
    return {
      ruleForm: {},
    //  tableName: "",
      rules: {},
      sexTypesOptions: [],
    };
  },
  mounted() { },
  methods: {
    // 获取uuid
    getUUID() {
      return new Date().getTime();
    },
    close() {
      this.$router.push({ path: "/login" });
    },
    // 注册
    login() {
      if (!this.ruleForm.username) {
        this.$message.error("账号不能为空");
        return;
      }
      if (!this.ruleForm.password) {
        this.$message.error("密码不能为空");
        return;
      }
      if (!this.ruleForm.repetitionPassword) {
        this.$message.error("重复密码不能为空");
        return;
      }
      if (this.ruleForm.repetitionPassword != this.ruleForm.password) {
        this.$message.error("密码和重复密码不一致");
        return;
      }
      if (!this.ruleForm.name ) {
        this.$message.error("用户姓名不能为空");
        return;
      }
      if (
        this.ruleForm.phone &&
        !isMobile(this.ruleForm.phone)
      ) {
        this.$message.error("手机应输入手机格式");
        return;
      }

      if (
        this.ruleForm.email &&
        !this.$validate.isEmail(this.ruleForm.email)
      ) {
        this.$message.error("邮箱应输入邮件格式");
        return;
      }
      this.$https.post("/register", this.ruleForm).then((response) => {
          // 检查响应状态码
          console.log(response);
          if(response=="error2"){
           return this.$message.error("该用户已存在，请重新输入用户名");
          }
          if (response.status === 200) {
            this.$message({
              message: "注册成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.$router.replace({ path: "/login" });
              },
            });
          } else if (response.status === 400) {
            this.$message.error("注册失败，请检查输入信息");
          }
        })
        .catch((error) => {
          console.error("注册请求错误:", error);
        });

    },
  },
};
</script>
<style lang="less" scoped>
.container {
  background: url("/src/assets/icon/register.jpg") no-repeat center center; // Center the background image
  background-size: cover; // Cover the entire container without repeating
  height: 800px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.h1 {
  position: absolute;
  top: -30px; // Position it at the top of the login-form
  width: 100%; // Full width of the login-form
  text-align: center; // Center the text
  margin-top: -10%; // Adjust this value to position the text exactly where you want
  color: black;
  font-size: 40px;
  left: -1%;
}

.login-form {
  width: 500px;
  height: 500px; // You might want to adjust the height to fit all the content
  background-color: rgb(217, 232, 238);
  border-radius: 3px;
  position: relative; // Relative positioning for the h1 to be positioned absolutely within
  left: 0%;
  // top: 50%;
  // transform: translate(-50%, -50%);
  align-content: center;
  opacity: 0.95;
  padding-top: 60px; // Give some space for the h1 at the top
}

.rgs-form {
  position: static; // Remove absolute positioning
  width: 90%;
  padding: 0 9px;
  box-sizing: border-box;

}

</style>
