import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/modulos/Login/Login.vue'
import AuthLayout from '@/modulos/Layout/AuthLayout.vue'
import Clientes from '@/modulos/Clientes/Clientes.vue'
import Motoristas from '@/modulos/Motoristas/Motoristas.vue'
import NovaCotacao from '@/modulos/Comercial/NovaCotacao.vue'
import FretesCotacoes from '@/modulos/Comercial/FretesCotacoes.vue'
import PagamentoMotoristas from '@/modulos/Financeiro/PagamentoMotoristas.vue'
import ControleDeCtes from '@/modulos/Fiscal/ControleDeCtes.vue'
import Dashboard from '@/modulos/Dashboard/Dashboard.vue'
import MeusFretes from '@/modulos/MenuDoCliente/MeusFretes.vue'
import NotFound from '@/components/NotFound/NotFound.vue'
import ControleDeManifestos from '@/modulos/Fiscal/ControleDeManifestos.vue'

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
        path: '',
        redirect: 'menu-do-cliente/meus-fretes'  // agora redireciona dentro do contexto autenticado
      },
      {
        path: 'dashboard/metricas-gerais',
        name: 'Dashboard',
        component: Dashboard
      },
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
        name: 'NovaCotacao',
        component: NovaCotacao
      },
      {
        path: 'comercial/fretes-cotacoes',
        name: 'FretesCotacoes',
        component: FretesCotacoes
      },
      {
        path: 'financeiro/pagamento-motoristas',
        name: 'PagamentoDeMotoristas',
        component: PagamentoMotoristas
      },
      {
        path: 'fiscal/registrar-cte',
        name: 'ControleDeCtes',
        component: ControleDeCtes
      },
      {
        path: 'fiscal/controle-de-manifestos',
        name: 'ControledeManifestos',
        component: ControleDeManifestos
      },
      {
        path: 'menu-do-cliente/meus-fretes',
        name: 'MeusFretes',
        component: MeusFretes
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Aguarda até que o estado seja restaurado (máx: 100ms)
  if (!auth.isHydrated) {
    await new Promise(resolve => setTimeout(resolve, 10))
    if (!auth.isHydrated) {
      return false // cancela navegação e aguarda nova tentativa
    }
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    auth.returnUrl = to.fullPath
    return { name: 'login' }
  }
})

export default router
