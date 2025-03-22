import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CreateToken from '../views/CreateToken.vue';
import CreateTokenAlt from '../views/CreateTokenAlt.vue'; // New import
import Auth from '../auth/auth.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/create-token', name: 'CreateToken', component: CreateToken },
  { path: '/create-token-alt', name: 'CreateTokenAlt', component: CreateTokenAlt }, // New route
  { path: '/auth', name: 'Auth', component: Auth },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;