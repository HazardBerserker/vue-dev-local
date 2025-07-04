<template>
  <div>
    <v-breadcrumbs :items="['Menu do Cliente', 'Meus Fretes']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <div class="d-flex ga-2 my-auto justify-end mb-4" v-if="permissao">
      <!-- Ctes Autorizados -->
      <v-card
        width="250"
        class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
        color="green-darken-2"
      >
          <v-avatar size="40" class="me-4 bg-white text-green-darken-2">
              <v-icon>mdi-account</v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
              <span class="text-body-2 text-white">Fretes Entregues</span>
              <v-chip variant="flat" size="small" color="white" class="mt-1 text-green-darken-2">
                  <v-fade-transition mode="out-in">
                      <span v-if="!datatable.carregando">
                      <strong :key="'inativos'">
                        {{ numeroDeFretesEntregues() }}
                      </strong>
                    </span>
                      <span v-else>
                        <v-progress-circular indeterminate color="text-green-darken-2" size="15"></v-progress-circular>
                      </span>
                  </v-fade-transition>
              </v-chip>
          </div>
      </v-card>

      <!-- Ctes Cancelados -->
      <v-card
          width="250"
          class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
          color="blue-darken-2"
      >
          <v-avatar size="40" class="me-4 bg-white text-blue-darken-2">
              <v-icon>mdi-account-off</v-icon>
          </v-avatar>
          <div class="d-flex flex-column justify-center">
            <span class="text-body-2 text-white">Fretes em Viagem</span>
              <v-chip variant="flat" size="small" color="white" class="mt-1 text-blue-darken-2" loading="true">
                  <v-fade-transition mode="out-in">
                    <span v-if="!datatable.carregando">
                      <strong :key="'inativos'">
                        {{ numeroDeFretesEmViagem() }}
                      </strong>
                    </span>
                    <span v-else>
                      <v-progress-circular indeterminate color="blue-darken-2" size="15"></v-progress-circular>
                    </span>
                  </v-fade-transition>
              </v-chip>
          </div>
      </v-card>
    </div>

    <v-card class="pa-4 rounded-xl elevation-2 bg-grey-lighten-5 d-flex flex-column mb-4" width="100%" v-if="permissao">

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
                    v-model="filtros.data_inicial_emissao"
                    label="Data Inicial Emissão"
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
                    v-model="filtros.data_final_emissao"
                    label="Data Final Emissão"
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
                    v-model="filtros.data_inicial_entrega"
                    label="Data Inicial Entrega"
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
                    v-model="filtros.data_final_entrega"
                    label="Data Final Entrega"
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
                    v-model="filtros.id_cte"
                    label="ID CTE"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                   <v-text-field
                    v-model="filtros.nota_fiscal"
                    label="Buscar por NF"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                  v-model="filtros.meus_fretes_remetente"
                  label="Remetente"
                  variant="outlined"
                  density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.cte_destinatario"
                    label="Destinatário"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.cte_cidade_destinatario"
                    label="Cidade Destino"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.cte_uf_destinatario"
                    label="UF Destino"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <InputTextMoeda v-model="filtros.frete" prefix="R$" label="Valor Frete" clearable/>
                </v-col>

                <v-col cols="12" md="2">
                  <InputTextMoeda v-model="filtros.valor_nf" prefix="R$" label="Valor NF" clearable/>
                </v-col>
              </v-row>

            </v-card-text>

            <!-- Botão Buscar -->
            <v-card-actions>
              <v-btn
                color="blue-darken-3"
                variant="flat"
                class="text-white"
                @click="buscaFretes"
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
          @click="buscaFretes"
        >
          Atualizar
        </v-btn>

        <v-btn
          color="indigo-darken-3"
          prepend-icon="mdi-file-download"
          variant="tonal"
          density="comfortable"
          class="text-white"
          rounded="pill"
          :disabled="datatable.carregando || desativaInputBaixarComprovante"
          @click="baixarComprovante"
        >
          Baixar Comprovante
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
            show-select
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
            @update:options="buscaFretes"
            height="46vh"
            density="comfortable"
            no-data-text="Nenhum Frete encontrado, tente alterar o(s) filtro(s)"
          >
            <template #[`item.possui_comprovante`]="{ item }">
              <v-icon v-tooltip="'Frete não possui comprovante de entrega'" color="orange-darken-2" v-if="item.arquivo_comprovante == null">
                mdi-alert-circle
              </v-icon>
            </template>
            <template #[`item.detalhes`]="{ item }">
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-icon
                    v-if="isHovering"
                    size="25"
                    v-bind="props"
                    @click="abrirDialogDetalhesFrete(item)"
                    class="cursor-pointer"
                    key="olhoAberto"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
                  v-else
                    size="25"
                    v-bind="props"
                    @click="abrirDialogDetalhesFrete(item)"
                    class="cursor-pointer"
                    key="olhoFechado"
                  >
                    mdi-eye-outline
                  </v-icon>
                </template>
              </v-hover>
            </template>
            <template #[`item.nota_fiscal`]="{ item }">
              <div class="text-truncate" v-tooltip="`${formatarNotasFiscais(item.nota_fiscal)}`">
                {{ formatarNotasFiscais(item.nota_fiscal) }}
              </div>
            </template>
            <template #[`item.frete`]="{ item }">
              {{ formataMoeda(item.frete) }}
            </template>
            <template #[`item.valor_nf`]="{ item }">
              {{ formataMoeda(item.valor_nf) }}
            </template>
            <template #[`item.previsao`]="{ item }">
              {{ calcularDataComPrazo(item.data_emissao, item.prazo) }}
            </template>
            <template #[`footer.prepend`]>
              <div class="d-flex w-100 align-center my-auto ps-6 justify-start">
                <div
                  class="rounded-circle"
                  style="width: 12px; height: 12px; background-color: #a7d6ff;"
                ></div>
                <div class="ms-2 d-flex align-center text-caption">
                  <span>Fretes em viagem</span>
                </div>
                <div
                  class="rounded-circle ms-6"
                  style="width: 12px; height: 12px; background-color: #C8E6C9;"
                ></div>
                <div class="ms-2 d-flex align-center text-caption">
                  <span>Fretes Entregues</span>
                </div>
              </div>
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>
    <MeuFreteDetalhesDialog ref="meuFreteDialog"/>
  </div>
</template>

<script>
import ApiService from '@/services/ApiService';
import { SimENaoEnum, SimENaoEnumDescricao } from '@/Enums/SimENaoEnum';
import { formataCNPJ, formataMoeda } from '@/utils/masks';
import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { StatusCteEnum, StatusCteEnumDescricao } from '@/Enums/Fiscal/StatusCteEnum';
import { inject } from 'vue'
import { format as formatDate } from 'date-fns'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue';
import MeuFreteDetalhesDialog from '@/components/MenuDoCliente/Embeeded/MeuFreteDetalhesDialog.vue';

export default {
  name: 'CtesScreen',
  components: {
    GlobalAlertFixed,
    InputTextMoeda,
    MeuFreteDetalhesDialog
  },
  created() {
    this.dialog = inject('dialog')
    this.quantidadeDeFiltrosAplicados()
  },
  unmounted() {
    this.propriedadesDoAlertaFixo = null
  },
  watch: {
    'datatable.itensSelecionados'() {
      this.desativaOuAtivaBotoes()
    },
    filtros: {
      handler() {
        this.quantidadeDeFiltrosAplicados()
      },
      deep: true
    }
  },
  data () {
    const hoje = new Date();
    const noventaDiasAtras = new Date();
    noventaDiasAtras.setDate(hoje.getDate() - 90);

    return {
      hoje,
      noventaDiasAtras,
      formataCNPJ,
      formataMoeda,
      StatusCteEnum,
      StatusCteEnumDescricao,
      SimENaoEnumDescricao,
      SimENaoEnum,
      mostrarFiltros: false,
      desativaInputBaixarComprovante: false,
      itemSelecionado: {},
      permissao: false,
      propriedadesDoAlertaFixo: null,
      filtrosAplicadosAntesDaBusca: 0,
      filtrosAplicadosDepoisDaBusca: 0,
      filtros: {
        data_inicial_emissao: noventaDiasAtras,
        data_final_emissao: hoje,
      },
      opcoesStatus: [
        {
          label: StatusCteEnum[StatusCteEnumDescricao.AUTORIZADO],
          value: StatusCteEnumDescricao.AUTORIZADO,
        },
        {
          label: StatusCteEnum[StatusCteEnumDescricao.CANCELADO],
          value: StatusCteEnumDescricao.CANCELADO,
        }
      ],
      datatable: {
        itensSelecionados: [],
        carregando: false,
        mensagemCarregando: 'Buscando, aguarde...',
        chave_primaria: 'id_cte',
        itens: [],
        itens_por_pagina: [
          {value: 20, title: '20'},
          {value: 100, title: '100'},
          {value: -1, title: 'Todos'},
        ],
        totalRegistros: 0,
        ultima_pagina: 0,
        pagina_atual: 1,
        por_pagina: 20,
        ordenarPor: [{key: 'id_cte', order: 'desc'}],
        ordenarDirecao: true,
        opcoes: {},

        cabecalho: [
          {
            title: '',
            key: 'possui_comprovante',
            align: 'center',
            width: '150',
            sortable: false,
          },
          {
            title: 'Detalhes',
            key: 'detalhes',
            align: 'center',
            width: '100',
            sortable: false,
          },
          {
            title: 'ID CTE',
            key: 'id_cte',
            align: 'center',
            width: '180',
          },
          {
            title: 'Nota Fiscal',
            key: 'nota_fiscal',
            align: 'center',
            width: '170',
          },
          {
            title: 'Emissão',
            key: 'data_emissao',
            align: 'center',
            width: '250',
          },
          {
            title: 'Remetente',
            key: 'meus_fretes_remetente',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Destinatário',
            key: 'cte_destinatario',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Cidade Destino',
            key: 'cte_cidade_destinatario',
            width: '200',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
          },
          {
            title: 'UF Destino',
            key: 'cte_uf_destinatario',
            width: '150',
            align:'center',
          },
          {
            title: 'Frete',
            key: 'frete',
            align: 'center',
            width: '240'
          },
          {
            title: 'Valor NF',
            key: 'valor_nf',
            width: '240',
            align:'center',
          },
          {
            title: 'Previsão',
            key: 'previsao',
            width: '250',
            align:'center',
          },
          {
            title: 'Entrega',
            key: 'entrega_efetiva',
            width: '250',
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

    calcularDataComPrazo(dataEmissao, prazoEmDias) {
      if (!dataEmissao || isNaN(prazoEmDias)) return '';

      // Se prazo for 0, apenas retorna a data original
      if (prazoEmDias === 0) {
        return dataEmissao;
      }

      // Converte de "dd/mm/yyyy" para "yyyy-mm-dd"
      const [dia, mes, ano] = dataEmissao.split('/');
      const dataConvertida = `${ano}-${mes}-${dia}`;
      const data = new Date(dataConvertida);

      if (isNaN(data.getTime())) return '';

      data.setDate(data.getDate() + prazoEmDias);

      // Retorna no formato brasileiro
      return data.toLocaleDateString('pt-BR');
    },

    abrirDialogDetalhesFrete(frete) {
      this.$refs.meuFreteDialog.abrir(frete);
    },

    formatarNotasFiscais(notasString) {
      if (!notasString) return '';

      return notasString
        .split(',')
        .map(chave => {
          // Extrai substring igual ao PHP (pos 25, 9 chars)
          const parte = chave.substr(25, 9);

          // Converte para número inteiro (remove zeros à esquerda)
          return parseInt(parte, 10);
        })
        .filter(n => !isNaN(n)) // remove valores inválidos
        .join(' / ');
    },

    async baixarComprovante() {
      const alertStore = useAlertStore()
      const loading = useLoadingStore()
      try {
        const urlCompleta = this.itemSelecionado.arquivo_comprovante;
        const nomeArquivo = urlCompleta.split('/').pop();
        const endpoint = endpoints.meusFretes.baixaComprovante;

        loading.show('Baixando Comprovante...')

        const resposta =  await ApiService({
          method: 'get',
          url: `${endpoint}/${nomeArquivo}`,
          responseType: 'blob'
        })

        const urlBlob = window.URL.createObjectURL(new Blob([resposta.data]));

        // Cria o link temporário para download
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', nomeArquivo);

        // Anexa o link ao DOM, dispara o clique e remove o link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Libera o objeto URL para liberar memória
        window.URL.revokeObjectURL(urlBlob);

        alertStore.addAlert('Comprovante Baixado com Sucesso!', 'success')
      } catch (error) {
        alertStore.addAlert(error?.response?.data?.message, 'error')
      } finally {
        loading.hide()
      }
    },

    quantidadeDeFiltrosAplicados() {
      let filtrosAplicadosAntesDaBusca = 0

      for (let filtro in this.filtros) {
        console.log(this.filtros[filtro]);

        if(this.filtros[filtro] != null) {
          filtrosAplicadosAntesDaBusca += 1
          continue
        }
        filtrosAplicadosAntesDaBusca - 1
      }

      this.filtrosAplicadosAntesDaBusca = filtrosAplicadosAntesDaBusca
    },

    limpaFiltros() {
      this.filtros = {
        data_inicial_emissao: this.noventaDiasAtras,
        data_final_emissao: this.hoje,
      }
    },

    desativaOuAtivaBotoes() {
      this.desativaInputBaixarComprovante = false

      if(this.datatable.itensSelecionados.length == 1) {

        const alertStore = useAlertStore()

        const item = this.datatable.itens.find(item => {
          return item.id_cte == this.datatable.itensSelecionados
        })

        if(!item) {
          alertStore.addAlert('CTE com ID selecionado não encontrado, tente novamente', 'warning');
          return;
        }

        if(item.arquivo_comprovante == null) {
          this.desativaInputBaixarComprovante = true
        }

        this.itemSelecionado = item
        return
      }

      this.desativaInputBaixarComprovante = true
    },

    gerarQuery( page, itemsPerPage, sortBy ) {
      const camposQueADataPrecisaSerConvertida = [
        'data_inicial_emissao',
        'data_final_emissao',
        'data_inicial_entrega',
        'data_final_entrega',
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

    numeroDeFretesEntregues() {
      const fretesEntregues = this.datatable.itens.filter(item => {
        return item.entrega_efetiva != null
      })
      return fretesEntregues.length
    },

    numeroDeFretesEmViagem() {
      const fretesEntregues = this.datatable.itens.filter(item => {
        return item.entrega_efetiva == null
      })
      return fretesEntregues.length
    },

    async buscaFretes( options = {} ) {
      this.datatable.carregando = true;
      if(!this.permissao) {
        const loading = useLoadingStore()
        loading.show('Carregando Fretes...')
      }
      this.datatable.itensSelecionados = [];

      const {
          page = this.page || 1,
          itemsPerPage = this.itemsPerPage || 20,
          sortBy = this.sortBy || [{ key: 'id_cte', order: 'desc' }]
      } = options;

      this.page = page;
      this.itemsPerPage = itemsPerPage;
      this.sortBy = sortBy;

      this.filtrosAplicadosDepoisDaBusca = this.filtrosAplicadosAntesDaBusca

      try {
        const query = this.gerarQuery(this.page, this.itemsPerPage, this.sortBy);
        const url = endpoints.meusFretes.datatable;

        console.log(query);


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

    async exportarExcel() {

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('meus-fretes');

      const itensFormatados = this.datatable.itens.map(item => ({
        ...item,
        status: StatusCteEnum[item.status],
        valor_nf: formataMoeda(item.valor_nf),
        frete: formataMoeda(item.frete),
        previsao: this.calcularDataComPrazo(item.data_emissao, item.prazo),
      }));

      // Adicionando cabeçalhos
      worksheet.columns = [
        { header: 'ID CTE', key: 'id_cte', width: 18, style: { alignment: { horizontal: 'center' } } },
        { header: 'Nota Fiscal', key: 'nota_fiscal', width: 17, style: { alignment: { horizontal: 'center' } } },
        { header: 'Emissão', key: 'data_emissao', width: 25, style: { alignment: { horizontal: 'center' } } },
        { header: 'Remetente', key: 'meus_fretes_remetente', width: 35, style: { alignment: { horizontal: 'left' } } },
        { header: 'Destinatário', key: 'cte_destinatario', width: 35, style: { alignment: { horizontal: 'left' } } },
        { header: 'Cidade Destino', key: 'cte_cidade_destinatario', width: 20, style: { alignment: { horizontal: 'left' } } },
        { header: 'UF Destino', key: 'cte_uf_destinatario', width: 15, style: { alignment: { horizontal: 'center' } } },
        { header: 'Frete', key: 'frete', width: 24, style: { alignment: { horizontal: 'center' } } },
        { header: 'Valor NF', key: 'valor_nf', width: 24, style: { alignment: { horizontal: 'center' } } },
        { header: 'Previsão', key: 'previsao', width: 25, style: { alignment: { horizontal: 'center' } } },
        { header: 'Entrega', key: 'entrega_efetiva', width: 25, style: { alignment: { horizontal: 'center' } } },
        { header: 'Data Última Alteração', key: 'data_ultima_alteracao', width: 25 }
      ];

      // Adicionando os dados
      itensFormatados.forEach(item => worksheet.addRow(item));

      // Gerando o arquivo
      const buffer = await workbook.xlsx.writeBuffer();

      // Salvando
      saveAs(new Blob([buffer]), 'ctes.xlsx');
    },

    regraPintaLinha(item) {
      if (item.item.entrega_efetiva == null)
      {
        return { style: 'background-color: #d6ecff;' }; // azul claro
      }

      return { style: 'background-color: #C8E6C9;' }; //verde claro
    },
  }
}

</script>

<style>
.class-on-data-table table {
    table-layout: fixed;
}

</style>
