<template>
  <div>
    <v-breadcrumbs :items="['Dashboard', 'Métricas Gerais']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <v-card class="pa-4 rounded-xl elevation-2 bg-grey-lighten-5 d-flex flex-column mb-3" width="100%" v-if="permissao">

    <div class="d-flex justify-space-between">
        <div class="d-flex ga-3 align-center mb-3">
          <h5 class="text-subtitle-1 font-weight-bold text-grey-darken-3">Filtros:</h5>
          <v-badge :content="filtrosAplicadosDepoisDaBusca">
            <v-chip size="small" label>
              <v-icon start>mdi-account-filter</v-icon>
              aplicados
            </v-chip>
          </v-badge>
        </div>
        <!-- Botão Mostrar/Ocultar -->
        <div>
          <v-slide-x-transition>
            <v-btn
              v-if="mostrarFiltros"
              variant="tonal"
              color="red"
              @click="limpaFiltros"
              class="mb-3 me-2 align-self-start"
              rounded
            >
              <v-icon start>mdi-filter-off</v-icon>
              Limpar Filtros
            </v-btn>
          </v-slide-x-transition>
            <v-btn
              variant="tonal"
              color="primary"
              @click="mostrarFiltros = !mostrarFiltros"
              class="mb-3 align-self-start"
              rounded
            >
              <v-icon start>{{ mostrarFiltros ? 'mdi-eye-off' : 'mdi-filter' }}</v-icon>
              {{ mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros' }}
            </v-btn>
        </div>
      </div>

      <!-- Área dos Filtros -->
      <v-expand-transition>
        <div v-show="mostrarFiltros">
          <v-card class="rounded-xl elevation-0 mb-4 pa-4" width="100%">
            <v-card-text>

              <v-row dense>

                <v-col cols="12" md="4">
                  <v-row>
                    <v-col cols="12">
                      <span class="text-h6 text-grey-darken-1">
                        Preencha os campos para filtragem de dados dinâmica
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                      v-model="filtros.uf"
                        label="UF"
                        variant="outlined"
                        density="compact"
                        clearable
                        placeholder="Busca por UF..."
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-combobox
                        :loading="comboBoxClienteLoading"
                        @keyup="buscarCliente"
                        v-model="filtros.cliente"
                        density="compact"
                        variant="outlined"
                        label="Cliente"
                        placeholder="Comece a digitar..."
                        :items="listaDeClientes"
                        item-title="razao_social"
                        item-value="id_cliente"
                        hide-details
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                      v-model="filtros.modalidade_frete"
                      label="Modalidade Frete"
                      variant="outlined"
                      density="compact"
                      clearable
                      placeholder="Ex: Fracionado, Dedicado"
                      hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col>

                </v-col>
                <v-col cols="12" md="7">
                  <v-date-picker width="100%" v-model="filtros.date" label="ID Frete/Cotação" hide-details multiple="range" show-adjacent-months/>
                </v-col>
              </v-row>
            </v-card-text>

            <!-- Botão Buscar -->
            <v-card-actions>
              <v-btn
                color="blue-darken-3"
                variant="flat"
                class="text-white"
                @click="buscaDashboardUnificado"
                rounded="pill"
                prepend-icon="mdi-magnify"
              >
                Buscar
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-expand-transition>
    </v-card>

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
          <Top10ClientesFaturamentoLinha :dados="dadosTop5ClientesFaturamento"/>
        </v-col>
        <v-col cols="6">
          <Top10ClientesFaturamentoDonut :dados="dadosTop5ClientesFaturamento"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <Top10ClientesQuantidadeCteLinha :dados="dadosTop10ClientesQuantidadeCteLinha"/>
        </v-col>
        <v-col cols="6">
          <DistribuicaoAnualClientesQuantidadeCteDonut :dados="quantidadeCtePorClienteDonut"/>
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
import Top10ClientesFaturamentoLinha from '@/components/Dashboard/Embeeded/Top10ClientesFaturamentoLinha.vue';
import Top10ClientesFaturamentoDonut from '@/components/Dashboard/Embeeded/Top10ClientesFaturamentoDonut.vue';
import Top10ClientesQuantidadeCteLinha from '@/components/Dashboard/Embeeded/Top10ClientesQuantidadeCteLinha.vue';
import DistribuicaoAnualClientesQuantidadeCteDonut from '@/components/Dashboard/Embeeded/DistribuicaoAnualClientesQuantidadeCteDonut.vue';
import QuantidadeCtePorUF from '@/components/Dashboard/Embeeded/QuantidadeCtePorUF.vue';
import FaturamentoPorUF from '@/components/Dashboard/Embeeded/FaturamentoPorUF.vue';
import MapaFaturamentoPorUf from '@/components/Dashboard/Embeeded/MapaFaturamentoPorUf.vue';
import MapaQuantidadeCtePorUf from '@/components/Dashboard/Embeeded/MapaQuantidadeCtePorUf.vue';
import { useLoadingStore } from '@/stores/loading';
import { useAlertStore } from '@/stores/alertStore';
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
import { format } from 'date-fns';
import { buscaListaDeClientesHelper } from '@/helpers/buscaListaDeClientes';

export default {
  name: 'DashboardView',
  components: {
    GanhosEPerdasCotacoes,
    FretesFracionadosDedicados,
    FretesOTD,
    IndicadoresFrete,
    FreteVsMercadoria,
    Top10ClientesFaturamentoLinha,
    Top10ClientesFaturamentoDonut,
    Top10ClientesQuantidadeCteLinha,
    DistribuicaoAnualClientesQuantidadeCteDonut,
    QuantidadeCtePorUF,
    FaturamentoPorUF,
    MapaFaturamentoPorUf,
    MapaQuantidadeCtePorUf,
    GlobalAlertFixed
  },
  watch: {
    filtros: {
      handler() {
        this.quantidadeDeFiltrosAplicados()
      },
      deep: true
    },
    'filtros.cliente'(newValue) {
      if (typeof newValue === 'object') {
        this.filtros.cliente = newValue.razao_social
      }
    },
  },
  data() {
    return {
      mostrarFiltros: false,
      filtrosAplicadosAntesDaBusca: 0,
      filtrosAplicadosDepoisDaBusca: 0,
      filtros: {
        date: null
      },
      // combobox
      listaDeClientes: [],
      comboBoxClienteLoading: false,

      dataInicio: null,
      dataFim: null,
      propriedadesDoAlertaFixo: null,
      dadosganhosEPerdasCotacoes: null,
      dadosFretesFracionadosEDedicados: null,
      dadosFretesOTD: null,
      dadosIndicadoresFrete: null,
      dadosFreteVsMercadoria: null,
      dadosTop5ClientesFaturamento: null,
      dadosTop10ClientesQuantidadeCteLinha: null,
      quantidadeCtePorClienteDonut: null,
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

    async buscarCliente() {
      await buscaListaDeClientesHelper(
        this.filtros.cliente,
        (clientes) => {
          this.listaDeClientes = clientes;
        },
        (loading) => {
          this.comboBoxClienteLoading = loading;
        }
      );
    },

    limpaFiltros() {
      this.filtros = {
        date: null
      }
    },

    async buscaDashboardUnificado() {

      this.filtrosAplicadosDepoisDaBusca = this.filtrosAplicadosAntesDaBusca

      try {

        if(this.permissao) {
          const loading = useLoadingStore()
          loading.show('Atualizando Dados...')
        }


        if(this.filtros?.date != null && this.filtros?.date?.length != 0) {
          this.dataInicio = format(this.filtros.date[0], 'yyyy-MM-dd')
          this.dataFim = format(this.filtros.date[this.filtros.date.length -1], 'yyyy-MM-dd')
        }

        const query = this.gerarQuery()

        const endpoint = `${endpoints.dashboard.dashboardUnificado}?${query}`;

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
        this.dadosTop10ClientesQuantidadeCteLinha = resposta.data.quantidadeCtePorCliente.linha
        this.quantidadeCtePorClienteDonut = resposta.data.quantidadeCtePorCliente.donut
        this.dadosPorUfFaturamento = resposta.data.dadosPorUf.frete
        this.dadosPorUfQuantidadeCte = resposta.data.dadosPorUf.quantidade


      } catch (error) {
        if(this.permissao) {
          const alertStore = useAlertStore()
          alertStore.addAlert(error?.response?.data?.message, 'error', 3000);
          return
        }
        throw error
      } finally {
        if(this.permissao) {
          const loading = useLoadingStore()
          loading.hide()
        }
      }
    },

    gerarQuery() {
      let queryParams = new URLSearchParams();

      if(this.dataInicio) {
        queryParams.append('data_inicial', this.dataInicio);
      }
      if(this.dataFim) {
        queryParams.append('data_final', this.dataFim);
      }
      if(this.filtros?.uf) {
        queryParams.append('uf', this.filtros?.uf);
      }
      if(this.filtros?.cliente) {
        queryParams.append('cliente', this.filtros?.cliente);
      }

      return queryParams
    },

    quantidadeDeFiltrosAplicados() {
      let filtrosAplicadosAntesDaBusca = 0

      for (let filtro in this.filtros) {
        if(this.filtros[filtro] != null && this.filtros[filtro]?.length != 0) {
          filtrosAplicadosAntesDaBusca += 1
          continue
        }
        filtrosAplicadosAntesDaBusca - 1
      }
      this.filtrosAplicadosAntesDaBusca = filtrosAplicadosAntesDaBusca
    },
  }
}
</script>
