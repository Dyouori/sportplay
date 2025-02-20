<template>
    <div>
      <!-- 搜索 -->
      <el-row :gutter="25">
        <el-col :span="5">
          <el-input
            placeholder="请输入搜索内容"
            clearable
            v-model="queryInfo.query"
            @clear="getFoodTypeList"
          >
            <!-- 内容清除后再查询一遍 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getNewFoodTypeList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 搜索按钮 -->
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加新分类</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            type="danger"
            @click="handleBatchDelete"
            :disabled="multipleSelection.length > 0 ? false : true"
            >批量删除</el-button
          >
        </el-col>
      </el-row>
  
      <el-table
        :row-key="(row) => row.id"
        ref="multipleTable"
        :data="foodTypeList"
        tooltip-effect="dark"
        style="width: 100%; font-size: 17px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="分类名称" width="920%" prop="title">
        </el-table-column>
  
        <el-table-column label="操作" align="center" width="400px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 统计数据 -->
      <el-row style="background-color: #fff">
        <el-col
          :span="21"
          style="
            font-size: 18px;
            text-align: right;
            padding-top: 10px;
            background-color: #fff;
            color: #a49f9f;
          "
        >
          <div style="right: 0px !important">共 {{ total }} 条数据</div>
        </el-col>
      </el-row>
      <!-- 修改对话框 -->
      <el-dialog
        title="修改分类信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form :model="editForm" ref="editFormRef" label-width="70px">
          <!-- 名称 -->
          <el-form-item label="分类名" prop="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editClassifiInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加分类 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form :model="addForm" ref="addFormRef" label-width="70px">
          <!-- 名字 -->
          <el-form-item label="分类名" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClassifi">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    created() {
      this.getFoodTypeList();
    },
    data() {
      return {
        //查询的数据
        queryInfo: {
          query: "", //查询信息
        },
        total: 0, //总记录数
        multipleSelection: [],
        // 分类列表
        foodTypeList: [],
        //查询信息实体
        // 编辑
        editForm: {},
        // 控制修改用户对话框显示/隐藏
        editDialogVisible: false,
        // 添加新分类
        addForm: {
          title: "",
        },
        addDialogVisible: false, //添加对话框
        ids: [],
      };
    },
  
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取分类列表
      async getFoodTypeList() {
        // 调用post请求
        const { data: res } = await this.$https.get("allfoodtype", {
          params: this.queryInfo,
        });
        this.foodTypeList = res.data; // 将返回数据赋值，数据封装
        this.total = res.numbers; // 总个数
      },
  
      //   删除分类
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
        const { data: res } = await this.$https.delete("deletefoodtype?id=" + id);
        if (res !== "success") {
          return this.$message.error("删除失败");
        }
        this.$message.success("删除成功");
        this.getFoodTypeList();
      },
      // 批量删除
      async handleBatchDelete() {
        this.$https
          .put("batchdeletetype", this.multipleSelection)
          .then((res) => {
            console.log(res); // 添加这一行来检查响应内容
            if (res.data === "success") {
              // 确保使用res.data来获取响应体
              this.$message.success("批量删除成功！");
              this.getFoodTypeList(); // 重新获取分类列表
            } else if (res === "error2") {
              console.log("重复");
              this.$message.error("该分类已存在，请重新添加");
            } else {
              this.$message.error("批量删除失败！");
            }
          })
          .catch((error) => {
            console.error("Error during batch delete:", error);
            this.$message.error("批量删除失败！");
          });
      },
      // 展示修改框,找出来要更新的那条数据
      async showEditDialog(id) {
        //
        // 在用户进行编辑之前，展示出当前的数据状态是非常重要的。这允许用户在已有数据的基础上进行修改，而不是从头开始填写所有信息。
        const { data: res } = await this.$https.get("updatefoodtype?id=" + id);
        this.editForm = res;
        this.editDialogVisible = true;
      },
      // 关闭编辑窗口
      editDialogClosed() {
        this.$refs.editFormRef.resetFields(); //重置信息
      },
      // 确认修改
      editClassifiInfo() {
        this.$refs.editFormRef.validate(async (valid) => {
          if (!valid) return;
          // 发起请求
          const { data: res } = await this.$https.put(
            "editfoodtype",
            this.editForm
          );
          if (res != "success") return this.$message.error("操作失败");
          this.$message.success("操作成功");
          //隐藏
          this.editDialogVisible = false;
          this.getFoodTypeList();
        });
      },
      //监听添加用户，看他是不是关闭了
      addDialogClosed() {
        this.$refs.addFormRef.resetFields(); //归零
      },
      //用户方法
      addClassifi() {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) return;
          const { data: res } = await this.$https.post(
            "addfoodtype",
            this.addForm
          );
          if (res === "success") {
            this.$message.success("操作成功");
            this.addDialogVisible = false;
            this.getFoodTypeList();
          } else {
            this.$message.error("操作失败！");
          }
        });
      },
      // 搜索
      getNewFoodTypeList() {
        this.getFoodTypeList();
      },
    },
  };
  </script>
  
  <style scoped></style>
  