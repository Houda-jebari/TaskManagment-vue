import './assets/main.css'

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'; // Import from vue-router


import App from './App.vue'
import Register from './components/Register.vue';
import Login from './components/Login.vue';


const routes = [
  { path: '/',name:'home', component: App },
  { path: '/register', name:'register',component: Register },
    { path: '/login',name: 'login',component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
