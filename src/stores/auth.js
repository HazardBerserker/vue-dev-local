import { defineStore } from 'pinia'
import ApiService from '@/services/ApiService'
import router from '@/router'
import { sleep } from '@/utils/sleep'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    returnUrl: null
  }),
  getters: {
    isLoggedIn: state => !!state.accessToken
  },
  actions: {

    setTokens({ access_token, refreshToken }) {
      this.accessToken = access_token
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', access_token)
      localStorage.setItem('refreshToken', refreshToken)
    },

    async login(credentials) {

        const res = await ApiService.post('/login', credentials)

        if (res && res.status === 200 && res.data) {
          this.setTokens(res.data)
          const redirectTo = this.returnUrl || '/'
          router.push(redirectTo)
          this.returnUrl = null
          return
        }

    },

    async logout() {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      await sleep(100)
      location.reload() // ou location.reload() se ainda der erro
    }
  },
  persist: true  // habilita persistência automática do store :contentReference[oaicite:4]{index=4}
})
