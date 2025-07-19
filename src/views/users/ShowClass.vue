<template>
  <div>
    <div class="content-top">
      <div class="left-search-item">
        <div class="label">分类:</div>
        <div class="c-list" >
          <div class="c-item-selected" @click="allClass">全部</div>
          <div
            class="c-item"
            v-for="item in typelist"
            :key="item.id"
            @click="setTypeQuery(item)"
          >
            {{ item.ctitle }}
          </div>
        </div>
      </div>
      <div class="left-search-item">
        <div class="label">等级:</div>
        <div class="c-list">
          <div class="c-item-selected" @click="allClass">全部</div>
          <div class="c-item"
           v-for="item in levelList"
           @click="setLevelQuery(item)"
           >
            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <div class="content-down">
      <div class="down-wrap">
        <div class="tab-view flex-view">
          <div class="tab" :class="{ 'tab-select': currentTab === 'latest' }" @click="handleLastClick('latest')">最新</div>
    <div class="tab" :class="{ 'tab-select': currentTab === 'hottest' }" @click="handleHotClick('hottest')">最热</div>
        </div>
        <div class="ant-spin-nested-loading">
          <div class="ant-spin-container">
            <el-empty  v-if="!showList || showList.length === 0" :image-size="200"></el-empty>
            <div class="pc-thing-list flex-view">
              <!-- 一个小课程 -->
              <div
                class="thing-item item-column"
                v-for="item in showList"
                :key="item.id"
              >
                <!-- 这是图片 -->
                <div class="img-view">
                  <el-image
                    alt="Class Image"
                    style="width: 200px; height: 200px; border-radius: 4px"
                    :src="'http://localhost:9000/classes/' + item.cover"
                    :preview-src-list="[
                      'http://localhost:9000/classes/' + item.cover,
                    ]"
                    @click="goToClassDetail(item.id)"
                  >
                  </el-image>
                </div>
                <!-- 课程信息 -->
                <div class="info-view">
                  <h3 class="thing-name">{{ item.title }}</h3>
                  <span>
                    <span class="a-price">{{ item.price }}元</span>
                    <span class="a-price">{{ item.recommendCount }}次点击</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-view"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typelist: [],
      showList: [],
      levelList: ["初级", "中级", "高级"],
      queryInfo: {
        query: "", //查询信息
        pageNum:1, 
        pageSize:12
      },
      classList: [],
      currentTab: 'hottest', // 默认选中“最新”
    };
  },
  created() {
    this.allClass();
    this.getType();
  },
  methods: {
    handleHotClick(){
      this.currentTab = 'hottest'; // 更新当前选中的标签
      this.sortShowList(); // 根据当前选中的标签排序
      this.showList.sort((a, b) => a.id - b.id);
    },
    handleLastClick(tab) {
      this.currentTab = 'latest'; // 更新当前选中的标签
      this.sortShowList(); // 根据当前选中的标签排序
    },
    sortShowList() {
      if (this.currentTab === 'latest') {
        // 按照id降序排序
        this.showList.sort((a, b) => b.id - a.id);
      } else if (this.currentTab === 'hottest') {
        // 按照recommend_count降序排序
        this.showList.sort((a, b) => b.recommend_count - a.recommend_count);
      }
    },
    // 获取类型
    async getType() {
      const { data: res } = await this.$https.get("allclassification", {
        params: this.queryInfo,
      });
      this.typelist = res.data; // 将返回数据赋值，数据封装
      this.total = res.numbers; // 总个数
    },
    //通过标签选择课程
    async getClass(item) {
      const { data: res } = await this.$https.get("oneTypeClass", {
        params: this.queryInfo,
      });
      this.showList = res.data;
    },
    // 根据标签选择
    setTypeQuery(item) {
        this.queryInfo.query = item.ctitle; // 当 div 被点击时，更新 queryInfo.query
        this.getClass();
    },
    async allClass(){
      // 调用post请求
      
      this.queryInfo.query="";
      const { data: res } = await this.$https.get("allclass", {
        params: this.queryInfo ,
      });

      this.showList = res.data; // 将返回数据赋值，数据封装
      this.total = res.numbers; // 总个数
    },
    async setLevelQuery(item){
     // console.log(item);
      const { data: res } = await this.$https.get("oneLevelClass?level="+item);
      this.showList = res.data;
    },
    goToClassDetail(id) {
      // 使用编程式导航跳转到/classDetail路由
      this.$router.push({
        path:'/showClass/classDetail',
        query: {
          id: id,
        },
      });
    }
  },
};
</script>

<style scoped>
.content-top {
  width: 80%;
  margin: 8px auto;
}
.left-search-item {
  overflow: hidden;
  margin: 16px 0;
  display: flex;
  flex-direction: row;
}
.label {
  color: #212121;
  font-weight: 600;
  font-size: 17px;
  margin-right: 12px;
  width: 40px;
  line-height: 27px;
}
.c-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
}
.c-item-selected {
  display: inline-block;
  cursor: pointer;
  margin: 2px 10px;
  font-weight: 700;
  font-size: 17px;
  color: #616161;
}
.c-item {
  display: inline-block;
  cursor: pointer;
  margin: 2px 10px;
  color: #212121;
  font-size: 16px;
}
.content-down {
  background: #e9eef5;
  min-height: 375px;
}

.content-down .down-wrap {
  display: flex;
  flex-direction: column; /* 修改为列布局 */
  gap: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
  flex: 1;
  width: 80%;
  margin: 0 auto;
}

/* 修改tab样式 */
.content-down .down-wrap .tab-view {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 非选中状态的tab样式 */
.content-down .down-wrap .tab-view .tab {
  background-color: #fff; /* 白色背景 */
  color: #616161; /* 黑色文字 */
  border-radius: 12px;
  height: 24px;
  line-height: 24px;
  padding: 0 12px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
/* 选中状态的tab样式 */
.content-down .down-wrap .tab-view .tab-select {
  background-color: #91beed;
  color: #fff;
  border-radius: 12px;
  height: 24px;
  line-height: 24px;
  padding: 0 12px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
.ant-spin-nested-loading {
  position: relative;
}
.ant-spin-container {
  position: relative;
  transition: opacity 0.3s;
}
.content-down .down-wrap .pc-thing-list {
  flex-wrap: wrap;
  gap: 20px;
}
.content-down .down-wrap .pc-thing-list .thing-item {
  width: calc((100% - 60px) / 4);
  position: relative;
  height: -moz-fit-content;
  height: fit-content;
  overflow: hidden;
  cursor: pointer;
  text-align: center;
}
.content-down .down-wrap .pc-thing-list .thing-item .img-view {
  width: 100%;
  aspect-ratio: 4 / 3;
}
.content-down .down-wrap .pc-thing-list .thing-item .img-view img {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  margin: 0 auto;
  background-size: cover;
  -o-object-fit: cover;
  object-fit: cover;
}
.content-down .down-wrap .pc-thing-list .thing-item .info-view {
  overflow: hidden;
  padding: 0;
  
}
.content-down .down-wrap .pc-thing-list .thing-item .info-view .thing-name {
  line-height: 20px;
  margin-top: 12px;
  font-size: 18px;
  color: #0f1111 !important;
  font-weight: 500;
  
}
.a-price {
  color: #0f1111;
  font-size: 14px;
  margin-right: 10px;
}
.content-down .down-wrap .flex-view {
  display: flex;
}
.flex-view {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  display: flex;
}
.content-down .down-wrap .tab-view {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.content-down .down-wrap .page-view {
  width: 100%;
  text-align: center;
  margin-top: 48px;
}
</style>
