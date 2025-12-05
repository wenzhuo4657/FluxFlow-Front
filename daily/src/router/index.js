import { createRouter, createWebHistory } from 'vue-router';
import Home from '../page/home/Home.vue';
import Login from '@/page/login/login.vue';
import Oauth from '@/page/oauth/Oauth.vue';
import { useAuthStore } from '@/storage/auth';
import Layout from '@/page/home/layout.vue';
import { LocalStorage } from '@/constants/storage';

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: () => {
      const token = localStorage.getItem(LocalStorage.TOKEN)
      console.log('Root redirect check:', { token: token ? 'exists' : 'none' })
      return token ? '/home' : '/login'
    }
  },
  {
    path: '/home',
    name: 'Home',
    meta: { requiresAuth: true }, // 需要鉴权
    component: Layout,
  },
  {
    path: '/login',
    name: 'Login',
    meta: { requiresAuth: false },
    component: Login,
  },
  {
    path: '/auth/callback',
    name : 'callback',
    meta: { requiresAuth: false},
    component: Oauth

  } 
];

const router = createRouter({
  // createWebHistory 需要服务器支持回退路由到 index.html
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from) => {
  const auth = useAuthStore();
  // 检查 token（支持 ref）
  const token = auth.token;
  const tokenValue = (token && typeof token === 'object' && 'value' in token) ? token.value : token;
  const authed = !!tokenValue;

  console.log('Route guard check:', {
    to: to.name,
    hasToken: authed,
    token: tokenValue
  });

  if (to.meta.requiresAuth && !authed) {
    console.log('Authentication required, redirecting to login');
    return { name: 'Login' };
  }
});

export default router;
