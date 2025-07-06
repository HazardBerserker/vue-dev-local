import ApiService from "@/services/ApiService";
import { useAlertStore } from "@/stores/alertStore";
import { endpoints } from "@/utils/apiEndpoints";

export function urlEDaS3(url) {
  if (!url || typeof url !== 'string') return false;

  const urlEhHttpLocal = url.startsWith('http://');
  return !urlEhHttpLocal;
}

export async function geraUrlTemporariaParaImagemS3(urlDaImagem) {

  let queryParams = new URLSearchParams();
  queryParams.append('path', urlDaImagem);
  const query = `?${queryParams.toString()}`

  const alertStore = useAlertStore()

  const endpoint = endpoints.freteCotacao.geraUrlTemporariaParaImagemS3;
  try {
    const resposta =  await ApiService({
      method: 'get',
      url: `${endpoint}${query}`,
    })

    return  resposta?.data?.data?.original?.url

  } catch (error) {
    alertStore.addAlert(error.response?.data?.message, 'error')
  }
}


