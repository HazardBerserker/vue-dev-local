import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/modulos/Login/Login.vue'
import AuthLayout from '@/modulos/Layout/AuthLayout.vue'
import Teste from '@/modulos/Teste/Teste.vue'
import Teste2 from '@/modulos/Teste/Teste2.vue'
AuthLayout

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: AuthLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: 'teste', 
        name: 'Teste', 
        component: Teste 
      },
      { 
        path: 'teste2', 
        name: 'Teste2', 
        component: Teste2
      },
      // // { 
      //   path: 
      //   'profile', 
      //   name: 'profile', 
      //   component: ProfileView 
      // },
      // {
      //   path: '/about',
      //   name: 'about',
      //   component: () => import('../views/AboutView.vue'), // lazy load
      //   meta: { requiresAuth: true }
      // },
    ]
  },
  
  
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   component: () => import('../views/NotFound.vue')
  // }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // redireciona ao login e armazena rota desejada
    auth.returnUrl = to.fullPath 
    return { name: 'login' }
  }
})


export default router
