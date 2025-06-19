import { URL_BASE } from '@/config/urlBase';

export const endpoints = {
  cliente: {
    datatable: `${URL_BASE}/clientes/datatable`,
    novo: `${URL_BASE}/clientes/novo`,
    atualiza: `${URL_BASE}/clientes/atualiza`,
    detalhe: `${URL_BASE}/clientes/detalhe`,
  },
  usuario: {
    lista: `${URL_BASE}/usuario`,
    novo: `${URL_BASE}/usuario/novo`,
  },
};
