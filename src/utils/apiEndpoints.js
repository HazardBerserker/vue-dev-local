import { URL_BASE } from '@/config/urlBase';

export const endpoints = {
  cliente: {
    datatable: `${URL_BASE}/clientes/datatable`,
    novo: `${URL_BASE}/clientes`,
    atualiza: `${URL_BASE}/clientes`,
    apaga: `${URL_BASE}/clientes`,
    buscaClienteNaApiDoGoverno: `${URL_BASE}/clientes/busca-cliente-pelo-cnpj-na-api-do-governo`,
    listaPorRazaoSocial: `${URL_BASE}/clientes/lista-por-razao-social`,
  },
  motorista: {
    datatable: `${URL_BASE}/motoristas/datatable`,
    novo: `${URL_BASE}/motoristas`,
    atualiza: `${URL_BASE}/motoristas`,
    apaga: `${URL_BASE}/motoristas`,
    listaPorRazaoSocial: `${URL_BASE}/motoristas/lista-por-razao-social`,
  },
  freteCotacao: {
    datatable: `${URL_BASE}/fretes/datatable`,
    novo: `${URL_BASE}/fretes`,
    atualiza: `${URL_BASE}/fretes`,
    apaga: `${URL_BASE}/fretes`,
  },
  cotacaoCriterios: {
    datatable: `${URL_BASE}/cotacao-criterios/datatable`,
    lista: `${URL_BASE}/cotacao-criterios/lista`,
    novo: `${URL_BASE}/cotacao-criterios`,
    atualiza: `${URL_BASE}/cotacao-criterios`,
    apaga: `${URL_BASE}/cotacao-criterios`,
  },
  cte: {
    listaPorId: `${URL_BASE}/ctes/lista-por-id`,
  }
};
