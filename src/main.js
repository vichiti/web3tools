import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomePage from './components/Home.vue';
import HashpackPage from './components/HashpackPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/hashpack', component: HashpackPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');