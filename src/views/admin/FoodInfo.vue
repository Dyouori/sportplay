<template>
    <div>
      <!-- 搜索 -->
      <el-row :gutter="25">
        <el-col :span="5">
          <el-input
            placeholder="请输入搜索内容"
            clearable
            v-model="queryInfo.query"
            @clear="getFoodInfo"
          >
            <!-- 内容清除后再查询一遍 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getNewFoodInfoList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 搜索按钮 -->
        <el-col :span="3">
          <el-button type="primary" @click="addClassClick">添加新食物</el-button>
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
      <!-- 展示 -->
      <el-table
        ref="multipleTable"
        :data="foodInfoList"
        tooltip-effect="dark"
        style="width: 100%; font-size: 17px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="59"></el-table-column>
        <!-- 索引列 -->
        <el-table-column
          label="序号"
          width="100px"
          align="center"
          type="index"
        ></el-table-column>
  
        <el-table-column align="center" label="食物名称" width="200px" prop="food_name">
        </el-table-column>
        <el-table-column
          align="center"
          width="200px"
          label="食物种类"
          prop="food_type_title"
        ></el-table-column>
        <el-table-column
          width="230px"
          align="center"
          label="卡路里(每100g)"
          prop="calorie"
        >
        <template slot-scope="scope">
    {{ scope.row.calorie }} 大卡
  </template>
      </el-table-column>
        <el-table-column
          align="center"
          width="290px"   
          label="推荐指数" 
        >
        <template slot-scope="scope">
        <div class="block">
          <el-rate
            v-model="scope.row.score"
            :colors="colors"
            disabled
          ></el-rate>
        </div>
      </template>
    </el-table-column>
        
        <el-table-column label="操作" align="center" width="">
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
      <!-- 分页 size-change每页最大变化  current-change当前最大变化 layout功能组件 -->
      <div style="background-color: #fff">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageStart"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
  
      <!-- 修改对话框 -->
      <el-dialog
        title="修改课程信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
      <el-form  label-width="120px" :label-position="labelPosition"  :model="editForm" :rules="editFormRules" ref="editFormRef" >
      <el-form-item label="食物名称" prop="food_name">
            <el-input v-model="editForm.food_name"></el-input>
          </el-form-item>
          <el-form-item label="卡路里(每100g)" prop="calorie">
            <el-input v-model="editForm.calorie"></el-input>
          </el-form-item>
          <el-form-item label="食物种类" prop="food_type">
            <el-select
              v-model="editForm.food_type"
              placeholder="请选择食物种类"
            >
              <el-option
                v-for="item in foodTypeList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
         

          <el-form-item label="推荐指数" >
            <el-select
            v-model="editForm.score"
            placeholder="请选择推荐指数"
          >
            <el-option value="1" />
            <el-option value="2" />
            <el-option value="3" />
            <el-option value="4" />
            <el-option value="5" />
          </el-select>
          </el-form-item>
  
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editClassInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加分类 -->
      <el-dialog
        title="添加食物"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        
      >
        <el-form
        label-width="150px" 
        :label-position="labelPosition" 
          :model="addForm"
          :rules="rules"
          ref="addFormRef"
     
          class="demo-ruleForm"
        >
        <el-form-item label="食物名称" prop="food_name">
            <el-input v-model="addForm.food_name"></el-input>
          </el-form-item>
          <el-form-item label="食物种类" prop="food_type">
            <el-select
              v-model="addForm.food_type"
              placeholder="请选择食物种类"
            >
              <el-option
                v-for="item in foodTypeList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="卡路里(每100g)" prop="calorie">
            <el-input v-model="addForm.calorie"></el-input>
          </el-form-item>

         
          <el-form-item label="推荐指数" >
            <el-select
            v-model="addForm.score"
            placeholder="请选择推荐指数"
          >
            <el-option value="1" />
            <el-option value="2" />
            <el-option value="3" />
            <el-option value="4" />
            <el-option value="5" />
          </el-select>
          </el-form-item>

        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClass">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    created() {
      this.getFoodInfo();
    },
    data() {
      return {
        labelPosition:'left',
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' },
        //查询的数据
        queryInfo: {
          query: "", //查询信息
          pageStart: 1, //当前页
          pageSize: 5,
        },
        total: 0, //总记录数
        multipleSelection: [],
        //食物分类信息
        foodTypeList: [],
        //查询信息实体
        // 编辑
        editForm: {
           
        },
        // 控制修改用户对话框显示/隐藏
        editDialogVisible: false,
        // 添加新分类
        addForm: {
         food_name:'',
         food_type:'',
         calorie:'',
         score:'',
        },
        rules: {
          food_name: [{ required: true, message: "请输入食物名称", trigger: "blur" }],
         
          calorie: [
            { required: true, message: "请填写食物热量", trigger: "change" },
          ],
        
        },
        editFormRules: {
          title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
          description: [
            { required: false, message: "请填写课程描述", trigger: "change" },
          ],
          classification_id: [
            {
              type: "array",
              required: true,
              message: "请至少选择一个课程分类",
              trigger: "change",
            },
          ],
         
        },
        addDialogVisible: false, //添加对话框
        // 上传
        imageUrl: "",
        foodInfoList: [],
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
      // 最大数
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getFoodInfo();
      },
      //pagesart触发,变化时触发
      handleCurrentChange(newPage) {
        this.queryInfo.pageStart = newPage;
        this.getFoodInfo();
      },
      //获取食物列表
      async getFoodInfo() {
        // 调用post请求
        const { data: res } = await this.$https.get("allfood", {
          params: this.queryInfo,
        });
  
        this.foodInfoList = res.data; // 将返回数据赋值，数据封装
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
        const { data: res } = await this.$https.delete("deletefood?id=" + id);
        if (res !== "success") {
          return this.$message.error("删除失败");
        }
        this.$message.success("删除成功");
        this.getFoodInfo();
      },
        // 批量删除
     async handleBatchDelete() {
      this.$https
        .put("batchdeletefood", this.multipleSelection)
        .then((res) => {
          console.log(res); // 添加这一行来检查响应内容
          if (res.data === "success") {
            // 确保使用res.data来获取响应体
            this.$message.success("批量删除成功！");
            this.getFoodInfo(); // 重新获取分类列表
          }else {
            this.$message.error("批量删除失败！");
          }
        })
    },
      // 展示修改框,找出来要更新的那条数据
      async showEditDialog(id) {
       
        const { data: res } = await this.$https.get("getupdatefood?id=" + id);
        this.editForm = res;
        this.editDialogVisible = true;
        
        
        const { data: res2 } = await this.$https.get("allfoodtype", {
          params: this.queryInfo,
        });
        this.foodTypeList = res2.data;
        this.getFoodInfo();
      },
      // 关闭编辑窗口
      editDialogClosed() {
        this.$refs.editFormRef.resetFields(); //重置信息
      },
      // 确认修改
      editClassInfo() {
        this.$refs.editFormRef.validate(async (valid) => {
          if (!valid) return;
          // 发起请求
          const { data: res } = await this.$https.put(
            "editfood",
            this.editForm
          );
          if (res != "success") return this.$message.error("操作失败");
          this.$message.success("操作成功");
          //隐藏
          this.editDialogVisible = false;
          this.getFoodInfo();
        });
      },
      //监听添加用户，看他是不是关闭了
      addDialogClosed() {
        this.$refs.addFormRef.resetFields(); //归零
      },
      async addClassClick() {
        this.addDialogVisible = true;
        // 获取课程分类
        const { data: res2 } = await this.$https.get("allfoodtype", {
          params: this.queryInfo,
        });
        this.foodTypeList = res2.data;
      },
      //添加
      async addClass() {
        // 获取信息
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) return;
          try {
            const { data: res } = await this.$https.post("addfood", this.addForm);
            if (res === "success") {
              this.$message.success("操作成功");
              this.addDialogVisible = false;
              this.getFoodInfo();
            } else if (res === "error2") {
              this.$message.error("该课程已存在，请重新输入课程名");
            } else {
              this.$message.error("操作失败！");
            }
          } catch (error) {
            if (error.response && error.response.status === 400) {
              // 这里处理400错误
              this.$message.error("该课程已存在，请重新输入课程名");
            } else {
              // 其他错误处理
              this.$message.error("请求失败，请稍后重试！");
            }
          }
        });
      },
      // 搜索
      getNewFoodInfoList() {
        this.getFoodInfo();
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
  </style>
  