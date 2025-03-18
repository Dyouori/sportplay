<template>
    <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体 -->
    <!-- 卡片视图区 -->
    <el-card>
    
      <!-- 表格 -->
      <!-- 隔行变色 -->
      <el-table :data="userList" :border="true" stripe style="font-size: 16px">
        <!-- 索引列 -->
        <el-table-column align="center" type="index"></el-table-column>
        <!-- 表格 -->
        <el-table-column align="center" width="100px" label="用户名" prop="username"></el-table-column>
        <el-table-column align="center" width="200px" label="邮箱" prop="email"></el-table-column>
        <el-table-column align="center" label="密码" prop="password"></el-table-column>
        <el-table-column align="center" label="角色" prop="role"></el-table-column>
        <el-table-column align="center" label="姓名" prop="name"></el-table-column>
        <el-table-column align="center" label="手机号" prop="phone"></el-table-column>
        
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
       
    
          </template>
        </el-table-column>
      </el-table>
    
    </el-card>
   
    <!-- 修改对话框 -->
    <el-dialog title="修改个人信息" :visible.sync="editDialogVisible" width="50%" @colse="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
         <!-- 真实姓名 -->
         <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    return {
      // 权限
      radio1: "普通用户",

      //查询信息实体
      queryInfo: {
        query: "", //查询信息
        pageStart: 1, //当前页
        pageSize: 5,
      },
      userList: [],
      total: 0, //总记录数
      addDialogVisible: false, //对话框状态
      //添加表单信息
      addForm: {
        username: "",
        password: "",
        email: "",
      },
      //表单验证
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" },
        ],
        phone:[
        { required: true, message: "请输入电话", trigger: "blur" },
        { min: 11, max: 11, message: "请输入正确电话号码", trigger: "blur" },
        ]
      },
      // 控制修改用户对话框显示/隐藏
      editDialogVisible: false,
      changeDialogVisible: false,
      //修改用户信息
      editForm: {},
      // 修改用户表单验证规则
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" },
        ],
        phone:[
        { required: true, message: "请输入电话", trigger: "blur" },
        { min: 11, max: 11, message: "请输入正确电话号码", trigger: "blur" },
        ]
      },
      //改变权限
      changeForm: {},
      ChangeRightId: "",
    };
  },
  methods: {
    //获取所有用户
    async getUserList() {
      // 调用post请求
      // 获取存储的用户名
  var username = 1
  //JSON.parse(sessionStorage.getItem("user")).username;
  
  // 构建带有查询参数的URL
  // const url = `alladmin?username=${encodeURIComponent(username)}`;
  
  // // 调用get请求
  // const { data: res } = await this.$https.get(url);
  //     this.userList = res.data; // 将返回数据赋值，数据封装
  //     this.total = res.numbers; // 总个数
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
    async userStateChanged(userInfo) {
      const { data: res } = await this.$https.put(
        `userstate?id=${userInfo.id}&state=${userInfo.state}`
      );
      if (res != "success") {
        userInfo.id = !userInfo.id;
        return this.$message.error("操作失败");
      }
      this.$message.success("操作成功");
    },

    getNewUserList() {
      this.queryInfo.pageStart = 1;
      this.getUserList();
    },
    //监听添加用户，看他是不是关闭了
    addDialogClosed() {
      this.$refs.addFormRef.resetFields(); //归零
    },
    
    //删除
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除用户，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果用户确认删除，confirmResult 将是 'confirm'
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$https.delete("deleteUser?id=" + id);
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getUserList();
    },
    // 展示修改框
    async showEditDialog(id) {
      const { data: res } = await this.$https.get("getupdateUser?id=" + id);
      this.editForm = res;
      this.editDialogVisible = true;
    },
   
    // 关闭编辑窗口
    editDialogClosed() {
      this.$refs.editFormRef.resetFields(); //重置信息
    },

    // 确认修改
    editUserInfo() {

      if (
        this.editForm.phone &&
        !this.$validate.isMobile(this.editForm.phone)
      ) {
        this.$message.error("手机应输入正确格式");
        return;
      }

      if (
        this.editForm.email &&
        !this.$validate.isEmail(this.editForm.email)
      ) {
        this.$message.error("邮箱应输入邮件格式");
        return;
      }
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$https.put("edituser", this.editForm);
        if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
//修改信息
    changeUserInfo() {
      console.log(this.ChangeRightId + "////");
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
  },
};
</script>

<style scoped lang="less">
/* 面包屑样式 */
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
