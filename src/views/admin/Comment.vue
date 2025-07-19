<template>
  <div>
    <!-- 隔行变色 -->
    <el-table :data="commentList" :border="true" style="font-size: 16px">
      <!-- 索引列 -->
      <el-table-column align="center" type="index"></el-table-column>
      <!-- 表格 -->
      <el-table-column
        align="center"
        label="用户名"
        prop="username"
      ></el-table-column>
      <el-table-column
        align="center"
        width="300px"
        label="评论内容"
        prop="content"
      >
      <template slot-scope="scope">
      <el-tooltip effect="dark" :content="scope.row.content" placement="top">
        <div class="comment-content">{{ scope.row.content }}</div>
      </el-tooltip>
    </template>
    
    </el-table-column>
      <el-table-column
        width="250px"
        align="center"
        label="评论课程"
        prop="title"
      ></el-table-column>
      <el-table-column
      width="250px"
        align="center"
        label="发布时间"
        prop="commentTime"
      ></el-table-column>
      <el-table-column
        align="center"
         width="300px"
        label="邮箱"
        prop="email"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteComment(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-message" size="mini" @click="toEmail(scope.row)"></el-button>
        </template>
      </el-table-column>
      
    </el-table>
    <el-pagination
    style="margin-top: 15px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageStart"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
  </div>
</template>

<script>
import { get } from 'jquery';

export default {
  data() {
    return {
      commentList: [],
      queryInfo: {
        page: 1,
        size: 10,
      },
      total: 0,
    };
  },
  created(){
    this.getCommentList();
  },
  methods: {
    toEmail(item){
            location.href=hash['163.com'];
    },
    async deleteComment(item){
        const confirmResult = await this.$confirm(
        "此操作将永久删除评论，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$https.delete("deleteComment?id=" + item.id);
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getCommentList();
        
    },
    async getCommentList() {
        const { data: res } = await this.$https.get("getcomment", {
          params: this.queryInfo,
        });
        this.total = res.numbers;
        this.commentList = res.data;
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
  },
};
</script>

<style scoped>
.comment-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>