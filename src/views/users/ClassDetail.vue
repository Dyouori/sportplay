<template>
  <div>
    <div class="header"></div>

    <div class="detail">
      <div class="detail-content">
        <div class="detail-content-top">
          <div class="thing-infos-view">
            <!-- 课程图片，价钱等 -->
            <div class="things-info">
              <div class="img-box">
                <el-image
                  alt="Class Image"
                  style="width: 352px; height: 298px; border-radius: 4px"
                  :src="'http://localhost:9000/classes/' + this.classInfo.cover"
                  :preview-src-list="[
                    'http://localhost:9000/classes/' + this.classInfo.cover,
                  ]"
                >
                </el-image>
              </div>
              <div class="info-box">
                <h1 style="font-size: 30px">{{ this.classInfo.title }}</h1>
                <div class="desc">价格：{{ this.classInfo.price }}元</div>
                <div class="desc">负责教练：{{ this.classInfo.teacher }}</div>
                <div class="desc">
                  级别：<el-tag style="font-size: 16px">{{
                    this.classInfo.level
                  }}</el-tag>
                </div>
                <div class="desc">适用人群：{{ this.classInfo.suitable }}</div>
                <div class="desc description">
                  目标效果：{{ this.classInfo.effect }}
                </div>
              </div>
            </div>
            <!-- 点赞收藏分享 -->
            <div class="thing-counts">
              <div class="count-item">
                <div class="count-img">
                  <i
                    class="iconfont icon-shoucang"
                    :class="{ isLike: this.isLiked }"
                    @click="toggleLike"
                  ></i>
                </div>
                <div class="count-textt">喜欢</div>
                <div class="count-textt">{{ this.classInfo.wish_count }}</div>
              </div>
              <div class="count-item">
                <div class="count-img">
                  <i
                    class="iconfont icon-shoucang1"
                    :class="{ isCollect: this.isCollected }"
                    @click="toggleCollect"
                  ></i>
                </div>
                <div class="count-textt">收藏</div>
                <div class="count-textt">
                  {{ this.classInfo.collect_count }}
                </div>
              </div>
              <div class="count-item">
                <div class="count-img">
                  <i class="iconfont icon-fenxiang"></i>
                </div>
                <div class="count-textt">分享</div>
                <div class="count-textt">
                  <div
                    style="color: red; font-size: 36px; cursor: pointer"
                    class="iconfont icon-weibo"
                    @click="shareToWeibo"
                  ></div>
                </div>
              </div>
              <div class="pay">
                <el-button
                  v-if="!this.isPay"
                  size=""
                  type="primary"
                  @click="buyClass"
                >
                  购买课程
                </el-button>
                <el-button v-if="this.isPay" type="success" @click="playVideo">
                  已购买,点我播放
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-bottom">
          <div class="thing-content-view flex-view">
            <div class="main-content">
              <div class="order-view main-tab">
                <span
                  class="tab"
                  :class="{ 'tab-select': currentTab === 'intro' }"
                  @click="currentTab = 'intro'"
                  >简介</span
                >
                <span
                  class="tab"
                  :class="{ 'tab-select': currentTab === 'comment' }"
                  @click="currentTab = 'comment'"
                  >评论</span
                >
                <span
                  class="tab-underline"
                  :style="{ left: currentTab === 'intro' ? '6px' : '61px' }"
                ></span>
              </div>
              <!-- 简介 -->
              <div
                class="thing-intro"
                :class="{ hide: currentTab !== 'intro' }"
              >
                <p class="text">{{ this.classInfo.description }}</p>
              </div>
              <!-- 评论 -->
              <div
                class="thing-comment"
                :class="{ hide: currentTab !== 'comment' }"
              >
                <div class="title">发表新的评论</div>
                <div class="publish flex-view">
                  <img
                    src="https://jianshen.gitapp.cn/assets/avatar-d192b431.jpg"
                    class="mine-img"
                  />
                  <input
                    placeholder="说点什么..."
                    class="content-input"
                    ref="contentInput"
                  />
                  <button class="send-btn" @click="sendComment">发送</button>
                </div>
                <div class="tab-view flex-view">
                  <div class="count-text">
                    共有{{ commentList.length }}条评论
                  </div>
                  <div class="tab-box flex-view">
                    <span
                      :class="{ 'ctab-select': this.sortOrder === 'latest' }"
                      @click="setSortOrder('latest')"
                      >最新评论</span
                    >
                    <div class="line"></div>
                    <span
                      :class="{ 'ctab-select': this.sortOrder === 'oldest' }"
                      @click="setSortOrder('oldest')"
                      >最久评论</span
                    >
                  </div>
                </div>
                <div class="comments-list">
                  <div
                    class="comment-item"
                    v-for="(comment, index) in sortedComments"
                    :key="index"
                  >
                    <div class="flex-item flex-view">
                      <img
                        src="https://jianshen.gitapp.cn/assets/avatar-d192b431.jpg"
                        class="avator"
                      />
                      <div class="person">
                        <div class="name">{{ comment.user_name }}</div>
                        <div class="time">
                          {{ formatTime(comment.comment_time, true) }}
                        </div>
                        <!-- 调用方法并传入时间戳和flag -->
                        <p class="comment-content">{{ comment.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pages">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageStart"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="this.commentList.length"
                  ></el-pagination>
                </div>

                <div class="recommend"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-content">
        <div class="main-content"></div>
        <div class="recommend"></div>
      </div>
    </div>
    <VideoModal
      v-if="videoVisible"
      :videoVisible="videoVisible"
      @close="onCloseVideo"
    />
  </div>
</template>

<script>
import { getFormatTime } from "@/utils/datetime";
import VideoModal from "../users/profile/videoModal/PlayVideoModal.vue";
import Video from "./profile/videoModal/Video.vue";
export default {
  components: { VideoModal, Video },
  data() {
    return {
      classId: 0,
      classInfo: [],
      isLiked: false,
      isCollected: false,
      userId: 0,
      currentTab: "intro", // 默认选中简介 tab
      commentList: [],
      sortOrder: "latest", // 默认排序为最新评论
      //查询的数据
      queryInfo: {
        query: "", //查询信息
        pageStart: 1, //当前页
        pageSize: 5,
      },
      payData: {},
      isPay: false,
      queryInfoClass: {
        query: "", //查询信息，名字，string
        pageStart: 1, //当前页
        pageSize: 5,
        queryId: "",
      },
      videoUrl: null,
      videoVisible: false,
      payload:{},
      user_phone:'',
      user_name:'',
    };
  },
  computed: {
    sortedComments() {
      // 根据 sortOrder 计算属性来返回排序后的评论列表
      return this.commentList.sort((a, b) => {
        if (this.sortOrder === "latest") {
          return b.comment_time - a.comment_time; // 从新到旧排序
        } else {
          return a.comment_time - b.comment_time; // 从旧到新排序
        }
      });
    },
  },
  created() {
    this.classId = this.$route.query.id;
    this.userId = JSON.parse(sessionStorage.getItem("user")).id;
    this.user_name = JSON.parse(sessionStorage.getItem("user")).name;
    this.user_phone = JSON.parse(sessionStorage.getItem("user")).phone;
    
    this.getClassById();
    this.loadLocalStorageState();
    this.getUserComment();
    this.getOrder();
  },
  methods: {
    playVideo() {
      console.log("Playing video...");
      this.videoVisible = true;
    },
    onCloseVideo(type) {
      console.log("Closing video...");
      this.videoVisible = false;
    },
    async getOrder() {
      this.queryInfoClass.queryId = this.userId;
      const { data: res } = await this.$https.get("getorder", {
        params: this.queryInfoClass,
      });

      // 遍历返回的数组
      for (const item of res.data) {
        if (item.user_id == this.userId && item.class_id == this.classId) {
          // 如果存在，设置 this.isPay 为 true 并退出循环
          this.isPay = true;
          break;
        }
      }
    },

    buyClass() {
      this.$confirm(
        `您确定要购买价格为${this.classInfo.price}元的${this.classInfo.title}课程吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
  
         this.payData = {
            user_id: this.userId,
            class_id: this.classId,
            price: this.classInfo.price,
            status: "已支付",
            order_number:Math.floor(1000 + Math.random() * 9000),
            name: this.user_name,
            phone:this.user_phone
          };     
          const queryParams = new URLSearchParams(this.payData).toString();
          const { data: res } = await this.$https.get("addOrder?" + queryParams);
          this.$store
              .dispatch("payMoney", {
                user_id: this.userId,
                money: this.classInfo.price,
              })

          

          if (res === "success") {
            // 假设后端返回的数据结构中有 success 字段表示操作是否成功
            this.$message({
              type: "success",
              message: "购买成功!",
            });
            this.getOrder();
          } else {
            // 处理错误情况
            this.$message({
              type: "error",
              message: "购买失败: " + res.message, // 假设后端返回了错误消息
            });
          }
        })
    },

    // 最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserComment();
    },
    //pagesart触发,变化时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pageStart = newPage;
      this.getUserComment();
    },
    formatTime(dateTime, flag) {
      return getFormatTime(dateTime, flag);
    },
    shareToWeibo() {
      const shareUrl = `http://localhost:8080/#/showClass/classDetail?id=${encodeURIComponent(
        this.classId
      )}`;
      const weiboShareUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(
        shareUrl
      )}&sharesource=qzone&title=${encodeURIComponent(
        "我发现了一个非常好的课程，你也来看看吧~"
      )}&pics=你的分享图片地址&summary=你的分享描述&desc=你的分享简述`;
      window.location.href = weiboShareUrl;
    },
    async sendComment() {
      const data = {
        user_id: this.userId,
        class_id: this.classId,
        content: this.$refs.contentInput.value,
      };
      const res = await this.$https.post("sendComment", data);
      if (res.status === 200) {
        this.$message.success("评论成功!");
      } else {
        this.$message.error("评论失败!请重试");
      }
      this.getUserComment();
    },
    setSortOrder(order) {
      this.sortOrder = order; // 设置排序状态
    },
    async getUserComment() {
      const params = {
        ...this.queryInfo,
        id: this.classId,
      };
      const res = await this.$https.get("getUserComment", { params });
      this.commentList = res.data;
    },
    async getClassById() {
      const { data: res } = await this.$https.get("classDetail", {
        params: { id: this.classId },
      });
      if (res.code == 0) {
        this.classInfo = res.data[0];
      } else if (res.code == -1) {
        this.$message.error(res.msg);
      }
    },
    loadLocalStorageState() {
      // 从localStorage加载状态
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        const userData = JSON.parse(storedData);
        this.isLiked = userData.isLiked;
        this.isCollected = userData.isCollected;
      }
    },
    updateLocalStorage() {
      // 创建一个对象来包含要存储的数据
      const userData = {
        isLiked: this.isLiked,
        isCollected: this.isCollected,
      };
      // 将对象转换为JSON字符串并存储到localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
    },
    async toggleLike() {
      this.isLiked = !this.isLiked;
      // 更新localStorage中的状态
      this.updateLocalStorage();
      if (!this.isLiked) {
        await this.$https.get("unLiked", {
          params: { id: this.classId },
        });
        this.getClassById();
        this.classInfo.wish_count -= 1;
      } else {
        await this.$https.get("Liked", {
          params: { id: this.classId },
        });
        this.getClassById();
        this.classInfo.wish_count += 1;
      }
    },
    async toggleCollect() {
      this.isCollected = !this.isCollected;
      // 更新localStorage中的状态
      this.updateLocalStorage();
      if (!this.isCollected) {
        await this.$https.get("unCollected", {
          params: { id: this.classId, userId: this.userId },
        });

        this.getClassById();
        this.classInfo.collect_count -= 1;
      } else {
        await this.$https.get("Collected", {
          params: { id: this.classId, userId: this.userId },
        });
        this.getClassById();
        this.classInfo.collect_count += 1;
      }
    },
  },
};
</script>

<style scoped>
.description {
  width: 400px;
  line-height: 27px;
}
::v-deep .el-message-box {
  height: 300px !important;
}
.pay {
  margin-top: 57px;
}
.pages {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.header {
  width: 100%;
  height: 70px;
}
.detail {
  display: flex;
  /* 使用 Flexbox 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
  /* 确保父容器有高度，这里假设父容器高度为100% */
  width: 100%;
  /* 确保父容器有宽度，这里假设父容器宽度为100% */
}
.things-info {
  display: flex;
  /* 使用 Flexbox 布局 */
  width: 55%;
}
.thing-infos-view {
  display: flex;
  /* 使用 Flexbox 布局 */
  justify-content: space-between;
}
.detail-content,
.detail-content-top,
.thing-infos-view {
  width: 90%;
  margin: 0 auto;
}
.detail-content-bottom {
  width: 80%;
  margin: 0 auto;
}
.info-box {
  margin-left: 30px;
}
.desc {
  font-size: 18px;
  margin-top: 16px;
}
.thing-counts {
  width: 20%;
}
.count-item {
  display: flex;
  align-items: center;
}
.count-img {
  width: 40px;
  margin-top: 10px;
}
.count-img i {
  font-size: 30px;
  cursor: pointer;
}
.count-textt {
  margin-left: 10px;
  font-size: 25px;
  text-align: center;
}
.isLike {
  color: red;
}
.isCollect {
  color: rgb(228, 228, 4);
}
.thing-content-view {
  display: flex;
  margin-top: 15px;
  padding-bottom: 50px;
}
.main-content {
  flex: 1;
}
.order-view {
  position: relative;
  color: #6c6c6c;
  font-size: 14px;
  line-height: 40px;
}
.order-view .tab-select {
  color: #152844;
  font-weight: 600;
}
.order-view .tab {
  margin-right: 20px;
  color: #5f77a6;
  font-size: 16px;
  cursor: pointer;
}
.order-view .tab-underline {
  position: absolute;
  bottom: 0;
  left: 6px;
  width: 16px;
  height: 4px;
  background: #4684e2;
  transition: left 0.3s;
}
.hide {
  display: none;
}
.main-content .text {
  color: #484848;
  font-size: 16px;
  line-height: 26px;
  padding-left: 12px;
  margin: 11px 0;
  white-space: pre-wrap;
}
.thing-comment .title {
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  height: 22px;
  color: #152844;
  margin: 24px 0 12px;
}
.thing-comment .publish {
  align-items: center;
}
.thing-comment .publish .mine-img {
  flex: 0 0 40px;
  margin-right: 12px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
.thing-comment .publish .content-input {
  flex: 1;
  background: #f6f9fb;
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  color: #484848;
  padding: 5px 12px;
  white-space: nowrap;
  outline: none;
  border: 0px;
  font-size: 16px;
}
.thing-comment .publish .send-btn {
  margin-left: 10px;
  background: #4684e2;
  border-radius: 4px;
  flex: 0 0 80px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  height: 32px;
  line-height: 32px;
  outline: none;
  border: 0px;
  cursor: pointer;
}
.thing-comment .tab-view {
  justify-content: space-between;
  font-size: 14px;
  align-items: center;
  margin: 24px 0;
  display: flex;
}
.thing-comment .tab-view .count-text {
  color: #484848;
  float: left;
}
.thing-comment .tab-view .tab-box {
  color: #5f77a6;
  align-items: center;
}
.thing-comment .tab-view .tab-box .ctab-select {
  color: #152844; /* 确保这是你想要的颜色 */
  font-weight: 600; /* 如果需要加粗，可以添加这个属性 */
}

.thing-comment .tab-view .line {
  width: 1px;
  height: 12px;
  margin: 0 12px;
  background: #cedce4;
}
.thing-comment .tab-view .tab-box span {
  cursor: pointer;
}
.comments-list .comment-item .flex-item {
  align-items: center;
  padding-top: 16px;
}
.comments-list .comment-item .flex-item .avator {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  margin-right: 20px;
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 26px;
}
.comments-list .comment-item .flex-item .person {
  flex: 1;
  height: 76px;
}
.comments-list .comment-item .flex-item .name {
  color: #152844;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  height: 22px;
  cursor: pointer;
  margin-bottom: 8px;
}
.comments-list .comment-item .flex-item .time {
  color: #5f77a6;
  font-size: 15px;
  line-height: 16px;
  height: 16px;
  margin-bottom: 14px;
  margin-top: -7px;
}
.comments-list .comment-item .flex-item .float-right {
  color: #4684e2;
  font-size: 14px;
  float: right;
}
.comment-content {
  margin-top: 8px;
  color: #484848;
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #cedce4;
  margin-left: 52px;
  overflow: hidden;
  word-break: break-word;
}
.flex-view {
  display: flex;
}
.detail-content-bottom {
  width: 80%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 10px;
  margin-top: 27px;
  background-color: #f4fafd;
}
.comment-content {
  margin: 0;
  padding: 0;
}
</style>