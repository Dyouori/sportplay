<template>
  <div class="demo-image">
    <div class="block" v-for="fit in fitsUrl" :key="fit.url">
      <div class="image-container">
        <el-image
          class="im"
          style="width: 200px; height: 200px"
          :src="fit.url"
          fit="fill"
        ></el-image>
        <div class="image-text">{{ fit.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fitsUrl: [
        {
          url: require("@/assets/images/sportImg/跑步.jpg"),
          description: "跑步",
        },
        {
          url: require("@/assets/images/sportImg/跳绳.jpeg"),
          description: "跳绳",
        },
        {
          url: require("@/assets/images/sportImg/瑜伽.webp"),
          description: "瑜伽",
        },
        {
          url: require("@/assets/images/sportImg/骑车.webp"),
          description: "骑车",
        },
        {
          url: require("@/assets/images/sportImg/游泳.webp"),
          description: "游泳",
        },
        {
          url: require("@/assets/images/sportImg/登山.webp"),
          description: "登山",
        },
        {
          url: require("@/assets/images/sportImg/太极拳.webp"),
          description: "太极拳",
        },
        {
          url: require("@/assets/images/sportImg/健身操.webp"),
          description: "健身操",
        },
      ],
    };
  },
};
</script>

<style scoped lang="less">
.demo-image {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.block {
  flex: 0 0 18%; /* 每个图片块占据25%的宽度 */
  max-width: 25%; /* 限制最大宽度 */
  padding: 16px; /* 添加一些内边距 */
  margin: 14px;
  position: relative; /* 为阴影效果设置相对定位 */
}

.im {
  width: 100%; /* 图片宽度填满其父元素 */
  height: auto; /* 高度自适应，保持图片的宽高比 */
  transition: transform 0.3s ease-in-out; /* 设置变换过渡效果 */
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-text {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  color: #fff; /* 文字颜色 */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0; /* 默认不显示 */
  transition: opacity 0.3s ease; /* 淡入淡出效果 */
  font-weight: bold;
}

.block:hover .image-text {
  opacity: 1; /* 鼠标悬停时显示文字 */
}

.block:hover .im {
  transform: scale(1.1); /* 图片放大 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
}

</style>
