import { defineStore } from 'pinia'
import ApiService from '@/services/ApiService'
import router from '@/router'
import { useLoadingStore } from './loading'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    returnUrl: null
  }),
  persist: true,

  getters: {
    isLoggedIn: (state) => !!state.user
  },

  actions: {
    async login(credentials) {
      try {
        // Obtém o cookie XSRF-TOKEN necessário para autenticação via cookie
        await ApiService.get('/sanctum/csrf-cookie', {
          baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
          withCredentials: true
        })

        // Login com credenciais (armazenará o cookie de sessão se sucesso)
        const res = await ApiService.post('/login', credentials)

        if (res.status === 200 && res.data.success && res.data.data) {
          const { user_data } = res.data.data

          this.user = user_data
          this.returnUrl = null
          return res
        }
      } catch (error) {
        this.user = null
        throw error
      }
    },

    async logout() {
      const loading = useLoadingStore()
      try {
        loading.show('Deslogando Usuário...')
        await ApiService.post('/logout')
      } catch (e) {
        console.warn('Erro ao fazer logout no servidor (ignorado):', e)
      } finally {
        this.user = null
        router.push({ name: 'login' })
        loading.hide()
      }
    },
  }
})
