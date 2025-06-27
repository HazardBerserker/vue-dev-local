import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/modulos/Login/Login.vue'
import AuthLayout from '@/modulos/Layout/AuthLayout.vue'
import Clientes from '@/modulos/Clientes/Clientes.vue'
import Motoristas from '@/modulos/Motoristas/Motoristas.vue'
import NovaCotacao from '@/modulos/Cotacao/NovaCotacao.vue'
import FretesCotacoes from '@/modulos/Cotacao/FretesCotacoes.vue'
import PagamentoMotoristas from '@/modulos/Financeiro/PagamentoMotoristas.vue'

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
      {
        path: 'comercial/nova-cotacao',
        name: 'Nova Cotação',
        component: NovaCotacao
      },
      {
        path: 'comercial/fretes-cotacoes',
        name: 'Fretes Cotações',
        component: FretesCotacoes
      },
      {
        path: 'financeiro/pagamento-motoristas',
        name: 'Pagamento de Motoristas',
        component: PagamentoMotoristas
      },
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
