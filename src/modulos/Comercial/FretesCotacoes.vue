<template>
   <div>
    <v-breadcrumbs :items="['Comercial', 'Fretes e Cotações']" class="mb-6"></v-breadcrumbs>

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

                <v-col cols="12" md="2">
                  <v-select
                    v-model="filtros.status"
                    variant="outlined"
                    density="compact"
                    :items="opcoesStatus"
                    label="Status"
                    item-value="value"
                    item-title="label"
                    clearable>
                  </v-select>
                </v-col>

                <v-col cols="12" md="3">
                  <v-combobox
                    :loading="comboBoxRemetenteLoading"
                    @keyup="(event) => {
                      const tecla = event.key
                      const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                      if (teclaValida) buscarRemetente()
                    }"
                    v-model="filtros.remetente"
                    density="compact"
                    variant="outlined"
                    label="Remetente"
                    placeholder="Comece a digitar..."
                    :items="listaDeRemetentes"
                    item-title="razao_social"
                    item-value="id_cliente"
                    hide-details
                  ></v-combobox>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.cidade_destinatario"
                    label="Cidade Destinatário"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-select
                    v-model="filtros.uf_destinatario"
                    variant="outlined"
                    density="compact"
                    :items="estadosBrasileiros"
                    label="UF Destinatário"
                    item-value="value"
                    item-title="text"
                    hide-details
                    clearable
                  >
                  </v-select>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="2">
                  <InputTextMoeda v-model="filtros.valor_frete_efetivo" prefix="R$" label="Frete:" hide-details clearable/>
                </v-col>

                <v-col cols="12" md="3">
                  <InputTextMoeda v-model="filtros.valor_notafiscal" prefix="R$" label="NF:" hide-details clearable/>
                </v-col>

                <v-col cols="12" md="3">
                  <InputTextMoeda v-model="filtros.valor_cobrado_efetivo" prefix="R$" label="Valor Cobrado:" hide-details clearable/>
                </v-col>


                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.cte_vinculado"
                    label="CTE Vinculado"
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
          <v-col cols="12" md="4">
            <v-card class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between" color="blue-lighten-4">
              <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
                <v-avatar size="40" class="me-4 bg-blue-darken-2 text-white">
                  <v-icon>mdi-truck</v-icon>
                </v-avatar>
                <div>
                  <v-chip class="me-4" color="blue-darken-4" variant="flat" prepend-icon="mdi-filter-variant" @click="filtrarStatusFreteCotacaoEmAberto">Filtrar</v-chip>
                  <span class="text-body-2 font-weight-bold text-blue-darken-2">Em Aberto</span>
                </div>
              </div>
              <v-card class="mt-3 h-100 rounded-xl bg-blue-darken-2 w-100 text-white text-h5 d-flex align-center justify-center" variant="flat">
                <v-fade-transition mode="out-in">
                  <span v-if="!datatable.carregando">
                    {{ numeroDeCotacoesFreteEmAberto() }}
                  </span>
                  <span v-else>
                    <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
                  </span>
                </v-fade-transition>
              </v-card>
            </v-card>
          </v-col>

          <!-- Aceitas -->
          <v-col cols="12" md="4">
            <v-card class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between" color="green-lighten-4">
              <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
                <v-avatar size="40" class="me-4 bg-green-darken-2 text-white">
                  <v-icon>mdi-check-circle</v-icon>
                </v-avatar>
                <div>
                  <v-chip class="me-4" color="green-darken-4" variant="flat" prepend-icon="mdi-filter-variant" @click="filtrarStatusFreteCotacaoAceitas">Filtrar</v-chip>
                  <span class="text-body-2 font-weight-bold text-green-darken-2">Aceitas</span>
                </div>
              </div>
              <v-card class="mt-3 h-100 rounded-xl bg-green-darken-2 w-100 text-white text-h5 d-flex align-center justify-center" variant="flat">
                <v-fade-transition mode="out-in">
                  <span v-if="!datatable.carregando">
                    {{ numeroDeCotacoesFreteAceitas() }}
                  </span>
                  <span v-else>
                    <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
                  </span>
                </v-fade-transition>
              </v-card>
            </v-card>
          </v-col>

          <!-- Rejeitadas -->
          <v-col cols="12" md="4">
            <v-card class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between" color="red-lighten-4">
              <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
                <v-avatar size="40" class="me-4 bg-red-darken-2 text-white">
                  <v-icon>mdi-close-circle</v-icon>
                </v-avatar>
                <div>
                  <v-chip class="me-4" color="red-darken-4" variant="flat" prepend-icon="mdi-filter-variant" @click="filtrarStatusFreteCotacaoRejeitadas">Filtrar</v-chip>
                  <span class="text-body-2 font-weight-bold text-red-darken-2">Rejeitadas</span>
                </div>
              </div>
              <v-card class="mt-3 h-100 rounded-xl bg-red-darken-2 w-100 text-white text-h5 d-flex align-center justify-center" variant="flat">
                <v-fade-transition mode="out-in">
                  <span v-if="!datatable.carregando">
                    {{ numeroDeCotacoesFreteRejeitadas() }}
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
              <BtnAtualizaFreteCotacoes :item="item" :loading="datatable.carregando" @atualizaODadoNoArrayLocalmente="onAtualizaODadoNoArrayLocalmente"/>
            </template>
            <template #[`item.valor_motorista_efetivo`]="{ item }">
              {{ formataMoeda(item.valor_motorista_efetivo) }}
            </template>
            <template #[`item.valor_cobrado_efetivo`]="{ item }">
              {{ formataMoeda(item.valor_cobrado_efetivo) }}
            </template>
            <template #[`item.valor_notafiscal`]="{ item }">
              {{ formataMoeda(item.valor_notafiscal) }}
            </template>
            <template #[`item.status`]="{ item }">
              <v-btn
                :color="selecionaCorDoStatus(item.status)"
                density="comfortable"
                variant="flat"
                rounded="pill"
                :disabled="datatable.carregando"
                @click="exportarExcel"
                readonly
                :prepend-icon="item.status == StatusFreteCotacaoEnumDescricao.EM_ABERTO ? 'mdi-alert-circle' : 'mdi-check'"
              >
                {{ StatusFreteCotacaoEnum[item.status] }}
              </v-btn>
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ApiService from '@/services/ApiService';
import { formataData, formataDataSomenteData, formataMoeda } from '@/utils/masks';
import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import BtnAtualizaFreteCotacoes from '@/components/Comercial/FreteCotacoes/Embeeded/BtnAtualizaFreteCotacoes.vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { StatusFreteCotacaoEnum, StatusFreteCotacaoEnumDescricao } from '@/Enums/Comercial/StatusFreteCotacaoEnum';
import { format as formatDate } from 'date-fns'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue';
import { buscaListaDeClientesHelper } from '@/helpers/buscaListaDeClientes';
import { SimENaoEnum } from '@/Enums/SimENaoEnum';
import { estadosBrasileiros } from '@/helpers/estadosHelper';

export default {
  name: 'FretesCotacoes',
  components: {
    GlobalAlertFixed,
    BtnAtualizaFreteCotacoes,
    InputTextMoeda
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
    'filtros.remetente'(newValue) {
      if (typeof newValue === 'object') {
        this.filtros.remetente = newValue.razao_social
      }
    },
  },
  data () {
    const hoje = new Date();
    const noventaDiasAtras = new Date();
    noventaDiasAtras.setDate(hoje.getDate() - 90);

    return {
      estadosBrasileiros,
      hoje,
      noventaDiasAtras,
      formataData,
      formataDataSomenteData,
      formataMoeda,
      StatusFreteCotacaoEnumDescricao,
      StatusFreteCotacaoEnum,
      mostrarFiltros: false,
      tab: null,
      permissao: false,
      propriedadesDoAlertaFixo: null,
      filtrosAplicadosAntesDaBusca: 0,
      filtrosAplicadosDepoisDaBusca: 0,

      // combobox
      listaDeRemetentes: [],
      comboBoxRemetenteLoading: false,

      filtros: {
        data_inicial_criacao: noventaDiasAtras,
        data_final_criacao: hoje,
      },
      busca_geral: null,
      filtrosDaBuscaGeral: {
        id_frete: null,
        nome_completo: null,
        cpf: null,
        telefone: null,
        placa_carro: null,
        placa_carreta: null,
        tipo_veiculo: null,
        pix: null,
        uf_residencia: null,
        cidade_residencia: null,
        cep_residencia: null,
        usuario_criacao: null,
        usuario_ultima_alteracao: null,
      },
      opcoesStatus: [
        {
          label: StatusFreteCotacaoEnum[StatusFreteCotacaoEnumDescricao.EM_ABERTO],
          value: StatusFreteCotacaoEnumDescricao.EM_ABERTO,
        },
        {
          label: StatusFreteCotacaoEnum[StatusFreteCotacaoEnumDescricao.ACEITA],
          value: StatusFreteCotacaoEnumDescricao.ACEITA,
        },
        {
          label: StatusFreteCotacaoEnum[StatusFreteCotacaoEnumDescricao.REJEITADA],
          value: StatusFreteCotacaoEnumDescricao.REJEITADA,
        },
      ],
      datatable: {
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
            title: 'Status',
            key: 'status',
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
            title: 'Criação',
            key: 'data_cotacao',
            align: 'center',
            width: '250',
          },
          {
            title: 'Remetente',
            key: 'remetente',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Cidade',
            key: 'cidade_destinatario',
            width: '250',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
          },
          {
            title: 'UF',
            key: 'uf_destinatario',
            align: 'center',
            width: '100'
          },
          {
            title: 'R$ Motorista',
            key: 'valor_motorista_efetivo',
            align: 'center',
            width: '250'
          },
          {
            title: 'R$ Nota Fiscal',
            key: 'valor_notafiscal',
            align: 'center',
            width: '250'
          },
          {
            title: 'Valor Cobrado',
            key: 'valor_cobrado_efetivo',
            align: 'center',
            width: '250'
          },
          {
            title: 'CTE vinculado',
            key: 'cte_vinculado',
            align: 'center',
            width: '300'
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

    filtrarStatusFreteCotacaoEmAberto() {
      if(this.datatable.carregando) return
      this.filtros.status = StatusFreteCotacaoEnumDescricao.EM_ABERTO
      this.buscaFrete()
    },

    filtrarStatusFreteCotacaoRejeitadas() {
      if(this.datatable.carregando) return
      this.filtros.status = StatusFreteCotacaoEnumDescricao.REJEITADA
      this.buscaFrete()
    },

    filtrarStatusFreteCotacaoAceitas() {
      if(this.datatable.carregando) return
      this.filtros.status = StatusFreteCotacaoEnumDescricao.ACEITA
      this.buscaFrete()
    },

    async buscarRemetente() {
      await buscaListaDeClientesHelper(
        this.filtros.remetente,
        (clientes) => {
          this.listaDeRemetentes = clientes;
        },
        (loading) => {
          this.comboBoxRemetenteLoading = loading;
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

    format(date) {
      return formatDate(date, 'dd/MM/yyyy');
    },

    numeroDeCotacoesFreteEmAberto() {
      const itensAtivos = this.datatable.itens.filter(item => {
        return item.status == StatusFreteCotacaoEnumDescricao.EM_ABERTO
      })
      return itensAtivos.length
    },
    numeroDeCotacoesFreteRejeitadas() {
      const itensAtivos = this.datatable.itens.filter(item => {
        return item.status == StatusFreteCotacaoEnumDescricao.REJEITADA
      })
      return itensAtivos.length
    },
    numeroDeCotacoesFreteAceitas() {
      const itensAtivos = this.datatable.itens.filter(item => {
        return item.status == StatusFreteCotacaoEnumDescricao.ACEITA
      })
      return itensAtivos.length
    },


    selecionaCorDoStatus(status) {
      switch (status) {
        case 0:
          return 'red-darken-2'
        case 1:
          return 'blue-darken-2'
        case 2:
          return 'green-darken-2'
      }
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
        const url = endpoints.freteCotacao.datatable;

        const resposta =  await ApiService({
          method: 'get',
          url: `${url}/${query}`,
        })

        this.permissao = true

        if(resposta?.data) {
          this.datatable.itens = resposta.data.data.itens;
          this.datatable.totalRegistros = resposta.data.data.total;
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
        itemQueSeraAtualizado.arquivo_comprovante = itemAtualizado.arquivo_comprovante
        itemQueSeraAtualizado.usuario_criacao = itemAtualizado.usuario_criacao
        itemQueSeraAtualizado.usuario_ultima_alteracao = itemAtualizado.usuario_ultima_alteracao
        itemQueSeraAtualizado.id_usuario_criacao = itemAtualizado.id_usuario_criacao
        itemQueSeraAtualizado.data_criacao = formataData(itemAtualizado.data_criacao)
        itemQueSeraAtualizado.id_usuario_ultima_alteracao = itemAtualizado.id_usuario_ultima_alteracao
        itemQueSeraAtualizado.data_ultima_alteracao = formataData(itemAtualizado.data_ultima_alteracao)
      }
    },

    async exportarExcel() {

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('fretes-cotacoes');

      const itensFormatados = this.datatable.itens.map(item => ({
        ...item,
        ativo: SimENaoEnum[item.ativo],
        // falta o Status
      }));

      // Adicionando cabeçalhos
      worksheet.columns = [
        { header: 'ID Frete', key: 'id_frete', width: 15 },
        { header: 'Data Cotação', key: 'data_cotacao', width: 20 },
        { header: 'ID Resp.', key: 'id_usuario_responsavel', width: 15 },
        { header: 'Usuário Responsável', key: 'nome_usuario_responsavel', width: 25 },
        { header: 'ID Remetente', key: 'id_remetente', width: 15 },
        { header: 'Remetente', key: 'remetente', width: 25 },
        { header: 'CNPJ Destinatário', key: 'cnpj_destinatario', width: 25 },
        { header: 'Nome Destinatário', key: 'nome_destinatario', width: 25 },
        { header: 'CEP Destinatário', key: 'cep_destinatario', width: 15 },
        { header: 'Endereço Destinatário', key: 'endereco_destinatario', width: 30 },
        { header: 'Número Destinatário', key: 'numero_destinatario', width: 15 },
        { header: 'Cidade Destinatário', key: 'cidade_destinatario', width: 25 },
        { header: 'UF Destinatário', key: 'uf_destinatario', width: 10 },
        { header: 'Observações', key: 'observacoes', width: 30 },
        { header: 'Valor Motorista', key: 'valor_motorista', width: 20 },
        { header: 'Valor Motorista Efetivo', key: 'valor_motorista_efetivo', width: 25 },
        { header: 'Valor Nota Fiscal', key: 'valor_notafiscal', width: 20 },
        { header: 'Coef. Margem', key: 'coeficiente_margem', width: 15 },
        { header: 'AdValorem', key: 'advalorem', width: 15 },
        { header: 'Imposto Considerado', key: 'imposto_considerado', width: 20 },
        { header: 'Valor Cobrado Efetivo', key: 'valor_cobrado_efetivo', width: 25 },
        { header: 'Valor Cobrado', key: 'valor_cobrado', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Forma Pagamento', key: 'forma_pagamento', width: 20 },
        { header: 'Motivo', key: 'motivo', width: 30 },
        { header: 'Obs Financeiro', key: 'obs_financeiro', width: 25 },
        { header: 'CPF Motorista', key: 'cpf_motorista', width: 20 },
        { header: 'Prazo', key: 'prazo', width: 15 },
        { header: 'CTE Vinculado', key: 'cte_vinculado', width: 20 },
        { header: 'Adiantamento', key: 'adiantamento', width: 15 },
        { header: 'Saldo', key: 'saldo', width: 15 },
        { header: 'Integral', key: 'integral', width: 15 },
        { header: 'Status Pagamento', key: 'status_pagamento', width: 20 },
        { header: 'Coleta Efetiva', key: 'coleta_efetiva', width: 20 },
        { header: 'Entrega Efetiva', key: 'entrega_efetiva', width: 20 },
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

    // apagarDadosDoArrayLocalmente() {
    //   const arrayFiltrado = this.items.filter(item => {
    //       return !this.datatable.itensSelecionados.includes(item.id_frete);
    //   })
    //   this.datatable.itens = arrayFiltrado
    // },

    regraPintaLinha(item) {
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
</style>
