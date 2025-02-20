<template>
  <div>
    <div class="container">
      <el-col :span="20">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane align="center" label="基本资料" name="userinfo">
              <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
                label-width="70px"
                v-if="activeTab === 'userinfo'"
              >
                <el-form-item prop="pic">
                  <el-upload
                    class="avatar-uploader"
                    action="http://localhost:9000/avaters/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    align="center"
                  >
                    <img
                      style="width: 150px; height: 150px"
                      v-if="'http://localhost:9000/avaters/' + editForm.pic"
                      :src="'http://localhost:9000/avaters/' + editForm.pic"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <a style="font-size: 13px">点击上传</a>
                  </el-upload>
                </el-form-item>
                <!-- 用户名 -->
                <el-form-item style="width: 60%" label="用户名" prop="username">
                  <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item style="width: 60%" label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <!-- 真实姓名 -->
                <el-form-item style="width: 60%" label="姓名" prop="name">
                  <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <!-- 电话 -->
                <el-form-item style="width: 60%" label="电话" prop="phone">
                  <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
              </el-form>
              <div class="button-footer">
                
                <el-button type="primary" @click="editUserInfo"
                  >确 定</el-button>
                <el-button type="danger" @click="editDialogVisible = false">取 消</el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="修改密码" name="resetPwd">
              <el-form
                ref="form"
                :model="user"
                :rules="rules"
                label-width="80px"
              >
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input
                    v-model="user.oldPassword"
                    placeholder="请输入旧密码"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="user.newPassword"
                    placeholder="请输入新密码"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="user.confirmPassword"
                    placeholder="请确认新密码"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item>
                    
                  <el-button type="primary" @click="submit"
                    >确 定</el-button
                  >
                  <el-button type="danger"  @click="close"
                    >取 消</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    // 获取存储的用户信息字符串
    var userString = window.sessionStorage.getItem("user");

    // 将字符串转换回JavaScript对象
    var user = JSON.parse(userString);
    this.userId = user.id;
  
    this.getUser();
  },
  data() {
    return {
      userPSW: "",
      user: {
        oldPassword: "", // 确保这里有一个初始值
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
          {
            pattern: /^[^<>"'|\\]+$/,
            message: "不能包含非法字符：< > \" ' \\\ |",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: this.equalToPassword, trigger: "blur" },
        ],
      },
      activeTab: "userinfo", // 默认激活的标签页
      userId: "",
      //修改用户信息
      editForm: {},
      // 修改用户表单验证规则
      editFormRules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 5, max: 19, message: "请输入正确邮箱地址", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    equalToPassword(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    //成功上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.editForm.pic = res;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 确认修改
    async editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起请求

        const { data: res } = await this.$https.put("edituser", this.editForm);
        if (res === "error2")
          return this.$message.error("已有此用户，请重新输入");
        else if (res === "success") {
          this.$message.success("操作成功");
        } else {
          this.$message.success("操作失败");
        }
        //隐藏
        this.editDialogVisible = false;
        this.getUser();
      });
    },
    async getUser() {
      const { data: res } = await this.$https.get(
        "getupdateUser?id=" + this.userId
      );
      this.editForm = res;
    },
    changeUserInfo() {
      this.$refs.changeFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$https.put("changeUser", null, {
          params: {
            role: this.radio1,
            id: this.ChangeRightId,
          },
        });
        if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        // 隐藏
        this.changeDialogVisible = false;
        this.getUserList();
      });
      console.log(this.radio1);
    },
    async submit() {
      if (this.userPSW !== this.user.oldPassword) {
        return this.$message.error("旧密码不正确请重新输入");
      } else {
        this.editForm.password = this.user.newPassword;   
        const { data: res } = await this.$https.put("edituser", this.editForm);

        if (res === "success") {
          this.$message.success("操作成功");
        } else {
          this.$message.success("操作失败");
        }
        this.getUser();
      }
    },
    close() {
      this.$tab.closePage();
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.container {
  margin: 0;
}
el-form {
  width: 100%;
}
el-card {
  padding: 0;
}
/* 移除 el-card 的边框 */
.el-card {
  border: none;
}
.el-tabs {
  border: none;
}
.el-tab-pane {
  border-bottom: none;
}
</style>
