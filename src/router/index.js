import { createRouter ,createWebHistory } from "vue-router";
import Register from '@/components/Register.vue';
import Login from '@/components/Login.vue';
import Dashboard from "@/components/Dashboard.vue";
import Board from "@/components/Board.vue";
import Project from "@/components/Project.vue"
const routes = [
  { path: '/', redirect:'/login' }, // Redirect '/' to '/register'
  { path: '/register', name:'register',component: Register },
  { path: '/login',name: 'login',component: Login },
  { path: '/Board',name: 'board',component: Board },
 
  
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  //  meta: { requiresAdmin: true },
  },
  {
    path:'/project',
    name:'project',
    component: Project,
  //  meta: { requiresAdmin: true },
  }
];



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


//route guards for security
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('role');
  
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (role === 'admin') {
      next();
    } else {
      next('/board'); // Redirect to a different page if not admin
    }
  } else {
    next(); // Always call next()
  }
});


export default router;