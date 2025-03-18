<template>
  <div class="login_container">
    <h1>欢迎来到个人运动健康平台</h1>

    <div class="login_box">
      <!--添加表单-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login_form"
        label-width="0px"
      >
        <!-- 用户名 -->
        <el-form-item prop="username" >
          <el-input
          :disabled="isSuperAdmin"
            v-model="loginForm.username"
            prefix-icon="iconfont icon-denglu"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
          :disabled="isSuperAdmin"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            type="password"
            autocomplete="off"
            show-password
          >
          </el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="identifyCode" class="identify-code-item">
          <el-input
          :disabled="isSuperAdmin"
            v-model="loginForm.identifyCode"
            placeholder="请输入验证码"
            class="identify-code-input"
          ></el-input>

          <!-- 图片验证码 -->
          <div @click="refreshCode" class="code-image">
            <identify-code
              :identifyCode="identifyCode"
              :contentWidth="150"
              :contentHeight="50"
              :fontSizeMin="50"
            />
          </div>
        </el-form-item>
        <!-- 权限 -->
        <el-form-item prop="authority">
          <span class="svg-container">
            <!-- <svg-icon icon-class="user" /> -->
          </span>
          <el-select
            v-model="loginForm.role"
            placeholder="请选择身份"
            style="width: 418px"
            @change="handleRoleChange"
          
          >
            <el-option :key="0" label="普通用户" :value="0"></el-option>
            <el-option :key="1" label="超级管理员" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
          <!-- 注册按钮 -->
          <el-button type="success" @click="$router.push('/register')">注册</el-button>
          <!-- <el-button type="primary" @click="faceLog">人脸登录</el-button> -->
         <!-- <el-button type="primary" @click="$router.push('/faceLogin')">人脸登录</el-button> -->
        </el-form-item>
      </el-form>
      
      
    </div>
    <el-dialog
  title="请输入管理员专用码"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
 <el-input v-model="adminPSW" show-password></el-input>
   <div style="margin-top: 20px; display: flex; justify-content: right;">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>

   </div>
</el-dialog>
  </div>
</template>

<script>
import IdentifyCode from "../components/IdentifyCode";

export default {
  components: {
    "identify-code": IdentifyCode,
  },
  data() {
   
    return {
      loginForm: {
        username: "user1",
        password: "123456",
        identifyCode: "", // 添加验证码输入框绑定的数据
        role:'',
    
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "密码为 6~8 位", trigger: "blur" },
        ],
        identifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.identifyCode) {
                callback(new Error("验证码错误"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      identifyCodes: "0123456789",
      identifyCode: "",
      dialogVisible: false,
      adminPSW:'',
    }
  },
  computed: {
    isSuperAdmin() {
      return this.loginForm.role === 1;
    }
  },
  methods: {
    submit(){
      if(this.adminPSW === '123456'){
        this.dialogVisible = false
        this.$router.push('/faceLogin')
      }else{
        this.$message({
          message: '密码错误',
          type: 'error'
        });
      }
     
      
    },
    handleClose(done) {
        
            done();
         
    },
    handleRoleChange(value) {
      if (value === 1) {
        // 当选择超级管理员时，显示弹窗
        this.dialogVisible = true;
      }
    },
    // faceLog(){
    //   window.open('http://10.10.12.216:8081/','_blank')
    // },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    convertRole(role) {
    // 根据role的值返回对应的角色字符串
    return role === 1 ? "超级管理员" : "普通用户";
  },
    login() {
      // 在发送请求之前转换role
    const roleToSend = this.convertRole(this.loginForm.role);
    
        // validate方法：一个参数--一个布尔值，看验证是否成功
    this.$refs.loginFormRef.validate(async (valid) => {
      if (!valid) return;
      // 创建一个新的对象来发送到后端，包含转换后的role
      const formData = {
        ...this.loginForm,
        role: roleToSend // 使用转换后的角色值
      };
      // 调用post请求--访问后台
      const { data: res } = await this.$https.post("login", formData);
      console.log(res);
      
        // 重命名为res,res就是后端控制层return回来的
        if (res.flag == "ok") {
          this.$message({
        message: "登陆成功",
        type: 'success',
        duration: 1000 // 设置提示消失时间为1秒
      });
          //这个success也有样式
          window.sessionStorage.setItem("user", JSON.stringify(res.user)); //存储
          window.sessionStorage.setItem("token", JSON.stringify(res.token));
          console.log(res.token);

          if(res.user.role==='超级管理员'){
            console.log("管理员");
            
            this.$router.push({ path: "/manager" }); // 路由
          }
          else{
            console.log("用户"+res.user.role);
            
            this.$router.push({ path: "/yonghu" }); 
          }
        } else {
          console.log(78678);
          
          this.$message.error('请检查您的用户名密码或身份权限')
          this.loading = false
        }
      });
    //  }else{
    //   this.$message.error('请选择身份')
    //  }
    },
    //注册
   
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
    },
    
  },
  mounted() {
    this.makeCode(this.identifyCodes, 4);
  },
};
</script>
<style lang="less" scoped>
// 跟节点样式
.login_container {
  background: url("/src/assets/icon/home.webp") no-repeat 0 0;
  background-size: cover;
  // background-color: #2b4b6b;
  height: 100%;
  h1 {
    margin: 0;
    padding: 6%;
    display: flex;
    justify-content: center;
    top: 0%;
    font-size: 40px;
  }
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px; // 圆角
  position: absolute; // 绝对定位
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); // 根据自己位置 以自己为长度位移--居中
  opacity: 0.95;
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%; // 加圆角
    padding: 10px;
    box-shadow: 0 0 10px #ddd; // 盒子阴影
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #0ee;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%; // 加圆角
      background-color: #eee;
    }
  }
  .btns {
    display: flex; // 弹性布局
    justify-content: center; // 尾部对齐
  }
  .login_form {
    position: absolute;
    bottom: -5%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box; // 设置边框，不然突出来
    .identify-code-item {
      .identify-code-input {
        width: 60%;
        margin-right: 0%;
      }
      padding: 0%;
      margin-bottom: 4%;
      .code-image {
        cursor: pointer;
        width: 50%;
        position: absolute;
        top: -8%;
        right: -15%;
        margin-top: 0%;
      }
    }
  }
}
/* 样式保持不变，这里不再重复 */
</style>
