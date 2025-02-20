<template>
  <div>
    <!-- 搜索 -->
    <el-row :gutter="25">
      <el-col :span="5">
        <el-input
          placeholder="请输入搜索内容"
          clearable
          v-model="queryInfo.query"
          @clear="getClassList"
        >
          <!-- 内容清除后再查询一遍 -->
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getNewClassList"
          ></el-button>
        </el-input>
      </el-col>
      <!-- 搜索按钮 -->
      <el-col :span="2">
        <el-button type="primary" @click="addClassClick">添加新课程</el-button>
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
      :data="classList"
      tooltip-effect="dark"
      style="width: 100%; font-size: 17px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- 索引列 -->
      <el-table-column
        label="序号"
        width="60px"
        align="center"
        type="index"
      ></el-table-column>

      <el-table-column  align="center" label="课程名称" width="180px" prop="title">
      </el-table-column>
      <el-table-column
        align="center"
        width="100px"
        label="价格"
        prop="price"
      ></el-table-column>
      <el-table-column
        width="100px"
        label="级别"
        prop="level"
      ></el-table-column>
      <el-table-column
        align="center"
        width="100px"
        label="适用人群"
        prop="suitable"
      ></el-table-column>
      <el-table-column
        align="center"
        label="类别"
        prop="classification_title"
      ></el-table-column>
      <el-table-column align="center" label="封面" prop="cover">
        <template v-slot="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="'http://localhost:9000/classes/'+scope.row.cover"
            :preview-src-list="['http://localhost:9000/classes/'+scope.row.cover]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        prop="status"
      ></el-table-column>
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
    <el-form  label-width="80px"  :model="editForm" :rules="editFormRules" ref="editFormRef" >
    <el-form-item label="课程名称" prop="title">
          <el-input  v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="课程分类" prop="">
          <el-select
            v-model="editForm.classification_id"
            placeholder="请选择课程分类"
          >
            <el-option
              v-for="item in classificationList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程讲师" prop="teacher">
          <el-input v-model="editForm.teacher"></el-input>
        </el-form-item>

        <el-form-item prop="cover" label="封面图">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:9000/classes/cover"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
             align="center"
          >
            <img v-if="'http://localhost:9000/classes/'+editForm.cover" 
            :src="'http://localhost:9000/classes/'+editForm.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <a style="font-size: 13px;">点击上传</a>
          </el-upload>
        </el-form-item>

        <el-form-item label="课程简介" prop="description">
          <el-input
        
            type="textarea"
            maxlength="100"
            v-model="editForm.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="price">
      
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>

        <el-form-item label="级别" prop="level">
          <el-select v-model="editForm.level" placeholder="请选择课程级别·">
            <el-option label="初级" value="初级"></el-option>
            <el-option label="中级" value="中级"></el-option>
            <el-option label="高级" value="高级"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="适合人群" prop="suitable">
          <el-input  v-model="editForm.suitable"></el-input>
        </el-form-item>

        <el-form-item  label="目标效果" prop="effect">
          <el-input  v-model="editForm.effect"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="请选择课程状态">
            <el-option label="上架" value="上架"></el-option>
            <el-option label="下架" value="下架"></el-option>
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
      title="添加课程"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-width="120px" :label-position="labelPosition" 
        class="demo-ruleForm"
      >
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="课程分类" prop="">
          <el-select
            v-model="addForm.classification_id"
            placeholder="请选择课程分类"
          >
            <el-option
              v-for="item in classificationList"
              :key="item.title"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程讲师" prop="teacher">
          <el-input v-model="addForm.teacher"></el-input>
        </el-form-item>

        <el-form-item label="上传封面" prop="cover">
          <el-upload
          align="center"
            class="avatar-uploader"
            action="http://localhost:9000/classes/cover"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="课程简介" prop="description">
          <el-input
            type="textarea"
            maxlength="100"
            v-model="addForm.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>

        <el-form-item label="级别" prop="level">
          <el-select v-model="addForm.level" placeholder="请选择课程级别·">
            <el-option label="初级" value="初级"></el-option>
            <el-option label="中级" value="中级"></el-option>
            <el-option label="高级" value="高级"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="适合人群" prop="suitable">
          <el-input v-model="addForm.suitable"></el-input>
        </el-form-item>

        <el-form-item label="目标效果" prop="effect">
          <el-input v-model="addForm.effect"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="addForm.status" placeholder="请选择课程状态">
            <el-option label="上架" value="上架"></el-option>
            <el-option label="下架" value="下架"></el-option>
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
    this.getClassList();
  },
  data() {
    return {
      labelPosition:'left',
      //查询的数据
      queryInfo: {
        query: "", //查询信息
        pageStart: 1, //当前页
        pageSize: 5,
      },
      total: 0, //总记录数
      multipleSelection: [],
      // 课程列表
      classList: [],
      //查询信息实体
      // 编辑
      editForm: {
        cover:'',
      },
      // 控制修改用户对话框显示/隐藏
      editDialogVisible: false,
      // 添加新分类
      addForm: {
        title: "",
        cover: "",
        description: "",
        price: "",
        level: "",
        suitable: "",
        effect: "",
        teacher: "",
        status: "",
        classification_id: "",
      },
      rules: {
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
        price: [
          { required: true, message: "请制定课程定价", trigger: "change" },
        ],
        level: [{ required: true, message: "请选择课程等级", trigger: "blur" }],
        status: [
          {
            type: "array",
            required: true,
            message: "请选择课程状态",
            trigger: "blur",
          },
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
        price: [
          { required: true, message: "请制定课程定价", trigger: "change" },
        ],
        level: [{ required: true, message: "请选择课程等级", trigger: "blur" }],
        status: [
          {
            type: "array",
            required: true,
            message: "请选择课程状态",
            trigger: "blur",
          },
        ],
      },
      addDialogVisible: false, //添加对话框
      // 上传
      imageUrl: "",
      classificationList: [],
      multipleSelection: [],
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
      this.getClassList();
    },
    //pagesart触发,变化时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pageStart = newPage;
      this.getClassList();
    },
    //获取课程列表
    async getClassList() {
      // 调用post请求
      const { data: res } = await this.$https.get("allclass", {
        params: this.queryInfo,
      });

      this.classList = res.data; // 将返回数据赋值，数据封装
      //  console.log(this.classList);
      this.total = res.numbers; // 总个数
    },
    //成功上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.addForm.cover = res;
      this.editForm.cover =res;
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
      const { data: res } = await this.$https.delete("deleteclass?id=" + id);
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getClassList();
    },
    // 展示修改框,找出来要更新的那条数据
    async showEditDialog(id) {
     
      const { data: res } = await this.$https.get("getupdateclass?id=" + id);
      this.editForm = res;
      this.editDialogVisible = true;
      this.imageUrl = 'http://localhost:9000/files/upload'+this.editForm.cover;
      // 获取课程分类
      const { data: res2 } = await this.$https.get("allclassification", {
        params: this.queryInfo,
      });
      this.classificationList = res2.data;
      this.getClassList();
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
          "editclass",
          this.editForm
        );
        if (res != "success") return this.$message.error("操作失败");
        this.$message.success("操作成功");
        //隐藏
        this.editDialogVisible = false;
        this.getClassList();
      });
    },
    //监听添加用户，看他是不是关闭了
    addDialogClosed() {
      this.$refs.addFormRef.resetFields(); //归零
    },
    async addClassClick() {
      this.addDialogVisible = true;
      // 获取课程分类
      const { data: res2 } = await this.$https.get("allclassification", {
        params: this.queryInfo,
      });
      this.classificationList = res2.data;
      console.log(this.classificationList);
      

    },
    //添加
    async addClass() {
      // 获取信息
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        try {
          const { data: res } = await this.$https.post("addclass", this.addForm);
         

          if (res === "success") {
            this.$message.success("操作成功");
            this.addDialogVisible = false;
            this.getClassList();
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
    getNewClassList() {
      this.getClassList();
    },
     // 批量删除
     async handleBatchDelete() {
      this.$https
        .put("batchdeleteclass", this.multipleSelection)
        .then((res) => {
          console.log(res); // 添加这一行来检查响应内容
          if (res.data === "success") {
            // 确保使用res.data来获取响应体
            this.$message.success("批量删除成功！");
            this.getClassList(); // 重新获取分类列表
          }else {
            this.$message.error("批量删除失败！");
          }
        })
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
