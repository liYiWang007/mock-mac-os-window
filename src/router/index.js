import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/taskOne',
      name: 'TaskOne',
      component: () => import('@/views/TaskOne.vue')
    },
    {
      path: '/taskTwo',
      name: 'TaskTwo',
      component: () => import('@/views/TaskTwo.vue')
    }
  ]
})

export default router
