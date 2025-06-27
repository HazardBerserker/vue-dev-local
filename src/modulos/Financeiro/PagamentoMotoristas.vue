<template>
   <div>
    <v-breadcrumbs :items="['Financeiro', 'Pagamento de Motoristas']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <v-card class="pa-4 rounded-xl elevation-2 bg-grey-lighten-5 d-flex flex-column" width="100%" v-if="permissao">

      <!-- Título -->
      <div class="d-flex justify-space-between">
        <h5 class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-3">Filtros:</h5>
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

              <v-row dense>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.id_frete"
                    label="ID Frete/Cotação"
                    variant="outlined"
                    density="compact"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-date-input
                    v-model="filtros.data_cotacao"
                    label="Data Criação"
                    prepend-icon=""
                    density="compact"
                    prepend-inner-icon="$calendar"
                    :display-format="format"
                    placeholder="dd/mm/yy"
                    clearable
                    variant="outlined"
                  ></v-date-input>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.remetente"
                    label="Remetente"
                    variant="outlined"
                    density="compact"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.cidade_destinatario"
                    label="Cidade Destinatário"
                    variant="outlined"
                    density="compact"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.uf_destinatario"
                    label="UF Destinatário"
                    variant="outlined"
                    density="compact"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="2">
                  <InputTextMoeda v-model="filtros.valor_frete_efetivo" prefix="R$" label="Frete:"/>
                </v-col>

                <v-col cols="12" md="3">
                  <InputTextMoeda v-model="filtros.valor_notafiscal" prefix="R$" label="NF:"/>
                </v-col>

                <v-col cols="12" md="3">
                  <InputTextMoeda v-model="filtros.valor_cobrado_efetivo" prefix="R$" label="Valor Cobrado:"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.status"
                    label="Status"
                    variant="outlined"
                    density="compact"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.cte_vinculado"
                    label="CTE Vinculado"
                    variant="outlined"
                    density="compact"
                    clearable
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
                <span class="text-body-2 font-weight-bold text-blue-darken-2">Fretes a Pagar</span>
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
          <v-col cols="12" md="6">
            <v-card class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between" color="green-lighten-4">
              <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
                <v-avatar size="40" class="me-4 bg-green-darken-2 text-white">
                  <v-icon>mdi-cash-check</v-icon>
                </v-avatar>
                <span class="text-body-2 font-weight-bold text-green-darken-2">Fretes Pagos</span>
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
        </v-row>
      </div>

    </v-card>

    <div class="py-3 justify-space-between mt-6" v-if="permissao">
        <div class="d-flex align-center ga-2">

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
            height="45vh"
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
              <BtnAtualizaFreteCotacoes :item="item" @atualizaODadoNoArrayLocalmente="onAtualizaODadoNoArrayLocalmente"/>
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
            <!-- <template #[`item.status`]="{ item }">
              <v-btn
                :color="selecionaCorDoStatus(item.status)"
                density="comfortable"
                variant="flat"
                rounded="pill"
                :disabled="datatable.carregando"
                @click="exportarExcel"
                readonly
              >
                {{ StatusFreteCotacaoEnum[item.status] }}
              </v-btn>
            </template> -->
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
import BtnAtualizaFreteCotacoes from '@/components/Comercial/FreteCotacoes/Embeeded/BtnAtualizaFreteCotacoes.vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { StatusFreteCotacaoEnum, StatusFreteCotacaoEnumDescricao } from '@/Enums/Comercial/StatusFreteCotacaoEnum';
import { format as formatDate } from 'date-fns'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue';
import { StatusPagamentoEnumDescricao } from '@/Enums/Financeiro/StatusPagamentoEnum';
import { FormaPagamentoEnumDescricao } from '@/Enums/Financeiro/FormaPagamentoEnum';

export default {
  name: 'FretesCotacoes',
  components: {
    GlobalAlertFixed,
    BtnAtualizaFreteCotacoes,
    InputTextMoeda
  },
  data () {
    return {
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
      filtros: {
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
          // {
          //   title: 'Status',
          //   key: 'status',
          //   align: 'center',
          //   width: '210',
          //   sortable: false,
          // },
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
            width: '240',
          },
          {
            title: 'Saldo',
            key: 'saldo',
            align: 'center',
            width: '240',
          },
          {
            title: 'Integral',
            key: 'integral',
            align: 'center',
            width: '240',
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
      this.filtros = []
    },

    gerarQuery( page, itemsPerPage, sortBy ) {
      const camposQueADataPrecisaSerConvertida = [
        'data_cotacao'
      ]

      let arrayDeFiltros = []
      let arrayDeFiltrosGerais = []
      const filtrosInternos = this.filtros

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
            filtrosInternos[chave] = formatDate(filtrosInternos[chave], 'yyyy-MM-dd')
          }
          const filtro = { key: [chave], value: filtrosInternos[chave] };
          arrayDeFiltros.push(filtro)
        }
      }

      let queryParams = new URLSearchParams();

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
      const worksheet = workbook.addWorksheet('Fretes');

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
