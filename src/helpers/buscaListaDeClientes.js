import ApiService from '@/services/ApiService';
import { endpoints } from '@/utils/apiEndpoints';
import { useAlertStore } from '@/stores/alertStore';

/**
 * Busca clientes pelo nome do remetente.
 *
 * @param {string} nomeRemetente - Valor digitado no campo (ex: coleta_remetente)
 * @param {Function} onSuccess - Callback que recebe a lista de clientes retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function buscaListaDeClientesHelper(nomeRemetente, onSuccess, setLoading = null) {
  if (!nomeRemetente) {
    return; // evita buscas com termos curtos
  }

  const alertStore = useAlertStore();

  try {
    if (setLoading) setLoading(true);

    const endpoint = endpoints.cliente.listaPorRazaoSocial;
    const url = `${endpoint}/${nomeRemetente}`;

    const resposta = await ApiService({
      method: 'get',
      url: url,
    });

    const lista = resposta.data?.data ?? [];

    onSuccess(lista);

  } catch (error) {
    alertStore.addAlert(error?.response?.data?.message || 'Erro ao buscar remetentes', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}
