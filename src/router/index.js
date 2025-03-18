import Vue from 'vue'
import VueRouter from 'vue-router'


import Manager from '../components/Manager.vue'
import Home from '../components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import UserList from '@/views/admin/UserList.vue'

import SportMod from '@/views/admin/SportMod.vue'
import Goods from '@/views/admin/Goods.vue'


import NotFound from '@/components/404.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/faceLogin', component: () => import('@/components/face/views/login/index.vue') },
  {
    path: '/facehome',
    component: () => import('@/components/face/views/home/index'),
    redirect: '/desktop',
    children: [
      { path: '/desktop', component: () => import('@/components/face/components/desktop/index') },
      { path: '/faceList', component: () => import('@/components/face/components/face/index') },
      { path: '/faceLog', component: () => import('@/components/face/components/faceLog/index') }
    ]
  },
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    name:'Login',
    component:()=>import('../components/Login.vue')
  },
  {
    path:'/register',
    name:'Register',
    component:()=>import('../components/Register.vue'),
  },
  {
    path: '*',
    component: NotFound, // 404页面组件
  },
  {
    path:'/aliPay',
    name:'aliPay',
    component:()=>import('../utils/aliPay.vue')
  },
  {
    path:'/manager',
    name:'manager',
    
    component:()=>import('../components/Manager.vue'),
    children:[
      { path:'home',name:'Home',component:()=>import('../components/Home.vue')},
      {
        path:'/user',
        name:'User',
        component:UserList,
      },
      { path:'/admininfo',name:'AdminInfo',component:()=>import('@/views/admin/AdminInfo.vue')},
      { path:'/classinfo',name:'ClassInfo',component:()=>import('@/views/admin/ClassInfo.vue')},
      { path:'/classification',name:'Classification',component:()=>import('@/views/admin/Classification.vue')},
      { path:'/cookbook',name:'CookBook',component:()=>import('@/views/admin/CookBook.vue')},
      { path:'/foodtype',name:'FoodType',component:()=>import('@/views/admin/FoodType.vue')},
      { path:'/foodinfo',name:'FoodInfo',component:()=>import('@/views/admin/FoodInfo.vue')},
      { path:'/order',name:'Order',component:()=>import('@/views/admin/Order.vue')},
      { path:'/chart',name:'Charts',component:()=>import('@/views/admin/Charts.vue')},
      { path:'/comment',name:'Comment',component:()=>import('@/views/admin/Comment.vue')},
    ]
  },
  {
    path:'/yonghu',
    name:'yonghu',
    redirect:'/indexHome',
    component:()=>import('../components/User.vue'),
    children:[
      { path:'/indexHome',name:'IndexHome',component:()=>import('@/views/users/IndexHome.vue')},
      { path:'/showClass',
        name:'ShowClass',
        component:()=>import('@/views/users/ShowClass.vue'),
        children:[
         
        ]
      },
      { path:'/showClass/classDetail',name:'ClassDetail',component:()=>import('@/views/users/ClassDetail.vue')},
      { path:'/foodHealth',name:'FoodHealth',component:()=>import('@/views/users/FoodHealth.vue')},
      { path:'/bodyHealth',name:'BodyHealth',component:()=>import('@/views/users/BodyHealth.vue')},
      { path:'/myInfo',
        name:'MyInfo',
        component:()=>import('@/views/users/profile/Index.vue'),
        redirect:'/myInfo/charts',
        children:[
          { path:'/myInfo/healthData',name:'healthData',component:()=>import('@/views/users/profile/HealthData.vue')},
          { path:'/myInfo/editInfo',name:'EditInfo',component:()=>import('@/views/users/profile/EditInfo.vue')},
          { path:'/myInfo/myOrder',name:'MyOrder',component:()=>import('@/views/users/profile/MyOrder.vue')},
          { path:'/myInfo/charts',name:'Charts',component:()=>import('@/views/users/profile/Chart.vue')},
          { path:'/myInfo/money',name:'Money',component:()=>import('@/views/users/profile/MyMoney.vue')},
          { path:'/myInfo/runData',name:'RunData',component:()=>import('@/views/users/profile/RunData.vue')},
        ]
      },
      
     // { path:'/editInfo',name:'EditInfo',component:()=>import('@/views/users/profile/EditInfo.vue')},
    ]
      
  },
  

  
]

const router = new VueRouter({
  routes,
 // history: createWebHashHistory(),
 
    
  
})


router.beforeEach((to, from, next) => {
  // 如果访问的是登录页面，直接放行
  if (to.path === '/login') {
    return next();
  }

  // 获取用户信息
  const user = window.sessionStorage.getItem("user");

  // 如果没有登录，并且访问的不是注册页面，重定向到登录页面
  // if (!user && to.path !== '/register') {
  //   return next('/login');
  // }

  // 如果访问的是注册页面或人脸识别页面，直接放行
  if (to.path === '/register'|| to.path === '/facehome' || to.path === '/faceLogin') {
    return next();
  }

  // 检查目标路由是否与当前路由相同
  if (to.path === from.path) {
    // 如果是，则提示用户
    alert('用户已经在该页面，不需要再次导航');
    return; // 阻止导航
  }

  // 如果已经登录，放行
  next();
});



export default router
