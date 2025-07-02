<template>
  <div>
    <v-breadcrumbs :items="['Dashboard']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <div v-if="permissao">
      <v-row>
        <v-col cols="12">
          <IndicadoresFrete :dados="dadosIndicadoresFrete" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <GanhosEPerdasCotacoes :dados="dadosganhosEPerdasCotacoes"/>
        </v-col>
        <v-col cols="4">
          <FretesFracionadosDedicados :dados="dadosFretesFracionadosEDedicados"/>
        </v-col>
        <v-col cols="4">
          <FretesOTD :dados="dadosFretesOTD"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <FreteVsMercadoria :dados="dadosFreteVsMercadoria"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <Top5ClientesFaturamentoLinha :dados="dadosTop5ClientesFaturamento"/>
        </v-col>
        <v-col cols="6">
          <Top5ClientesFaturamentoDonut :dados="dadosTop5ClientesFaturamento"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <Top5ClientesQuantidadeCteLinha :dados="dadosTop5ClientesQuantidadeCteLinha"/>
        </v-col>
        <v-col cols="6">
          <Top5ClientesQuantidadeCteDonut :dados="dadosTop5ClientesQuantidadeCteDonut"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <QuantidadeCtePorUF :dados="dadosPorUfQuantidadeCte"/>
        </v-col>
        <v-col cols="6">
          <FaturamentoPorUF :dados="dadosPorUfFaturamento"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <MapaQuantidadeCtePorUf :dados="dadosPorUfQuantidadeCte"/>
        </v-col>
        <v-col cols="6">
          <MapaFaturamentoPorUf :dados="dadosPorUfFaturamento"/>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import ApiService from '@/services/ApiService'
import GanhosEPerdasCotacoes from '@/components/Dashboard/Embeeded/GanhosEPerdasCotacoes.vue';
import FretesFracionadosDedicados from '@/components/Dashboard/Embeeded/FretesFracionadosDedicados.vue';
import { endpoints } from '@/utils/apiEndpoints';
import FretesOTD from '@/components/Dashboard/Embeeded/FretesOTD.vue';
import IndicadoresFrete from '@/components/Dashboard/Embeeded/IndicadoresFrete.vue';
import FreteVsMercadoria from '@/components/Dashboard/Embeeded/FreteVsMercadoria.vue';
import Top5ClientesFaturamentoLinha from '@/components/Dashboard/Embeeded/Top5ClientesFaturamentoLinha.vue';
import Top5ClientesFaturamentoDonut from '@/components/Dashboard/Embeeded/Top5ClientesFaturamentoDonut.vue';
import Top5ClientesQuantidadeCteLinha from '@/components/Dashboard/Embeeded/Top5ClientesQuantidadeCteLinha.vue';
import Top5ClientesQuantidadeCteDonut from '@/components/Dashboard/Embeeded/Top5ClientesQuantidadeCteDonut.vue';
import QuantidadeCtePorUF from '@/components/Dashboard/Embeeded/QuantidadeCtePorUF.vue';
import FaturamentoPorUF from '@/components/Dashboard/Embeeded/FaturamentoPorUF.vue';
import MapaFaturamentoPorUf from '@/components/Dashboard/Embeeded/MapaFaturamentoPorUf.vue';
import MapaQuantidadeCtePorUf from '@/components/Dashboard/Embeeded/MapaQuantidadeCtePorUf.vue';
import { useLoadingStore } from '@/stores/loading';
import { useAlertStore } from '@/stores/alertStore';
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';

export default {
  name: 'DashboardView',
  components: {
    GanhosEPerdasCotacoes,
    FretesFracionadosDedicados,
    FretesOTD,
    IndicadoresFrete,
    FreteVsMercadoria,
    Top5ClientesFaturamentoLinha,
    Top5ClientesFaturamentoDonut,
    Top5ClientesQuantidadeCteLinha,
    Top5ClientesQuantidadeCteDonut,
    QuantidadeCtePorUF,
    FaturamentoPorUF,
    MapaFaturamentoPorUf,
    MapaQuantidadeCtePorUf,
    GlobalAlertFixed
  },
  data() {
    return {
      propriedadesDoAlertaFixo: null,
      dadosganhosEPerdasCotacoes: null,
      dadosFretesFracionadosEDedicados: null,
      dadosFretesOTD: null,
      dadosIndicadoresFrete: null,
      dadosFreteVsMercadoria: null,
      dadosTop5ClientesFaturamento: null,
      dadosTop5ClientesQuantidadeCteLinha: null,
      dadosTop5ClientesQuantidadeCteDonut: null,
      dadosPorUfFaturamento: null,
      dadosPorUfQuantidadeCte: null,
      permissao: false
    };
  },
  async mounted() {
    const loading = useLoadingStore()
    try {
      loading.show('Carregando Gráficos...')
      await this.buscaDashboardUnificado()
      this.permissao = true;
    } catch (error) {
      this.propriedadesDoAlertaFixo = {
        type: 'error',
        text: error?.response?.data?.message,
        title: `Módulo inacessível (${error.status})`
      }
    } finally {
      loading.hide()
    }
  },
  unmounted() {
    this.propriedadesDoAlertaFixo = null
  },
  methods: {
    async buscaDashboardUnificado() {
      try {

        const endpoint = endpoints.dashboard.dashboardUnificado;

        const resposta =  await ApiService({
          method: 'get',
          url: endpoint,
        })

        this.dadosganhosEPerdasCotacoes = resposta.data.ganhosEPerdasCotacoes
        this.dadosFretesFracionadosEDedicados = resposta.data.fretesFracionadosDedicados
        this.dadosFretesOTD = resposta.data.fretesOtd
        this.dadosIndicadoresFrete = resposta.data.obterIndicadores
        this.dadosFreteVsMercadoria = resposta.data.obterComparativoFreteMercadoria
        this.dadosTop5ClientesFaturamento = resposta.data.topClientesFaturamento.linha
        this.dadosTop5ClientesQuantidadeCteLinha = resposta.data.topClientesQuantidade.linha
        this.dadosTop5ClientesQuantidadeCteDonut = resposta.data.topClientesQuantidade.donut
        this.dadosPorUfFaturamento = resposta.data.dadosPorUf.frete
        this.dadosPorUfQuantidadeCte = resposta.data.dadosPorUf.quantidade


      } catch (error) {
        if(this.permissao) {
          const alertStore = useAlertStore()
          alertStore.addAlert(error?.response?.data?.message, 'error', 3000);
          return
        }
        throw error
      }
    },
  }
}
</script>
