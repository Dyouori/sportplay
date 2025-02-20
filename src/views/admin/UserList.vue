<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体 -->
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-input placeholder="请输入搜索内容" clearable v-model="queryInfo.query" @clear="getUserList">
            <!-- 内容清除后再查询一遍 -->
            <el-button slot="append" icon="el-icon-search" @click="getNewUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 搜索按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
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
        <el-table-column align="center" label="余额" prop="money"></el-table-column>
        <el-table-column align="center" label="状态" prop="state">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 绑定了state的数据 -->
            <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false"><!--文字提示 enterable 隐藏-->
              <el-button type="warning" icon="el-icon-setting" size="mini"
                @click="ChangeRights(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 size-change每页最大变化  current-change当前最大变化 layout功能组件 -->
      <div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pageStart" :page-sizes="[1, 2, 5, 100]" :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <!-- 名字 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 真实姓名 -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
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

    <!-- 修改权限 -->
    <el-dialog title="修改用户权限" :visible.sync="changeDialogVisible" width="50%" @colse="changeDialogClosed">
      <el-form :model="changeForm" ref="changeFormRef" label-width="70px">
        <el-radio-group v-model="radio1">
          <el-radio-button label="超级管理员"></el-radio-button>
          <el-radio-button label="普通用户"></el-radio-button>
        </el-radio-group>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUserInfo">确 定</el-button>
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
        phone: '',
        name: '',
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
      },
      // 控制修改用户对话框显示/隐藏
      editDialogVisible: false,
      changeDialogVisible: false,
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
      //改变权限
      changeForm: {},
      ChangeRightId: "",
    };
  },


  methods: {

    //获取所有用户
    async getUserList() {
      // 调用post请求
      const { data: res } = await this.$https.get("alluser", {
        params: this.queryInfo,
      });
      this.userList = res.data; // 将返回数据赋值，数据封装
      this.total = res.numbers; // 总个数
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
    //当用户当前访问的页数不是第一页时，执行搜索会跳过当前页码之前的数据
    //问题分析：访问的页码数据 pagenumber在执行搜索按钮时会被当成分页需要的页码数，从而查出的数据缺失。
    getNewUserList() {
      this.queryInfo.pageStart = 1;
      this.getUserList();
    },
    //监听添加用户，看他是不是关闭了
    addDialogClosed() {
      this.$refs.addFormRef.resetFields(); //归零
    },
    //用户方法
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        try {
          const { data: res } = await this.$https.post("adduser", this.addForm);
          console.log(this.addForm);

          if (res === "success") {
            this.$message.success("操作成功");
            this.addDialogVisible = false;
            this.getUserList();
          } else if (res === "error2") {
            console.log("重复");
            this.$message.error("该用户已存在，请重新输入用户名");
          } else {
            this.$message.error("操作失败！");
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            // 这里处理400错误
            this.$message.error("该用户已存在，请重新输入用户名");
          } else {
            // 其他错误处理
            this.$message.error("请求失败，请稍后重试！");
          }
        }
      });
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
    async ChangeRights(id) {
      const { data: res } = await this.$https.get("getupdate?id=" + id);
      this.ChangeRightId = id;
      // 当调用ChangeRights函数并传入一个id时，它会发送一个HTTP请求到服务器，获取与该id相关的数据
      this.changeForm = res;
      this.changeDialogVisible = true;
    },
    //关掉修改权限窗口
    changeDialogClosed() {
      this.$refs.editFormRef.resetFields(); //重置信息
    },
    // 关闭编辑窗口
    editDialogClosed() {
      this.$refs.editFormRef.resetFields(); //重置信息
    },

    // 确认修改
   async editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$https.put("edituser", this.editForm);
        if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.editDialogVisible = false;
       // this.getUserList();
      });
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
