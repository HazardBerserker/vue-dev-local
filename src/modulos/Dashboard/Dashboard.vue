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
              @click="restauraFiltros"
              class="mb-3 me-2 align-self-start"
              rounded
            >
              <v-icon start>mdi-restore</v-icon>
              Restaurar Filtros
            </v-btn>
          </v-slide-x-transition>
          <v-slide-x-transition>
            <v-btn
              v-if="mostrarFiltros"
              variant="tonal"
              color="purple"
              @click="filtros.date = gerarTodasAsDatasDoAno(anoAtual)"
              class="mb-3 me-2 align-self-start"
              rounded
            >
              <v-icon start>mdi-filter</v-icon>
              Filtrar ano Atual
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

                <v-col cols="12" lg="4">
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex flex-column">
                        <span class="text-h6 text-grey-darken-1">
                          Preencha os campos para filtragem de dados dinâmica
                        </span>
                        <span class="text-grey-lighten-1 mt-2">
                          <em>Por padrão o Ano Atual ja vem selecionado</em>
                        </span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="filtros.uf"
                        variant="outlined"
                        density="compact"
                        :items="estadosBrasileiros"
                        label="UF Destino"
                        item-value="value"
                        item-title="text"
                        clearable
                        hide-details
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-combobox
                        v-if="acessoDeAdminAoDashboard()"
                          :loading="comboBoxClienteLoading"
                          @keyup="(event) => {
                            const tecla = event.key
                            const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                            if (teclaValida) buscarCliente()
                          }"
                          v-model="filtros.cliente"
                          density="compact"
                          variant="outlined"
                          label="Cliente (tomador)"
                          placeholder="Comece a digitar..."
                          :items="listaDeClientes"
                          item-title="razao_social"
                          item-value="id_cliente"
                          hide-details
                        ></v-combobox>
                        <v-text-field
                          v-else
                          v-model="filtros.cliente"
                          density="compact"
                          variant="outlined"
                          label="Cliente (destinatário)"
                          placeholder="Busca pelo Destinatário..."
                          hide-details
                        ></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12">
                      <v-text-field
                      v-model="filtros.modalidade_frete"
                      label="Modalidade Frete"
                      variant="outlined"
                      density="compact"
                      clearable
                      placeholder="Ex: Fracionado, Dedicado"
                      hide-details
                      ></v-text-field>
                    </v-col> -->
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
          <IndicadoresFrete :dados="dadosIndicadoresFrete" :acessoDeCliente="acessoDeClienteAoDashboard()"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4" v-if="acessoDeAdminAoDashboard()">
          <GanhosEPerdasCotacoes :dados="dadosganhosEPerdasCotacoes"/>
        </v-col>
        <v-col :md="!acessoDeAdminAoDashboard() ? 6 : 4">
          <FretesFracionadosDedicados :dados="dadosFretesFracionadosEDedicados"/>
        </v-col>
        <v-col :md="!acessoDeAdminAoDashboard() ? 6 : 4">
          <FretesOTD :dados="dadosFretesOTD"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <FreteVsMercadoria :dados="dadosFreteVsMercadoria"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" v-if="acessoDeAdminAoDashboard()">
          <Top10ClientesFaturamentoLinha :dados="dadosTop10ClientesFaturamentoLinha" :acessoDeCliente="acessoDeClienteAoDashboard()"/>
        </v-col>
        <v-col md="6" v-if="!acessoDeAdminAoDashboard() && acessoDeClienteAoDashboard()">
          <DestinatarioValoresMercadoria :dados="dadosDestinatarioValoresMercadoria"/>
        </v-col>
        <v-col md="6" v-if="acessoDeAdminAoDashboard()">
          <ParticipacaoClientesFaturamentoDonut :dados="dadosClientesFaturamentoDonut"/>
        </v-col>
        <v-col md="6" v-if="!acessoDeAdminAoDashboard() && acessoDeClienteAoDashboard()">
          <DestinatarioParticipacaoFaturamento :dados="dadosDestinatariosFaturamento"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <Top10ClientesQuantidadeCteLinha :dados="dadosTop10ClientesQuantidadeCteLinha" :acessoDeCliente="acessoDeClienteAoDashboard()"/>
        </v-col>
        <v-col md="6" v-if="acessoDeAdminAoDashboard()">
          <DistribuicaoPeriodoClientesQuantidadeCteDonut :dados="quantidadeCtePorClienteDonut"/>
        </v-col>
        <v-col md="6" v-if="!acessoDeAdminAoDashboard() && acessoDeClienteAoDashboard()">
          <DestinatarioDistribuicaoPeriodoCte :dados="dadosDestinatariosDistribuicaoPeriodo"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <QuantidadeCtePorUF :dados="dadosPorUfQuantidadeCte"/>
        </v-col>
        <v-col md="6">
          <FaturamentoPorUF :dados="dadosPorUfFaturamento"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <MapaQuantidadeCtePorUf :dados="dadosPorUfQuantidadeCte"/>
        </v-col>
        <v-col md="6">
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
import ParticipacaoClientesFaturamentoDonut from '@/components/Dashboard/Embeeded/ParticipacaoClientesFaturamentoDonut.vue';
import Top10ClientesQuantidadeCteLinha from '@/components/Dashboard/Embeeded/Top10ClientesQuantidadeCteLinha.vue';
import DistribuicaoPeriodoClientesQuantidadeCteDonut from '@/components/Dashboard/Embeeded/DistribuicaoPeriodoClientesQuantidadeCteDonut.vue';
import QuantidadeCtePorUF from '@/components/Dashboard/Embeeded/QuantidadeCtePorUF.vue';
import FaturamentoPorUF from '@/components/Dashboard/Embeeded/FaturamentoPorUF.vue';
import MapaFaturamentoPorUf from '@/components/Dashboard/Embeeded/MapaFaturamentoPorUf.vue';
import MapaQuantidadeCtePorUf from '@/components/Dashboard/Embeeded/MapaQuantidadeCtePorUf.vue';
import DestinatarioParticipacaoFaturamento from '@/components/Dashboard/Embeeded/DestinatarioParticipacaoFaturamento.vue';
import DestinatarioDistribuicaoPeriodoCte from '@/components/Dashboard/Embeeded/DestinatarioDistribuicaoPeriodoCte.vue';
import { useLoadingStore } from '@/stores/loading';
import { useAlertStore } from '@/stores/alertStore';
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
import { format } from 'date-fns';
import { buscaListaDeClientesHelper } from '@/helpers/buscaListaDeClientes';
import { estadosBrasileiros } from '@/helpers/estadosHelper';
import dayjs from 'dayjs'
import { SimENaoEnumDescricao } from '@/Enums/SimENaoEnum';
import { useAuthStore } from '@/stores/auth';
import DestinatarioValoresMercadoria from '@/components/Dashboard/Embeeded/DestinatarioValoresMercadoria.vue';

export default {
  name: 'DashboardView',
  components: {
    GanhosEPerdasCotacoes,
    FretesFracionadosDedicados,
    FretesOTD,
    IndicadoresFrete,
    FreteVsMercadoria,
    Top10ClientesFaturamentoLinha,
    ParticipacaoClientesFaturamentoDonut,
    Top10ClientesQuantidadeCteLinha,
    DistribuicaoPeriodoClientesQuantidadeCteDonut,
    QuantidadeCtePorUF,
    FaturamentoPorUF,
    MapaFaturamentoPorUf,
    MapaQuantidadeCtePorUf,
    GlobalAlertFixed,
    DestinatarioParticipacaoFaturamento,
    DestinatarioDistribuicaoPeriodoCte,
    DestinatarioValoresMercadoria
  },
  created() {
    const anoAtual = dayjs().year()
    this.filtros.date = this.gerarTodasAsDatasDoAno(anoAtual)
  },
  watch: {
    filtros: {
      handler() {
        this.quantidadeDeFiltrosAplicados()
      },
      deep: true
    },
    'filtros.cliente'(newValue) {
      if(this.acessoDeClienteAoDashboard && !this.acessoDeAdminAoDashboard) {
        return
      }

      if (typeof newValue === 'object') {
        this.filtros.cliente = newValue.razao_social
      }
    },
  },

  data() {
    const anoAtual = dayjs().year()
    return {
      anoAtual,
      estadosBrasileiros,
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
      dadosTop10ClientesFaturamentoLinha: null,
      dadosClientesFaturamentoDonut: null,
      dadosTop10ClientesQuantidadeCteLinha: null,
      quantidadeCtePorClienteDonut: null,
      dadosPorUfFaturamento: null,
      dadosPorUfQuantidadeCte: null,
      dadosDestinatariosFaturamento: null,
      dadosDestinatariosDistribuicaoPeriodo: null,
      dadosDestinatarioValoresMercadoria: null,
      permissao: false
    };
  },
  computed: {
    userStore() {
      return useAuthStore()
    }
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

    acessoDeAdminAoDashboard() {
      const usuarioEhAdmin = this.userStore?.user?.is_admin == SimENaoEnumDescricao.SIM || this.userStore?.user?.is_super_admin == SimENaoEnumDescricao.SIM
      return usuarioEhAdmin
    },
    acessoDeClienteAoDashboard() {
      const usuarioEhCliente = this.userStore?.user?.id_cliente != null
      return usuarioEhCliente
    },

    gerarTodasAsDatasDoAno(ano) {
      const datas = []
      let data = dayjs(`${ano}-01-01`)
      const ultimaData = dayjs(`${ano}-12-31`)

      while (data.isBefore(ultimaData) || data.isSame(ultimaData, 'day')) {
        datas.push(data.format('YYYY-MM-DD'))
        data = data.add(1, 'day')
      }

      return datas
    },

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

    restauraFiltros() {
      this.filtros = {
        date: null
      }
      this.filtros.date = this.gerarTodasAsDatasDoAno(this.anoAtual)
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
        this.dadosTop10ClientesFaturamentoLinha = resposta.data.clientesFaturamento.linha
        this.dadosClientesFaturamentoDonut = resposta.data.clientesFaturamento.donut
        this.dadosTop10ClientesQuantidadeCteLinha = resposta.data.quantidadeCtePorCliente.linha
        this.quantidadeCtePorClienteDonut = resposta.data.quantidadeCtePorCliente.donut
        this.dadosPorUfFaturamento = resposta.data.dadosPorUf.frete
        this.dadosPorUfQuantidadeCte = resposta.data.dadosPorUf.quantidade
        this.dadosDestinatariosFaturamento = resposta.data.destinatariosFaturamento
        this.dadosDestinatariosDistribuicaoPeriodo = resposta.data.destinatariosDistribuicaoPeriodoCte
        this.dadosDestinatarioValoresMercadoria = resposta.data.destinatarioValoresMercadoria

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
