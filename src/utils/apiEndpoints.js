import { URL_BASE } from '@/config/urlBase';

export const endpoints = {
  cliente: {
    datatable: `${URL_BASE}/clientes/datatable`,
    novo: `${URL_BASE}/clientes`,
    atualiza: `${URL_BASE}/clientes`,
    apaga: `${URL_BASE}/clientes`,
  },
  usuario: {
    lista: `${URL_BASE}/usuario`,
    novo: `${URL_BASE}/usuario/novo`,
  },
};
