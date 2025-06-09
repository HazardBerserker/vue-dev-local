import { defineStore } from 'pinia'
import ApiService from '@/services/ApiService'
import router from '@/router'  

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

      console.log(access_token);
      
      this.accessToken = access_token
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', access_token)
      localStorage.setItem('refreshToken', refreshToken)
    },

    async login(credentials) {
      try {
        const res = await ApiService.post('/login', credentials)
        console.log(res?.data);
        
        this.setTokens(res?.data)
        const redirectTo = this.returnUrl || '/'
        router.push(redirectTo)
        this.returnUrl = null
      } catch (error) {
        console.error('Erro no login:', error)
        throw error  // ou trate o erro para exibir na UI
      }
    },


    async refreshToken() {
      const res = await ApiService.post('/refresh', { refreshToken: this.refreshToken })
      this.setTokens(res.data)
      return res.data.accessToken
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },
  persist: true  // habilita persistência automática do store :contentReference[oaicite:4]{index=4}
})
