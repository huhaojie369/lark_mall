import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 列表页（首页）
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: "商品列表"
    }
  },
  // 详情
  {
    path: '/details/:id',
    name: 'details',
    component: () => import(/* webpackChunkName: "details" */ '../views/Details.vue'),
    meta: {
      title: "商品详情"
    }
  },
  // 订单页
  {
    path: '/order',
    name: 'order',
    component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue'),
    meta: {
      title: "订单"
    }
  },
  // 提交订单状态
  {
    path: '/status',
    name: 'status',
    component: () => import(/* webpackChunkName: "status" */ '../views/BuyStatus.vue'),
    meta: {
      title: "订单状态"
    }
  },
  // 问卷调查
  {
    path: '/survey',
    name: 'survey',
    component: () => import(/* webpackChunkName: "survey" */ '../views/Survey.vue'),
    meta: {
      title: "问卷调查"
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
