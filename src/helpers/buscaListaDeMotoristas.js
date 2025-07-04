import ApiService from '@/services/ApiService';
import { endpoints } from '@/utils/apiEndpoints';
import { useAlertStore } from '@/stores/alertStore';

/**
 * Busca motoristas pelo nome do remetente.
 *
 * @param {string} nomeMotorista - Valor digitado no campo (ex: coleta_remetente)
 * @param {Function} onSuccess - Callback que recebe a lista de motoristas retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function buscaListaDeMotoristasHelper(nomeMotorista, onSuccess, setLoading = null) {
  if (!nomeMotorista) {
    return; // evita buscas com termos curtos
  }

  const alertStore = useAlertStore();

  try {
    if (setLoading) setLoading(true);

    const endpoint = endpoints.motorista.listaPorRazaoSocial;
    const url = `${endpoint}/${nomeMotorista}`;

    const resposta = await ApiService({
      method: 'get',
      url: url,
    });

    const lista = resposta.data?.data ?? [];

    onSuccess(lista);

  } catch (error) {
    alertStore.addAlert(error?.response?.data?.message || 'Erro ao buscar motoristas', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}
