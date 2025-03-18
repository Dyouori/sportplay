import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import './assets/css/reset.css'

// 数据校验工具类
import * as validate from '@/utils/validate.js'
import store from './store/user'; // 引入仓库
//导入axios进行跨域
import axios from 'axios'
//挂载，全局都能用·
import { Tooltip } from 'element-ui';
//图标
import 'boxicons/css/boxicons.min.css';
// 在main.js中全局引入
import VideoPlayer from 'vue-video-player/src';
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
 // 引入框架
import 'face-effet/effet/effet.css'
import faceEffet from 'face-effet/effet/effet.js'
import face_axios from '@/components/face/face_axios'
// 注册为全局
Vue.prototype.$faceEffet = faceEffet

Vue.use(VideoPlayer)

Vue.use(Tooltip);
import http from '@/utils/http'// 动态添加外部 CSS 文件
function addExternalCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}
// 调用函数，传入 CDN 链接
addExternalCSS('//at.alicdn.com/t/c/font_4765531_ab886ookqgt.css');



// 设置全局tooltip样式
Tooltip.props.popperClass.default = 'my-global-tooltip-style';

Vue.prototype.$https = http
//挂载检验格式
Vue.prototype.$validate = validate

Vue.prototype.$faceAxios = face_axios
//设置访问根路径---默认根路径
axios.defaults.baseURL = "http://localhost:9000"


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
