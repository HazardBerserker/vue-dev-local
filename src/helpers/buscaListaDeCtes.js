import ApiService from '@/services/ApiService';
import { endpoints } from '@/utils/apiEndpoints';
import { useAlertStore } from '@/stores/alertStore';

/**
 * Busca Cte pelo id.
 *
 * @param {string} idCte - Valor digitado no campo (ex: coleta_remetente)
 * @param {Function} onSuccess - Callback que recebe a lista de Ctes retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function buscaListaDeCtesHelper(idCte, onSuccess, setLoading = null) {
  if (!idCte) {
    return; // evita buscas com termos curtos
  }

  const alertStore = useAlertStore();

  try {
    if (setLoading) setLoading(true);

    const endpoint = endpoints.cte.listaPorId;
    const url = `${endpoint}/${idCte}`;

    const resposta = await ApiService({
      method: 'get',
      url: url,
    });

    const lista = resposta.data?.data ?? [];

    onSuccess(lista);

  } catch (error) {
    alertStore.addAlert(error?.response?.data?.message || 'Erro ao buscar Ctes', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}
