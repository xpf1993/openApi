import axios from 'axios';
import QS from "qs";
import router from '../router/index'
import { Message } from "element-ui"; 

//  让请求在浏览器中允许跨域携带cookie 
axios.defaults.withCredentials = true;
axios.defaults.timeout = 2400000;
 
var mUrl = "";
if (process.env.NODE_ENV == "production") {
  mUrl = `${window.location.origin}/esb-document`;
  //mUrl="http://192.168.1.11:8087/cdr-hadoop"
} else {
  mUrl = '';
}

// 使用自定义配置新建一个 axios 实例
const mhttp = axios.create({
  // 基础的请求地址
  baseURL: mUrl,
  // 设置超时时间 240s
  timeout: 24000000
});

// 请求拦截器，请求的时候在头部加上请求的token
mhttp.interceptors.request.use(config => {
  config.headers.token = sessionStorage.getItem("token"); 
  if (process.env.NODE_ENV == "production") { config.url = config.url.replace(/(\/open)/, '') } 
  return config;  //  有且必须有一个config对象被返回 
}, error => {
  //   对请求错误做些什么
  Message({
    message: "错误的请求操作！请退出重试",
    duration: 3000,
    type: "error",
    showClose: true
  });
  return Promise.reject();
});
 
// 响应拦截器
mhttp.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.status != 200) { 
        if(response.data.status == 401){
           //去登录
           sessionStorage.clear(); 
           setTimeout(() => {
            router.push({ name: "login" }); 
          }, 1000);
          return;
        }
        //处理后台返回不是200的 在这里统一提示 并返回
        Message({
          message: (response.data.msg&&response.data.msg!="null")?response.data.msg:'错误',
          duration: 3000,
          type: "error",
          showClose: true
        });
      }
      return Promise.resolve(response.data);
    } else {
      Message({
        msg: "请求异常！",
        duration: 3000,
        type: "error",
        showClose: true
      });
    }
  },
  // http状态码不是200的情况
  error => {
    Message({
      message: "网络异常！",
      duration: 3000,
      type: "error",
      showClose: true
    });
    return Promise.reject(error)
  }
);

export default mhttp;

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    mhttp
      .get(url, { params: params })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    mhttp.post(url, QS.stringify(data)).then(
      response => {
        resolve(response);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装postJson请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function postJson(url, data = {}) {
  return new Promise((resolve, reject) => {
    mhttp.post(url, data).then(
      response => {
        resolve(response);
      },
      err => {
        reject(err);
      }
    );
  });
} 

/**
 * 封装postJsonAll请求 
 */

 export function postJsonAll(url, data,param) { 
   
  return new Promise((resolve, reject) => {
    mhttp.post(url, data,{
      params:param
    }).then(
      response => {
        resolve(response);
      },
      err => {
        reject(err);
      }
    );
  });
} 
 