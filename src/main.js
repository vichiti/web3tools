import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import AuthPage from './components/Auth.vue';
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
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#009688', // Teal
          secondary: '#673AB7', // Deep Purple
          accent: '#FF9800', // Orange
          error: '#F44336',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FAFAFA', // Light grey
        },
      },
    },
  },
});

const routes = [
  { path: '/auth', component: AuthPage },
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