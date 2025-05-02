import { createWebHistory, createRouter } from 'vue-router'

import LoginPage from '../pages/LoginPage.vue'
import UserListPage from '../pages/UserListPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/users', component: UserListPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;