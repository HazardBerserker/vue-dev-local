import ApiService from "@/services/ApiService";
import { useAlertStore } from "@/stores/alertStore";
import { useLoadingStore } from "@/stores/loading";
import { endpoints } from "@/utils/apiEndpoints";

export async function buscaDadosDoClientePeloCNPJ(cnpj) {
  const loading = useLoadingStore()
  const alertStore = useAlertStore()

  const url = `${endpoints.cliente.buscaClienteNaApiDoGoverno}/${cnpj}`;

  try {
    loading.show('Buscando dados...')
    const resposta =  await ApiService({
      method: 'post',
      url: url,
    });

    console.log(resposta);


    alertStore.addAlert('Dados preenchidos automaticamente', 'info')
    return resposta?.data?.data

  } catch (erro) {

    alertStore.addAlert(erro?.response?.data?.message, 'error')
  } finally {
    loading.hide()
  }
}
