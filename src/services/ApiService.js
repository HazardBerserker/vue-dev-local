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

const PingService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

PingService.interceptors.request.use(config => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

ApiService.interceptors.request.use(async (config) => {
  try {
    const token = Cookies.get('access_token')
    if(token) {
      // só fará essa requisição se houver um cookie, o que indica que o usuario esta logado
      // rota simples para renovar sessão
      await PingService.get('/usuario/usuario-logado')
    }
  } catch (error) {
    console.warn('Ping falhou, sessão pode estar expirada:', error)
    // aqui pode fazer logout automático se quiser
  }
  return config
})


export default ApiService
