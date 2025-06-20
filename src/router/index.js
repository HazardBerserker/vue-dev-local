import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/modulos/Login/Login.vue'
import AuthLayout from '@/modulos/Layout/AuthLayout.vue'
import Clientes from '@/modulos/Clientes/Clientes.vue'
import Motoristas from '@/modulos/Motoristas/Motoristas.vue'

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
        path: 'cadastros/clientes',
        name: 'Cliente',
        component: Clientes
      },
      {
        path: 'cadastros/motoristas',
        name: 'Motorista',
        component: Motoristas
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
