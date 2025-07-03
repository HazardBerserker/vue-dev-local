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

              <v-row dense>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.Id_CTe"
                    label="ID CTE"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-select
                    v-model="filtros.status"
                    hide-details
                    label="Busca por Status"
                    variant="outlined"
                    density="compact"
                    :items="opcoesStatus"
                    item-value="value"
                    item-title="label"
                    bg-color="white"
                    clearable
                  ></v-select>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.rem_xNome"
                    label="Remetente"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.dest_xNome"
                    label="Destinatário"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.dest_xMun"
                    label="Cidade Destinatário"
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
                    v-model="filtros.dest_UF"
                    label="UF Destinatário"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-date-input
                    v-model="filtros.dhEmi"
                    label="Data Emissão"
                    prepend-icon=""
                    density="compact"
                    prepend-inner-icon="$calendar"
                    placeholder="dd/mm/yy"
                    clearable
                    variant="outlined"
                  ></v-date-input>
                </v-col>

                <v-col cols="12" md="3">
                  <InputTextMoeda v-model="filtros.vCarga" prefix="R$" label="Nota:" clearable/>
                </v-col>

                <v-col cols="12" md="3">
                  <InputTextMoeda v-model="filtros.vTPrest" prefix="R$" label="Frete:" clearable/>
                </v-col>
              </v-row>

            </v-card-text>

            <!-- Botão Buscar -->
            <v-card-actions>
              <v-btn
                color="blue-darken-3"
                variant="flat"
                class="text-white"
                @click="buscaCte"
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
            <template #[`item.frete`]="{ item }">
              {{ formataMoeda(item.frete) }}
            </template>
            <template #[`item.valor_nf`]="{ item }">
              {{ formataMoeda(item.valor_nf) }}
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

export default {
  name: 'CtesScreen',
  components: {
    GlobalAlertFixed,
    InputTextMoeda
  },
  created() {
    this.dialog = inject('dialog')
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
    return {
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
            // {value: -1, title: 'Todos'}
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
            title: 'Remetente',
            key: 'remetente',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Destinatário',
            key: 'destinatario',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Cidade Destino',
            key: 'cidade_destinatario',
            width: '200',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
          },
          {
            title: 'UF Destino',
            key: 'uf_destinatario',
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
            title: 'Data Criação',
            key: 'data_criacao',
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
    baixarComprovante() {

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

    limpaFiltros() {
      this.filtros = {}
    },

    desativaOuAtivaBotoes() {
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

      this.desativaInputBaixarComprovante = false
    },

    gerarQuery( page, itemsPerPage, sortBy ) {
      const camposQueADataPrecisaSerConvertida = [
        'dhEmi'
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
          alertStore.addAlert(error.message, 'error', 3000);
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
      const worksheet = workbook.addWorksheet('Ctes');

      const itensFormatados = this.datatable.itens.map(item => ({
        ...item,
        status: StatusCteEnum[item.status],
        vCarga: formataMoeda(item.vCarga),
        vTPrest: formataMoeda(item.vTPrest),
      }));

      // Adicionando cabeçalhos
      worksheet.columns = [
      { header: 'ID', key: 'Id_CTe', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Remetente', key: 'rem_xNome', width: 40 },
      { header: 'Destinatário', key: 'dest_xNome', width: 40 },
      { header: 'Cidade Destinatário', key: 'dest_xMun', width: 40 },
      { header: 'UF Destinatário', key: 'dest_UF', width: 30 },
      { header: 'Emissão', key: 'dhEmi', width: 25 },
      { header: 'Nota', key: 'vCarga', width: 30 },
      { header: 'Frete', key: 'vTPrest', width: 30 },
      { header: 'Usuário Criação', key: 'usuario_criacao', width: 30 },
      { header: 'Data Criação', key: 'data_criacao', width: 25 },
      { header: 'Usuário Última Alteração', key: 'usuario_ultima_alteracao', width: 30 },
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
