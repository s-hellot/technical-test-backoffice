import { createWebHistory, createRouter } from 'vue-router'

import LoginPage from '../pages/LoginPage.vue'
import UserListPage from '../pages/UserListPage.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/users', name: 'Users', component: UserListPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  if (!token && to.name !== 'Login') {
    return { name: 'Login' }
  } else if (token && to.name === 'Login') {
    return { name: 'Users' }
  }
})

export default router
