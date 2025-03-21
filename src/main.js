import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import AuthPage from './components/Auth.vue';
import MenuPage from './components/Menu.vue';
import HomePage from './components/Home.vue';
import HashpackPage from './components/HashpackPage.vue';
import CreateToken from './components/CreateToken.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // Default Material Design light theme
  },
});

const routes = [
  { path: '/auth', component: AuthPage },
  { path: '/menu', component: MenuPage },
  { path: '/', component: HomePage },
  { path: '/hashpack', component: HashpackPage },
  { path: '/create-token', component: CreateToken },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');