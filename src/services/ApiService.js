import router from '@/router'
import { useAlertStore } from '@/stores/alertStore';
import { sleep } from '@/utils/sleep';
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const ApiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // importante para cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

async function usuarioNaoAutenticado() {
  router.push({ name: 'login' })
  await sleep(500);
  useAlertStore().addAlert('Não autenticado. Faça login novamente', 'warning', 4000)
}

ApiService.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          usuarioNaoAutenticado();
          break;
        case 419:
          usuarioNaoAutenticado();
          break;
      }
    }
    // Importantíssimo: Sempre propagar o erro para o catch dos componentes
    return Promise.reject(error);
  }
);


export default ApiService
