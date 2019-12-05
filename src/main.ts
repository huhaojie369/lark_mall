import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Toast } from 'vant';

// 淘宝flexible rem js暂时没用
// import 'lib-flexible/flexible';

// rem自适应less
import './assets/css/adapter.less';
// 全局注册axios  VueAxios-作用是不用手动添加到vue原型上就可以直接使用
Vue.use( VueAxios, axios )

// 全局注册提示弹框
Vue.use( Toast )

// 配置公共的接口地址：
// axios.defaults.baseURL = 'http://192.168.31.100/api/'
axios.defaults.baseURL = 'https://larktest.lpl.app/api/'


// axios 拦截器
// 只要是 axios 发送的ajax请求，那么，就会走拦截器
// 两个拦截器：1 请求拦截器 2 响应拦截器
// 处理方式：因为每个请求都会走 请求拦截器 ，所以，只需要在 请求拦截器 中，添加header就可以了
axios.interceptors.request.use(function (config) {
  // 所有请求之前都要执行的操作
  // console.log('axios 的请求拦截器', config)

  // // 如果是login，不添加header
  // if (config.url.indexOf('login') <= -1) {
  //   // 给请求头中添加 Authorization 请求头：
    config.headers.Authorization = localStorage.getItem('token')

  return config
})

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sYXJrLmNsb3VkXC9hcGlcL2xvZ2luIiwiaWF0IjoxNTc1NTI2Nzk3LCJleHAiOjE1NzU1MzAzOTcsIm5iZiI6MTU3NTUyNjc5NywianRpIjoiU2xiUDU4cXNRRWxURU0weiIsInN1YiI6MTcsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.5RVy_Uth1OgR352s1vYdBzyaFgNnBQA17CWd68ecKq4
/* // 响应拦截器
axios.interceptors.response.use(function (response) {
  // 所有请求完成后都要执行的操作
  // console.log('axios 的响应拦截器')

  return response
}) */

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
