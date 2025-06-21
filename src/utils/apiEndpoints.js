import { URL_BASE } from '@/config/urlBase';

export const endpoints = {
  cliente: {
    datatable: `${URL_BASE}/clientes/datatable`,
    novo: `${URL_BASE}/clientes`,
    atualiza: `${URL_BASE}/clientes`,
    apaga: `${URL_BASE}/clientes`,
    buscaClienteNaApiDoGoverno: `${URL_BASE}/clientes/busca-cliente-pelo-cnpj-na-api-do-governo`,
    buscaPorRazaoSocial: `${URL_BASE}/clientes/busca-por-razao-social`,
  },
  motorista: {
    datatable: `${URL_BASE}/motoristas/datatable`,
    novo: `${URL_BASE}/motoristas`,
    atualiza: `${URL_BASE}/motoristas`,
    apaga: `${URL_BASE}/motoristas`,
  },
};
