import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SmartContractPage from '../views/SmartContractPage.vue'
import FTPage from '../views/FTPage.vue'
import FTHashPackPage from '../views/FTHashPackPage.vue'


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
  },
  {
    path: '/ft',
    name: 'FT',
    component: FTPage
  },
  {
    path: '/ft-hashpack',
    name: 'FTHashPack',
    component: FTHashPackPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router