import Vue from 'vue'
import Router from 'vue-router'

//登录
import Login from '../pages/Login.vue' 
import API from '../pages/API.vue' 
//主页
import Home from '../pages/Home.vue' 
//主页
import CHome from '../pages/CHome.vue'
//接口
import Apilist from '../pages/apilist/Apilist.vue'
//项目
import Pro from '../pages/pro/Pro.vue'
 


//获取原型对象上的push函数
const originalPush = Router.prototype.push;
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(Router)

const routes = [];

//第一层级目录首页
routes.push({
  path: '/',
  name: 'login',
  component: Login
});
routes.push({
  path: '/api',
  name: 'api',
  component: API
});
//第一层级目录首页
routes.push({
  path: '/home',
  name: 'home',
  component: Home,
  children: [{
    path: 'chome',
    name: 'chome',
    component: CHome,
    children: [{
      path: 'apilist',
      name: 'apilist',
      component: Apilist,
    },{
      path: 'pro',
      name: 'pro',
      component: Pro,
    }]
  }]
});

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
//拦截路由
router.beforeEach((to, from, next) => {
 // sessionStorage.setItem("token","ceshi");
  const token = sessionStorage.getItem("token");
  if (to.path === "/") {
      next();
  }else if (to.path === "/api") {
    next();
} else {
    if (token == null || token == "") { 
      next("/");
    } else {
      next();
    }
  }
});
export default router
