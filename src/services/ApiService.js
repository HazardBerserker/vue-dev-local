import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const ApiService = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
   },
})

ApiService.interceptors.request.use(config => {
   const auth = useAuthStore()

   // Adiciona token se existir
   if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`
   }

   // Garante que Content-Type padrão seja JSON, se não for sobrescrito
   if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
   }

   return config
})

ApiService.interceptors.response.use(
    res => res,
    async error => {
      const original = error.config
      const auth = useAuthStore()

    if (original.url.includes('/login')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      auth.logout()
      router.push({ name: 'login' })
    }
  }
)
export default ApiService
