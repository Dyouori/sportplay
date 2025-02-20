<template >
    <div >
      <!-- header头部 -->
     <!--  <header class="header">
        <a href="#" class="logo">Tours.</a>
        <div class="social-media">
          <a href="#"><i class="iconfont icon-weixin"></i></a>
          <a href="#"><i class="iconfont icon-QQ"></i></a>
          <a href="#"><i class="iconfont icon-xinlangweibo"></i></a>
          <a href="#"><i class="iconfont icon-douyin"></i></a>
        </div>
  
        <nav class="navbar">
          <a href="#">Destinations</a>
          <a href="#">Booking</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
        </nav>
      </header> -->
      <!-- section内容主题 -->
      <section  class="banner">
        <!-- 轮播图 -->
        <div class="slider" style="width: 100%;height: 100%;">
          <div class="slide" v-for="(slide, index) in slides" :key="index" :class="{ active: activeSlide === index }">
            <img :src="slide.image" />
            <div class="left-info">
              <div class="penetrte-blur">
                <h1>{{ slide.prefix }}</h1>
              </div>
              <div class="content">
                <h3>{{ slide.title }}</h3>
                <p>{{ slide.description }}</p>
                <a href="#" class="btn" @click="jump(index)">More Details</a>
              </div>
            </div>
            <div class="right-info">
              <h1>{{ slide.suffix }}</h1>
              <h3>For Ourselves</h3>
            </div>
          </div>
        </div>
        <div class="navigation">
          <span class="prev-btn" @click="prevSlide"><i class="bx bx-chevron-left"></i></span>
          <span class="next-btn" @click="nextSlide"><i class="bx bx-chevron-right"></i></span>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeSlide: 0,
        slides: [
          { image: require('/src/views/users/img/yundong.jpg'), prefix: '运', suffix: '动', title: '01.燃情运动，绽放生命活力', description: '运动，不仅仅是身体的活动，更是一种生活态度的体现。它能够唤醒沉睡的身体潜能，激发内心的活力源泉。每一次奔跑、每一次跳跃，都是对自我挑战的勇敢回应，对健康生活的执着追求。让运动成为日常的仪式，让汗水见证成长的足迹，让活力四射的你，在运动中绽放最耀眼的光芒。' },
          { image: require('/src/views/users/img/jiankang.jpg'), prefix: '健', suffix: '康', title: '02.守护健康，筑梦美好未来', description: '健康是幸福生活的基石，是追求梦想的源动力。它不是偶然的恩赐，而是日常点滴积累的成果。均衡饮食、适量运动、良好作息，每一项都是维护健康的必要条件。让我们用心呵护每一刻的健康，用行动铸就坚实的身体防线，让健康成为我们通往美好未来的通行证。' },
          // ...其他幻灯片数据
        ],
        timer: null, // 用于存储定时器 ID
        interval: 3000, // 轮播间隔时间，单位为毫秒
      };
    },
    mounted() {
    this.startSlideShow(); // 组件挂载后启动轮播
  },
    methods: {
      prevSlide() {
        this.activeSlide = (this.activeSlide - 1 + this.slides.length) % this.slides.length;
      },
      nextSlide() {
        this.activeSlide = (this.activeSlide + 1) % this.slides.length;
      },
      startSlideShow(){
        this.timer = setInterval(()=>{
            this.nextSlide();
        },this.interval)
      },
      stopSlideShow(){
        clearInterval(this.timer);
      },
      jump(index){
        console.log(index);
        
        if(index===0){
            this.$router.push('/showClass')
        }
        else if(index===1){
            this.$router.push('/foodHealth')
        }
      }
    },
    beforeDestroy() {
    this.stopSlideShow(); // 组件销毁前清除定时器
  }
  };
  </script>
  
  <style scoped>
  /* 你的 CSS 样式 */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

/* header */

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 30px 5%;
    background: transparent;
    display: flex;
    align-items: center;
    z-index: 100;
}

.logo {
    font-size: 30px;
    color: #fff;
    text-decoration: none;
    font-weight: 700;
}

.social-media {
    margin: 0 auto 0 50px;
}

.social-media a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: 2px solid #fff;
    border-radius: 6px;
    text-decoration: none;
    margin-right: 10px;
    transition: all .3s linear;
}

.social-media a:hover {
    background: #fff;
}

.social-media a i {
    font-size: 20px;
    color: #fff;
    transition: all .3s linear;
}

.social-media a:hover i {
    color: #2d2b2b;
}

.navbar a {
    font-size: 18px;
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    margin-left: 30px;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* section */

.banner {
    position: relative;
    width: 100%;
    height: 90vh;
    overflow: hidden;
  
}

.slider .slide {
    position: absolute;
    width: 100%;
    height: 100%;
}

.slide img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    opacity: 0;
    transition: .5s ease;
}

.slide.active img {
    opacity: 1;
}

.slide .left-info {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    /* background: red; */
    transform: translateX(-100%);
    transition: 0;
}

.slide.active .left-info {
    transform: translateX(0);
    z-index: 1;
    transition: 1s ease;
}

.left-info .penetrte-blur {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .1);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    -webkit-mask: linear-gradient(#000 0 0),
        linear-gradient(#000 0 0);
    -webkit-mask-clip: text, padding-box;
    -webkit-mask-composite: xor;
    padding-right: 15px;
}

.penetrte-blur h1 {
    font-size: 250px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.left-info .content {
    position: absolute;
    bottom: 8%;
    left: 10%;
    color: #fff;
}

.content h3 {
    font-size: 20px;
}

.content p {
    font-size: 16px;
    margin: 10px 10px 15px 0px;
}

.content .btn {
    display: inline-block;
    padding: 13px 28px;
    background: #fff;
    border: 2px solid #fff;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    font-weight: 600;
    color: #444;
    font-size: 16px;
    transition: all .3s linear;
}

.content .btn:hover {
    background: transparent;
    color: #fff;
}

.slide .right-info {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    /* background: red; */
    display: flex;
    align-items: center;
    transform: translateX(100%);
    transition: 0s;
}

.slide.active .right-info {
    transform: translateX(0);
    transition: 1s ease;
}


.right-info h1 {
    font-size: 250px;
    color: #fff;
    text-shadow:
        0 1px 0 #ccc,
        0 2px 0 #c9c9c9,
        0 3px 0 #bbb,
        0 4px 0 #b9b9b9,
        0 5px 0 #aaa,
        0 6px 1px rgba(0, 0, 0, .1),
        0 0px 5px rgba(0, 0, 0, .1),
        0 1px 3px rgba(0, 0, 0, .3),
        0 3px 5px rgba(0, 0, 0, .2),
        0 5px 10px rgba(0, 0, 0, .25),
        0 10px 10px rgba(0, 0, 0, .2),
        0 20px 20px rgba(0, 0, 0, .15);
}

.right-info h3 {
    position: absolute;
    font-size: 80px;
    color: #fff;
    text-shadow: 0 0 10px rgba(0, 0, 0, .5);
    transform: translateY(150%);
    margin-left: 13px;
}

.navigation {
    position: absolute;
    bottom: 8%;
    right: 5%;
    z-index: 100;
}

.navigation span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: #fff;
    border: 2px solid #fff;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    margin-left: 25px;
    transition: .3s;
}

.navigation span:nth-child(1) {
    background: transparent;
}

.navigation span:nth-child(1):hover {
    background: #fff;
}

.navigation span i {
    font-size: 45px;
    color: #444;
    transition: .4s;
}

.navigation span:nth-child(1) i {
    color: #fff;
}

.navigation span:nth-child(1):hover i {
    color: #444;
}
  /* 其他样式 */
  </style>
  