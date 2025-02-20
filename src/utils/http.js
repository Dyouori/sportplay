import axios from 'axios'
import router from '@/router/index'

//创建新实例
const http = axios.create({
 baseURL: 'http://localhost:9000/sport', // 请求的根域名

  timeout: 5000 // 请求超时时间
  
})
// 请求拦截，在每个请求发送前从本地get到token添加到请求头
http.interceptors.request.use(
  config => {
    // 从sessionStorage中获取token
    const token = JSON.parse(window.sessionStorage.getItem("token")) // 直接获取，不需要JSON.parse
   // console.log("拿到token:", token);
    
    // 如果token存在，则添加到请求头中
    if (token) {
      config.headers['token'] = token; // 或使用 'Authorization': 'Bearer ' + token;
     // console.log("设置请求头token:", config.headers['token']);
    }
    
    return config;
  },
  error => {
    // 请求错误处理
    console.error("请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

  
// 响应拦截
http.interceptors.response.use(response => {
    if (response.data && response.data.code === 401) { // 401, token失效
        alert('登录失效，请重新登录')
        router.push({ name: 'login' })
    }
    return response
}, error => {
    return Promise.reject(error)
})
export default http