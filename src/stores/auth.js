import { defineStore } from 'pinia'
import ApiService from '@/services/ApiService'
import router from '@/router'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    returnUrl: null
  }),

  getters: {
    isLoggedIn: () => !!Cookies.get('access_token')
  },

  actions: {
    async checkAuth() {
      try {
        const response = await ApiService.get('/usuario-logado')
        this.user = response.data
        return true
      } catch (error) {
        this.user = null
        Cookies.remove('access_token')
        return false
      }
    },

    async login(credentials) {
      try {
        await ApiService.get('/sanctum/csrf-cookie', {
          baseURL: `${import.meta.env.VITE_API_BASE_URL_SEM_VERSIONAMENTO}`,
          withCredentials: true
        })

        const res = await ApiService.post('/login', credentials)

        if (res.status === 200 && res.data.success && res.data.data) {
          const { access_token, user_data, expires_in } = res.data.data

          this.user = user_data

          // Definindo a expiração do cookie em dias (expires_in está em segundos)
          const expiresDays = expires_in / 86400

          Cookies.set('access_token', access_token, {
            expires: expiresDays,
            secure: false,  // mude para true se usar HTTPS
            sameSite: 'Lax'
          })

          this.returnUrl = null
          router.push('/')
        }
      } catch (error) {
        this.user = null
        Cookies.remove('access_token')
        throw error
      }
    },

    async logout() {
      try {
        await ApiService.post('/logout')
      } catch (e) {
        console.warn('Erro ao fazer logout no servidor (ignorado):', e)
      }

      this.user = null
      Cookies.remove('access_token')
      router.push({ name: 'login' })
    }
  }
})
