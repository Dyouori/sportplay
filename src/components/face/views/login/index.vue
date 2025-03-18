<template>
  <div>
    <div class="login">
    </div>
    <!--登录中间块-->
    <div class="login-mid">
      <!--
      @date:2024-10-30
      新版本方式
      初次加载的时候，需要加载资源，确保你网络正常
      -->

      <div class="login-mid-top">
        <div class="shadow-top-left"></div>
        <div class="shadow-top-right"></div>
      </div>

      <div class="login-mid-mid" ref="effet"></div>

      <div class="login-mid-bot">
        <div class="shadow-bot-left"></div>
        <div class="shadow-bot-right"></div>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      videoWidth: 200,
      videoHeight: 200,
      msg:'',
      faceImgState:false,
      faceOption:{}
    };
  },
  mounted() {
 
    // 
    this.$faceEffet.init({
      el: this.$refs.effet,//将login-mid-mid的dom元素传递给人脸识别库
      callBack: this.callBack
    })

  },
  beforeDestroy(){
    if (this.$faceEffet){
      // 当页面销毁时，需要关闭
      this.$faceEffet.close();
    }
  },
  methods: {
    // 新版本调用后端
    callBack(data){
      if (data.progressMessage === 'success'){ // 判断阶段是否成功
        let array = data.base64Array;
        if (!data.base64Array || data.base64Array.length === 0){
          return;
        }
        Promise.all(data.base64Array).then((base64Strings) => {
          // base64Strings 是一个人脸图片数组
          // 这个是模拟请求后端接口，请切换你自己的请求接口
          this.$faceAxios.post('/face/vef',{imageBase:base64Strings[0]}).then(res=>{
            if (res.code === 200){
              // 登录成功
              this.$faceEffet.close();
              console.log(res);
              localStorage.setItem("token",res.userToken);
              localStorage.setItem("face_token",res.token);
              localStorage.setItem("username",res.name);
              this.$message.success(res.msg)
              this.$router.push("/manager")
            }else if (res.code === 201) {
              // 初始化人脸
              this.$faceEffet.restart()
              this.$message.success(res.msg)
            }else {
              // 登录失败 重启人脸容器，开始新的一轮验证
              this.$faceEffet.restart()
              this.$message.error(res.msg)
            }
          })
        }).catch((error) => {
          console.error("Error resolving promises:", error);
        });
      }
    },
  },
};
</script>
<style>
@import "./index.css";
</style>
