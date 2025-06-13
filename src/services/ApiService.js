import router from '@/router'
import axios from 'axios'
import Cookies from 'js-cookie'

const ApiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // importante para cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

ApiService.interceptors.request.use(config => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

ApiService.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 401:
          console.error('Erro 401: Não autorizado. Faça login novamente.')
          Cookies.remove('access_token')
          router.push({ name: 'login' })
          break

        case 403:
          console.error('Erro 403: Acesso negado. Você não tem permissão para acessar este recurso.')
          break

        case 404:
          console.error('Erro 404: Recurso não encontrado.')
          break

        case 422:
          console.error('Erro 422: Requisição mal formatada ou dados inválidos.')
          break

        case 500:
          console.error('Erro 500: Erro interno no servidor. Tente novamente mais tarde.')
          break

        default:
          console.error(`Erro ${status}: Ocorreu um erro inesperado.`)
      }
    } else if (error.request) {
      console.error('Erro de rede ou servidor não respondeu.')
    } else {
      console.error('Erro ao configurar a requisição:', error.message)
    }

    return Promise.reject(error)
  }
)

export default ApiService
