import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'*',
    redirect:'login',
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    // meta:{requiresAuth:true}
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },{
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  },
  {
    path: '/admin',
    name: 'dashboard',
    component: () => import('../views/dashboard'),
    
    children:[
    {
      path: 'products',
      name: 'Products',
      component:()=> import('../components/Products'),
      meta:{requiresAuth:true},
    },
    {
      path: 'orders',
      name: 'orders',
      component:()=> import('../components/Orders'),
      meta:{requiresAuth:true},
    }
  ]
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/dashboard'),
    
    children:[
    {
      path: 'customer_orders',
      name: 'CustomerOrders',
      component:()=> import('../components/CustomerOrders'),
    },
    {
      path: 'customer_checkout/:orderId',
      name: 'CustomerCheckout',
      component:()=> import('../components/CustomerCheckout.vue'),
    },
  ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
