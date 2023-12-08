// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI  from 'element-ui';
import './theme/index.css'; 
import store from './store/index.js';
import echarts from 'echarts'; 
import 'default-passive-events'
import '@wangeditor/editor/dist/css/style.css' 
Vue.prototype.$echarts = echarts;

Vue.use(ElementUI, { size: 'small', zIndex: 2000 });  
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
