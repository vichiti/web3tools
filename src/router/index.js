import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SmartContractPage from '../views/SmartContractPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/smart-contract',
    name: 'SmartContract',
    component: SmartContractPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router