<template>
   <div>
    <v-breadcrumbs :items="['Financeiro', 'Pagamento de Motoristas']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <v-card class="pa-4 rounded-xl elevation-2 bg-grey-lighten-5 d-flex flex-column" width="100%" v-if="permissao">

      <!-- Título -->
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
          <v-card class="rounded-xl elevation-1 mb-4 pa-4" width="100%">
            <v-card-text>
              <v-row dense class="mb-4">
                <v-col cols="12" md="3">
                  <v-date-input
                    v-model="filtros.data_inicial_criacao"
                    label="Data Inicial Criação"
                    prepend-icon=""
                    density="compact"
                    prepend-inner-icon="$calendar"
                    placeholder="dd/mm/yy"
                    clearable
                    variant="outlined"
                    hide-details
                  ></v-date-input>
                </v-col>

                <v-col cols="12" md="3">
                  <v-date-input
                    v-model="filtros.data_final_criacao"
                    label="Data Final Criação"
                    prepend-icon=""
                    density="compact"
                    prepend-inner-icon="$calendar"
                    placeholder="dd/mm/yy"
                    clearable
                    variant="outlined"
                    hide-details
                  ></v-date-input>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.id_frete"
                    label="ID Frete/Cotação"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.cte_vinculado"
                    label="CTE Vinculado"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-combobox
                    :loading="comboBoxTomadorLoading"
                    @keyup="(event) => {
                      const tecla = event.key
                      const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                      if (teclaValida) buscarTomador()
                    }"
                    v-model="filtros.tomador"
                    density="compact"
                    variant="outlined"
                    label="Tomador"
                    placeholder="Comece a digitar..."
                    :items="listaDeTomadores"
                    item-title="razao_social"
                    item-value="id_cliente"
                    hide-details
                  ></v-combobox>
                </v-col>

                <v-col cols="12" md="2">
                  <v-select v-model="filtros.adiantamento" density="compact" variant="outlined" label="Adiantamento:" :items="opcoesSImENao" itemTitle="descricao" hide-details itemValue="valor" clearable></v-select>
                </v-col>

                <v-col cols="12" md="2">
                  <v-select v-model="filtros.saldo" density="compact" variant="outlined" label="Saldo:" :items="opcoesSImENao" itemTitle="descricao" itemValue="valor" hide-details clearable></v-select>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="2">
                  <v-select v-model="filtros.integral" density="compact" variant="outlined" label="Integral:" :items="opcoesSImENao" itemTitle="descricao" itemValue="valor" hide-details clearable></v-select>
                </v-col>

                <v-col cols="12" md="3">
                  <v-combobox
                    :loading="comboBoxMotoristaLoading"
                    @keyup="(event) => {
                      const tecla = event.key
                      const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                      if (teclaValida) buscarMotorista()
                    }"
                    v-model="filtros.nome_motorista"
                    density="compact"
                    variant="outlined"
                    label="Motorista"
                    placeholder="Comece a digitar..."
                    :items="listaDeMotoristas"
                    item-title="nome_completo"
                    item-value="id_motorista"
                    hide-details
                  ></v-combobox>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.pix_motorista"
                    label="PiX Motorista"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

            </v-card-text>

            <!-- Botão Buscar -->
            <v-card-actions>
              <v-btn
                color="blue-darken-3"
                variant="flat"
                class="text-white"
                @click="buscaFrete"
                rounded="pill"
                prepend-icon="mdi-magnify"
              >
                Buscar
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-expand-transition>

      <v-divider></v-divider>

      <!-- KPIs / Status -->
      <div class="d-flex flex-column ga-2 mt-4">
        <v-row dense>
          <!-- Em Aberto -->
          <v-col cols="12" md="6">
            <v-card class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between" color="blue-lighten-4">
              <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
                <v-avatar size="40" class="me-4 bg-blue-darken-2 text-white">
                  <v-icon>mdi-cash-clock</v-icon>
                </v-avatar>

                <div>
                  <v-chip class="me-4" color="blue-darken-4" variant="flat" prepend-icon="mdi-filter-variant" @click="filtrarPorPagamentosEmAberto">Filtrar</v-chip>
                  <span class="text-body-2 font-weight-bold text-blue-darken-2">Fretes a Pagar</span>
                </div>
              </div>
              <v-card class="mt-3 h-100 rounded-xl bg-blue-darken-2 w-100 text-white text-h5 d-flex align-center justify-center" variant="flat">
                <v-fade-transition mode="out-in">
                  <span v-if="!datatable.carregando">
                    {{ formataMoeda(datatable.fretes_a_pagar) }}
                  </span>
                  <span v-else>
                    <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
                  </span>
                </v-fade-transition>
              </v-card>
            </v-card>
          </v-col>

          <!-- Aceitas -->
          <v-col cols="12" md="6">
            <v-card class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between" color="green-lighten-4">
              <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
                <v-avatar size="40" class="me-4 bg-green-darken-2 text-white">
                  <v-icon>mdi-cash-check</v-icon>
                </v-avatar>

                <div>
                  <v-chip class="me-4" color="green-darken-4" variant="flat" prepend-icon="mdi-filter-variant" @click="filtrarPorPagamentosRealizados">Filtrar</v-chip>
                  <span class="text-body-2 font-weight-bold text-green-darken-2">Fretes Pagos</span>
                </div>
              </div>
              <v-card class="mt-3 h-100 rounded-xl bg-green-darken-2 w-100 text-white text-h5 d-flex align-center justify-center" variant="flat">
                <v-fade-transition mode="out-in">
                  <span v-if="!datatable.carregando">
                    {{ formataMoeda(datatable.fretes_pagos) }}
                  </span>
                  <span v-else>
                    <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
                  </span>
                </v-fade-transition>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </div>

    </v-card>

    <div class="py-3 justify-space-between mt-6" v-if="permissao">
        <div class="d-flex align-center ga-2 flex-md-row flex-column ">

          <v-btn
            color="grey-darken-3"
            prepend-icon="mdi-reload"
            variant="tonal"
            density="comfortable"
            class="text-white"
            rounded="pill"
            :disabled="datatable.carregando"
            @click="buscaFrete"
          >
            Atualizar
          </v-btn>

          <v-btn
            color="teal-darken-2"
            prepend-icon="mdi-file-export"
            variant="tonal"
            density="comfortable"
            class="text-white"
            rounded="pill"
            :disabled="datatable.carregando"
            @click="exportarExcel"
          >
            Exportar
          </v-btn>
        </div>
    </div>

    <v-row v-show="permissao">
      <v-col cols="12" class="text-right">
        <v-card rounded="lg" elevation="3">
          <v-data-table-server
            fixed-header
            v-model="datatable.itensSelecionados"
            v-model:sort-by="datatable.ordenarPor"
            :headers="datatable.cabecalho"
            :cell-props="regraPintaLinha"
            :items="datatable.itens"
            :items-length="datatable.totalRegistros"
            :page="datatable.pagina_atual"
            :items-per-page="datatable.por_pagina"
            :items-per-page-options="datatable.itens_por_pagina"
            items-per-page-text="Itens por página"
            :loading="datatable.carregando"
            :item-value="datatable.chave_primaria"
            multi-sort
            loading-text="Buscando, aguarde..."
            class="elevation-3 class-on-data-table hoverable-row"
            @update:options="buscaFrete"
            height="62vh"
            density="comfortable"
            no-data-text="Nenhum Frete encontrado, tente alterar o(s) filtro(s)"
          >
            <template #[`item.ativo`]="{ item }">
              <v-chip
                prepend-icon="mdi-alert-circle-outline"
                variant="flat"
                size="small"
                :color="item.ativo == SimENaoEnumDescricao.NAO ? 'red-darken-3' : 'primary'"
              >
                {{ SimENaoEnum[item.ativo] }}
              </v-chip>
            </template>
            <template #[`item.acao`]="{ item }">
              <BtnAtualizaPagamentoMotoristas :item="item" :loading="datatable.carregando" @atualizaODadoNoArrayLocalmente="onAtualizaODadoNoArrayLocalmente"/>
            </template>
            <template #[`item.valor_cobrado_efetivo`]="{ item }">
              {{ formataMoeda(item.valor_cobrado_efetivo) }}
            </template>
            <template #[`item.adiantamento`]="{ item }">
              <div v-html="formataAdiantamento(item)"></div>
            </template>
            <template #[`item.saldo`]="{ item }">
              <div v-html="formataSaldo(item)"></div>
            </template>
            <template #[`item.integral`]="{ item }">
              <div v-html="formataIntegral(item)"></div>
            </template>
            <template #[`item.percentual_motorista`]="{ item }">
             {{ calculaPercentualMotorista(item)}}
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ApiService from '@/services/ApiService';
import { SimENaoEnum, SimENaoEnumDescricao } from '@/Enums/SimENaoEnum';
import { formataData, formataDataSomenteData, formataMoeda } from '@/utils/masks';
import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import BtnAtualizaPagamentoMotoristas from '@/components/Financeiro/PagamentoMotoristas/Embeeded/BtnAtualizaPagamentoMotoristas.vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { StatusFreteCotacaoEnum } from '@/Enums/Comercial/StatusFreteCotacaoEnum';
import { format as formatDate } from 'date-fns'
import { StatusPagamentoEnumDescricao } from '@/Enums/Financeiro/StatusPagamentoEnum';
import { FormaPagamentoEnumDescricao } from '@/Enums/Financeiro/FormaPagamentoEnum';
import { buscaListaDeClientesHelper } from '@/helpers/buscaListaDeClientes';
import { buscaListaDeMotoristasHelper } from '@/helpers/buscaListaDeMotoristas';

export default {
  name: 'FretesCotacoes',
  components: {
    GlobalAlertFixed,
    BtnAtualizaPagamentoMotoristas,
  },
  created() {
    this.quantidadeDeFiltrosAplicados()
  },
  unmounted() {
    this.propriedadesDoAlertaFixo = null
  },
  watch: {
    filtros: {
      handler() {
        this.quantidadeDeFiltrosAplicados()
      },
      deep: true
    },
    'filtros.tomador'(newValue) {
      if (typeof newValue === 'object') {
        this.filtros.tomador = newValue.razao_social
      }
    },
    'filtros.nome_motorista'(newValue) {
      if (typeof newValue === 'object') {
        this.filtros.nome_motorista = newValue.nome_completo
      }
    },
  },
  data () {
    const hoje = new Date();
    const noventaDiasAtras = new Date();
    noventaDiasAtras.setDate(hoje.getDate() - 90);

    return {
      hoje,
      noventaDiasAtras,
      opcoesSImENao: [
        { valor: 0, descricao: 'Não' },
        { valor: 1, descricao: 'Sim' },
      ],
      formataData,
      formataDataSomenteData,
      formataMoeda,
      StatusFreteCotacaoEnum,
      mostrarFiltros: false,
      tab: null,
      SimENaoEnumDescricao,
      SimENaoEnum,
      permissao: false,
      propriedadesDoAlertaFixo: null,

      // combobox
      listaDeTomadores: [],
      comboBoxTomadorLoading: false,

      // combobox
      listaDeMotoristas: [],
      comboBoxMotoristaLoading: false,

      filtrosAplicadosAntesDaBusca: 0,
      filtrosAplicadosDepoisDaBusca: 0,
      filtros: {
        data_inicial_criacao: noventaDiasAtras,
        data_final_criacao: hoje,
      },
      opcoesAtivo: [
        {
          label: 'Sim',
          value: 1,
        },
        {
          label: 'Não',
          value: 0,
        }
      ],
      datatable: {
        fretes_pagos: null,
        fretes_a_pagar: null,
        itensSelecionados: [],
        carregando: false,
        mensagemCarregando: 'Buscando, aguarde...',
        chave_primaria: 'id_frete',
        itens: [],
        itens_por_pagina: [
            {value: 20, title: '20'},
            {value: 100, title: '100'},
            {value: 400, title: '400'},
            {value: -1, title: 'Todos'},
            // {value: -1, title: 'Todos'}
        ],
        totalRegistros: 0,
        ultima_pagina: 0,
        pagina_atual: 1,
        por_pagina: 20,
        ordenarPor: [{key: 'id_frete', order: 'desc'}],
        ordenarDirecao: true,
        opcoes: {},
        cabecalho: [
          {
            title: 'Ação',
            key: 'acao',
            align: 'center',
            width: '210',
            sortable: false,
          },
          {
            title: 'ID',
            key: 'id_frete',
            align: 'center',
            width: '150',
          },
          {
            title: 'CTE',
            key: 'cte_vinculado',
            align: 'center',
            width: '150',
          },
          {
            title: 'Tomador',
            key: 'tomador',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '300',
          },
          {
            title: 'Adiantamento',
            key: 'adiantamento',
            align: 'center',
            width: '300',
          },
          {
            title: 'Saldo',
            key: 'saldo',
            align: 'center',
            width: '300',
          },
          {
            title: 'Integral',
            key: 'integral',
            align: 'center',
            width: '300',
          },
          {
            title: 'Motorista',
            key: 'nome_motorista',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '300',
          },
          {
            title: 'PIX Motorista',
            key: 'pix_motorista',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '300',
          },
          {
            title: 'Percentual Motorista',
            key: 'percentual_motorista',
            align: 'center',
            width: '250',
          },
          {
            title: 'TOTAL',
            key: 'valor_cobrado_efetivo',
            align: 'center',
            width: '240',
          },
          {
            title: 'Usuário Criação',
            key: 'usuario_criacao',
            width: '300',
            align: 'center',
          },
          {
            title: 'Data Criação',
            key: 'data_criacao',
            width: '250',
            align: 'center',
          },
          {
            title: 'Usuário Última Alteração',
            key: 'usuario_ultima_alteracao',
            width: '300',
            align: 'center',
          },
          {
            title: 'Data Última Alteração',
            key: 'data_ultima_alteracao',
            align: 'center',
            width: '250',
          }
        ]
      },
    }
  },
  methods: {

    async buscarTomador() {
      await buscaListaDeClientesHelper(
        this.filtros.tomador,
        (clientes) => {
          this.listaDeTomadores = clientes;
        },
        (loading) => {
          this.comboBoxTomadorLoading = loading;
        }
      );
    },

    async buscarMotorista() {
      await buscaListaDeMotoristasHelper(
        this.filtros.nome_motorista,
        (motoristas) => {
          this.listaDeMotoristas = motoristas;
        },
        (loading) => {
          this.comboBoxMotoristaLoading = loading;
        }
      );
    },

    quantidadeDeFiltrosAplicados() {
      let filtrosAplicadosAntesDaBusca = 0

      for (let filtro in this.filtros) {
        if(this.filtros[filtro] != null) {
          filtrosAplicadosAntesDaBusca += 1
          continue
        }
        filtrosAplicadosAntesDaBusca - 1
      }

      this.filtrosAplicadosAntesDaBusca = filtrosAplicadosAntesDaBusca
    },

    filtrarPorPagamentosEmAberto() {
      if(this.datatable.carregando) return
      this.filtros.status_pagamento = StatusPagamentoEnumDescricao.PAGAMENTO_PENDENTE
      this.buscaFrete()
    },

    filtrarPorPagamentosRealizados() {
      if(this.datatable.carregando) return
      this.filtros.status_pagamento = StatusPagamentoEnumDescricao.OK
      this.buscaFrete()
    },

    formataAdiantamento(item) {
      if(item.forma_pagamento == FormaPagamentoEnumDescricao.INTEGRAL) {
        return '-'
      }

      if(item.adiantamento == StatusPagamentoEnumDescricao.PAGAMENTO_PENDENTE) {
        return `A pagar: <strong>${formataMoeda(item.valor_motorista_efetivo * 0.70)}</strong>`
      }

      return 'OK'
    },

    formataSaldo(item) {
      if(item.forma_pagamento == FormaPagamentoEnumDescricao.INTEGRAL) {
        return '-'
      }

      if(item.entrega_efetiva == null) {
        return 'Aguardando Entrega'
      }

      if(item.arquivo_comprovante == null) {
        return 'Aguardando Comprovante'
      }

      if(item.saldo == StatusPagamentoEnumDescricao.PAGAMENTO_PENDENTE) {
        return `A pagar: <strong>${formataMoeda(item.valor_motorista_efetivo * 0.30)}</strong>`
      }

      return 'OK'
    },

    formataIntegral(item) {
      if(item.forma_pagamento == FormaPagamentoEnumDescricao.ADIANTAMENTO_SALDO) {
        return '-'
      }

      if(item.entrega_efetiva == null) {
        return 'Aguardando Entrega'
      }

      if(item.arquivo_comprovante == null) {
        return 'Aguardando Comprovante'
      }

      if(item.integral == SimENaoEnumDescricao.NAO) {
        return `A pagar: <strong>${formataMoeda(item.valor_motorista_efetivo)}</strong>`
      }

      return 'OK'
    },

    calculaPercentualMotorista(item) {
      const valorPercentual = (item.valor_motorista_efetivo / item.valor_cobrado_efetivo) * 100
      return `${Number(valorPercentual.toFixed(2))} %`
    },

    format(date) {
      return formatDate(date, 'dd/MM/yyyy');
    },

    abrirDialogDetalhesFrete(frete) {
      this.$refs.dialogFrete.abrir(frete);
    },

    limpaFiltros() {
      this.filtros = {
        data_inicial_criacao: this.noventaDiasAtras,
        data_final_criacao: this.hoje,
      }
    },

    gerarQuery( page, itemsPerPage, sortBy ) {
      const camposQueADataPrecisaSerConvertida = [
        'data_inicial_criacao',
        'data_final_criacao'
      ]

      let arrayDeFiltros = []
      let arrayDeFiltrosGerais = []
      const filtrosInternos = this.filtros
      let queryParams = new URLSearchParams();

      for (const chave in this.filtrosDaBuscaGeral) {
        if (this.busca_geral != null && this.busca_geral !== '') {
          const filtro = {
            key: [chave], value: this.busca_geral
          }
          arrayDeFiltrosGerais.push(filtro)
        }
      }

      //laço iterativo para fazer buscar apenas os filtros que estao preenchidos
      for (const chave in filtrosInternos) {
        if (filtrosInternos[chave] != null && filtrosInternos[chave] !== '') {
          if(camposQueADataPrecisaSerConvertida.includes(chave)) {
            const dataFormatada = formatDate(filtrosInternos[chave], 'yyyy-MM-dd');
            queryParams.append(chave, dataFormatada);
            continue
          }
          const filtro = { key: [chave], value: filtrosInternos[chave] };
          arrayDeFiltros.push(filtro)
        }
      }

      queryParams.append('por_pagina', itemsPerPage);
      queryParams.append('pagina_atual', page);

      sortBy.forEach(({ key, order }) => {
        queryParams.append(`ordem[${key}]`, order);
      });

      arrayDeFiltros.forEach(({ key, value }) => {
        queryParams.append(`filtro[${key}]`, value);
      });

      arrayDeFiltrosGerais.forEach(({ key, value }) => {
        queryParams.append(`filtro[${key}]`, value);
      });

      return `?${queryParams.toString()}`;
    },

    async buscaFrete( options = {} ) {
      this.datatable.carregando = true;

      if(!this.permissao) {
        const loading = useLoadingStore()
        loading.show('Carregando Tabela...')
      }
      this.datatable.itensSelecionados = [];

      const {
          page = this.page || 1,
          itemsPerPage = this.itemsPerPage || 20,
          sortBy = this.sortBy || [{ key: 'id_frete', order: 'desc' }]
      } = options;

      this.page = page;
      this.itemsPerPage = itemsPerPage;
      this.sortBy = sortBy;

      this.filtrosAplicadosDepoisDaBusca = this.filtrosAplicadosAntesDaBusca

      try {
        const query = this.gerarQuery(this.page, this.itemsPerPage, this.sortBy);
        const url = endpoints.freteCotacao.datatableFinanceiro;

        const resposta =  await ApiService({
          method: 'get',
          url: `${url}/${query}`,
        })

        this.permissao = true

        if(resposta?.data) {
          this.datatable.itens = resposta.data.data.itens;
          this.datatable.totalRegistros = resposta.data.data.total;
          this.datatable.fretes_pagos = resposta.data.data.fretes_pagos;
          this.datatable.fretes_a_pagar = resposta.data.data.fretes_a_pagar;
        }

      } catch (error) {
        if(this.permissao) {
          const alertStore = useAlertStore()
          alertStore.addAlert(error?.response?.data?.message, 'error', 3000);
          return
        }
        this.propriedadesDoAlertaFixo = {
          type: 'error',
          text: error?.response?.data?.message,
          title: `Módulo inacessível (${error.status})`
        }
      } finally {
        this.datatable.carregando = false;
        const loading = useLoadingStore()
        loading.hide()
      }
    },

    onAtualizaODadoNoArrayLocalmente(itemAtualizado) {
      const itemQueSeraAtualizado = this.datatable.itens.find(i => i.id_frete == itemAtualizado.id_frete);

      const adiantamentoNaoMudou = itemQueSeraAtualizado.adiantamento == itemAtualizado.adiantamento
      const saldoNaoMudou = itemQueSeraAtualizado.saldo == itemAtualizado.saldo
      const integralNaoMudou = itemQueSeraAtualizado.integral == itemAtualizado.integral

      // ATUALIZANDO OS DADOS DOS CARDS
      if( !adiantamentoNaoMudou || !saldoNaoMudou || !integralNaoMudou) {
        this.atualizaDadoDosCardsLocalmente(itemQueSeraAtualizado, itemAtualizado)
      }

      if (itemQueSeraAtualizado) {
        itemQueSeraAtualizado.id_frete = itemAtualizado.id_frete
        itemQueSeraAtualizado.data_cotacao = formataDataSomenteData(itemAtualizado.data_cotacao)
        itemQueSeraAtualizado.id_usuario_responsavel = itemAtualizado.id_usuario_responsavel
        itemQueSeraAtualizado.nome_usuario_responsavel = itemAtualizado.nome_usuario_responsavel
        itemQueSeraAtualizado.id_remetente = itemAtualizado.id_remetente
        itemQueSeraAtualizado.cnpj_destinatario = itemAtualizado.cnpj_destinatario
        itemQueSeraAtualizado.nome_destinatario = itemAtualizado.nome_destinatario
        itemQueSeraAtualizado.cep_destinatario = itemAtualizado.cep_destinatario
        itemQueSeraAtualizado.endereco_destinatario = itemAtualizado.endereco_destinatario
        itemQueSeraAtualizado.numero_destinatario = itemAtualizado.numero_destinatario
        itemQueSeraAtualizado.cidade_destinatario = itemAtualizado.cidade_destinatario
        itemQueSeraAtualizado.uf_destinatario = itemAtualizado.uf_destinatario
        itemQueSeraAtualizado.observacoes = itemAtualizado.observacoes
        itemQueSeraAtualizado.valor_motorista = itemAtualizado.valor_motorista
        itemQueSeraAtualizado.valor_motorista_efetivo = itemAtualizado.valor_motorista_efetivo
        itemQueSeraAtualizado.valor_notafiscal = itemAtualizado.valor_notafiscal
        itemQueSeraAtualizado.coeficiente_margem = itemAtualizado.coeficiente_margem
        itemQueSeraAtualizado.advalorem = itemAtualizado.advalorem
        itemQueSeraAtualizado.imposto_considerado = itemAtualizado.imposto_considerado
        itemQueSeraAtualizado.valor_cobrado_efetivo = itemAtualizado.valor_cobrado_efetivo
        itemQueSeraAtualizado.valor_cobrado = itemAtualizado.valor_cobrado
        itemQueSeraAtualizado.status = itemAtualizado.status
        itemQueSeraAtualizado.forma_pagamento = itemAtualizado.forma_pagamento
        itemQueSeraAtualizado.motivo = itemAtualizado.motivo
        itemQueSeraAtualizado.obs_financeiro = itemAtualizado.obs_financeiro
        itemQueSeraAtualizado.cpf_motorista = itemAtualizado.cpf_motorista
        itemQueSeraAtualizado.prazo = itemAtualizado.prazo
        itemQueSeraAtualizado.cte_vinculado = itemAtualizado.cte_vinculado
        itemQueSeraAtualizado.adiantamento = itemAtualizado.adiantamento
        itemQueSeraAtualizado.saldo = itemAtualizado.saldo
        itemQueSeraAtualizado.integral = itemAtualizado.integral
        itemQueSeraAtualizado.status_pagamento = itemAtualizado.status_pagamento
        itemQueSeraAtualizado.coleta_efetiva = itemAtualizado.coleta_efetiva
        itemQueSeraAtualizado.entrega_efetiva = itemAtualizado.entrega_efetiva
        itemQueSeraAtualizado.usuario_criacao = itemAtualizado.usuario_criacao
        itemQueSeraAtualizado.usuario_ultima_alteracao = itemAtualizado.usuario_ultima_alteracao
        itemQueSeraAtualizado.id_usuario_criacao = itemAtualizado.id_usuario_criacao
        itemQueSeraAtualizado.data_criacao = formataData(itemAtualizado.data_criacao)
        itemQueSeraAtualizado.id_usuario_ultima_alteracao = itemAtualizado.id_usuario_ultima_alteracao
        itemQueSeraAtualizado.data_ultima_alteracao = formataData(itemAtualizado.data_ultima_alteracao)
      }
    },

    atualizaDadoDosCardsLocalmente(itemQueSeraAtualizado, itemAtualizado) {
      const valorEfetivo = itemAtualizado.valor_motorista_efetivo ?? 0;
      if (valorEfetivo <= 0) return;

      if (itemQueSeraAtualizado.adiantamento != itemAtualizado.adiantamento) {
        if (itemAtualizado.adiantamento == StatusPagamentoEnumDescricao.OK) {
          // Agora é pago o adiantamento
          const valor = valorEfetivo * 0.70;
          this.datatable.fretes_pagos += valor;
          this.datatable.fretes_a_pagar -= valor;
        } else {
          // Agora voltou a não estar pago
          const valor = valorEfetivo * 0.70;
          this.datatable.fretes_pagos -= valor;
          this.datatable.fretes_a_pagar += valor;
        }
      }

      if (itemQueSeraAtualizado.saldo != itemAtualizado.saldo) {
        if (itemAtualizado.saldo ==  StatusPagamentoEnumDescricao.OK) {
          const valor = valorEfetivo * 0.30;
          this.datatable.fretes_pagos += valor;
          this.datatable.fretes_a_pagar -= valor;
        } else {
          const valor = valorEfetivo * 0.30;
          this.datatable.fretes_pagos -= valor;
          this.datatable.fretes_a_pagar += valor;
        }
      }

      if (itemQueSeraAtualizado.integral != itemAtualizado.integral) {
        if (itemAtualizado.integral == StatusPagamentoEnumDescricao.OK) {
          const valor = valorEfetivo;
          this.datatable.fretes_pagos += valor;
          this.datatable.fretes_a_pagar -= valor;
        } else {
          const valor = valorEfetivo;
          this.datatable.fretes_pagos -= valor;
          this.datatable.fretes_a_pagar += valor;
        }
      }

    },

    async exportarExcel() {

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('pagamento-motoristas');

      const itensFormatados = this.datatable.itens.map(item => ({
        ...item,
        adiantamento: SimENaoEnum[item.adiantamento],
        saldo: SimENaoEnum[item.saldo],
        integral: SimENaoEnum[item.integral],
        status_pagamento: SimENaoEnum[item.status_pagamento],
        percentual_motorista: this.calculaPercentualMotorista(item),
        valor_cobrado_efetivo: formataMoeda(item.valor_cobrado_efetivo)
      }));

      // Adicionando cabeçalhos
      worksheet.columns = [
        { header: 'ID Frete', key: 'id_frete', width: 15 },
        { header: 'CTE Vinculado', key: 'cte_vinculado', width: 25 },
        { header: 'Tomador', key: 'tomador', width: 15 },
        { header: 'Adiantamento', key: 'adiantamento', width: 15 },
        { header: 'Saldo', key: 'saldo', width: 15 },
        { header: 'Integral', key: 'integral', width: 15 },
        { header: 'Status Pagamento', key: 'status_pagamento', width: 15 },
        { header: 'Motorista', key: 'nome_motorista', width: 30 },
        { header: 'PIX Motorista', key: 'pix_motorista', width: 30 },
        { header: 'Percentual Motorista', key: 'percentual_motorista', width: 30 },
        { header: 'TOTAL', key: 'valor_cobrado_efetivo', width: 30 },
        { header: 'Usuário Criação', key: 'usuario_criacao', width: 25 },
        { header: 'Usuário Últ. Alteração', key: 'usuario_ultima_alteracao', width: 25 },
        { header: 'ID Usuário Criação', key: 'id_usuario_criacao', width: 20 },
        { header: 'Data Criação', key: 'data_criacao', width: 25 },
        { header: 'ID Usuário Últ. Alteração', key: 'id_usuario_ultima_alteracao', width: 25 },
        { header: 'Data Últ. Alteração', key: 'data_ultima_alteracao', width: 25 }
      ];

      // Adicionando os dados
      itensFormatados.forEach(item => worksheet.addRow(item));

      // Gerando o arquivo
      const buffer = await workbook.xlsx.writeBuffer();

      // Salvando
      saveAs(new Blob([buffer]), 'fretes.xlsx');
    },

    regraPintaLinha(item) {
      // 🔵 Azul (pendente ou incompleto)
      if (item.item.status_pagamento == StatusPagamentoEnumDescricao.PAGAMENTO_PENDENTE)
      {
        return { style: 'background-color: #d6ecff;' }; // azul claro
      }

      // ✅ Verde (completo)
      if (item.item.status_pagamento == StatusPagamentoEnumDescricao.OK)
      {
        return { style: 'background-color: #c8e6c9;' }; // verde claro
      }
      // 🔁 Alterna entre linhaPar/linhaImpar como fallback se nenhuma condição for atendida
      return {
        class: item.index % 2 === 0 ? 'linhaPar' : 'linhaImpar', // Alterna classes com base no ID
      };

    },

    desativaInput() {
      if(this.datatable.itensSelecionados.length == 0) {
        return true
      }
      return false;
    }
  }
}

</script>

<style>
.class-on-data-table table {
    table-layout: fixed;
}

.linhaAzul {
  background-color: #a8d8fa !important; /* azul claro */
}

.linhaVerde {
  background-color: #bcffc2 !important; /* verde claro */
}

</style>
