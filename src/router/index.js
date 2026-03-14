import { createRouter, createWebHistory } from 'vue-router'

// 导入组件（使用@别名引入）
const Home = () => import('@/views/Home.vue')
const About = () => import('@/views/About.vue')
const Products = () => import('@/views/Products.vue')
const Orders = () => import('@/views/Orders.vue')
const Users = () => import('@/views/Users.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: '关于我们'
      }
    },
    {
      path: '/products',
      name: 'Products',
      component: Products,
      meta: {
        title: '商品管理'
      }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
      meta: {
        title: '订单管理'
      }
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: {
        title: '用户管理'
      }
    },
    // 404页面
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 全局前置守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Vue Router App'
  next()
})

export default router