import Vue from 'vue'
import VueRouter from 'vue-router'
import Visualization from '../views/Visualization.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/vis',
    name: 'Visualization',
    component: Visualization
  },
  {
    path: '/',
    name: 'Controller',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Controller.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
