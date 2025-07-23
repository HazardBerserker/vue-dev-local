<template>
  <div>
    <v-breadcrumbs :items="['Fiscal', 'Registrar CTE']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <div class="d-flex ga-2 my-auto justify-end mb-4" v-if="permissao">
      <!-- Ctes Autorizados -->
      <v-card
        width="250"
        class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
        color="green-darken-4"
      >
          <v-avatar size="40" class="me-4 bg-white text-green-darken-4">
              <v-icon>mdi-note-check</v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
              <span class="text-body-2 text-white">CTEs Autorizados</span>
              <v-chip variant="flat" size="small" color="white" class="mt-1 text-green-darken-4">
                  <v-fade-transition mode="out-in">
                      <span v-if="!datatable.carregando">
                      <strong :key="'inativos'">
                        {{ datatable.ctes_autorizados }}
                      </strong>
                    </span>
                      <span v-else>
                        <v-progress-circular indeterminate color="green-darken-2" size="15"></v-progress-circular>
                      </span>
                  </v-fade-transition>
              </v-chip>
          </div>
      </v-card>

      <!-- Ctes Cancelados -->
      <v-card
          width="250"
          class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
          color="red-darken-4"
      >
          <v-avatar size="40" class="me-4 bg-white text-red-darken-4">
              <v-icon>mdi-note-remove</v-icon>
          </v-avatar>
          <div class="d-flex flex-column justify-center">
            <span class="text-body-2 text-white">CTEs Cancelados</span>
              <v-chip variant="flat" size="small" color="white" class="mt-1 text-red-darken-4" loading="true">
                  <v-fade-transition mode="out-in">
                    <span v-if="!datatable.carregando">
                      <strong :key="'inativos'">
                        {{ datatable.ctes_cancelados }}
                      </strong>
                    </span>
                    <span v-else>
                      <v-progress-circular indeterminate color="red" size="15"></v-progress-circular>
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
              </v-row>

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
                  <v-combobox
                    :loading="comboBoxRemetenteLoading"
                    @keyup="(event) => {
                      const tecla = event.key
                      const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                      if (teclaValida) buscarRemetente()
                    }"
                    v-model="filtros.rem_xNome"
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
                  <v-select
                    v-model="filtros.dest_UF"
                    variant="outlined"
                    density="compact"
                    :items="estadosBrasileiros"
                    label="UF Destinatário"
                    item-value="value"
                    item-title="text"
                    clearable
                    hide-details
                  >
                  </v-select>
                </v-col>

                <v-col cols="12" md="2">
                  <InputTextMoeda v-model="filtros.vCarga" prefix="R$" label="Nota:" clearable/>
                </v-col>

                <v-col cols="12" md="2">
                   <v-text-field
                    v-model="filtros.tomador"
                    label="Tomador"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <InputText label="Tom. CNPJ" v-model="filtros.tomador_cnpj" mask="##.###.###/####-##" counter="18" density="compact"/>
                </v-col>

                <v-col cols="12" md="4">
                 <v-text-field
                    v-model="filtros.xObs"
                    label="Observação"
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

    <div class="py-3 d-flex justify-space-between mt-6 flex-md-row flex-column ga-2" v-if="permissao">
      <div class="d-flex ga-2 flex-md-row flex-column">
        <v-btn
          color="grey-darken-3"
          prepend-icon="mdi-reload"
          variant="tonal"
          density="comfortable"
          class="text-white"
          rounded="pill"
          :disabled="datatable.carregando"
          @click="buscaCte"
        >
          Atualizar
        </v-btn>

        <v-btn
          color="green-darken-3"
          prepend-icon="mdi-check"
          variant="tonal"
          density="comfortable"
          class="text-white"
          rounded="pill"
          :disabled="datatable.carregando || desativaInputDeAutorizar"
          @click="autorizaCte"
        >
          Autorizar
        </v-btn>

        <v-btn
          color="red-darken-2"
          prepend-icon="mdi-cancel"
          variant="tonal"
          density="comfortable"
          class="text-white"
          rounded="pill"
          :disabled="datatable.carregando || desativaInputDeCancelar"
          @click="cancelaCte"
        >
          Cancelar
        </v-btn>

        <BtnEmiteCte/>

        <BtnEmiteMDFe/>

        <BtnCreateCte @acrescentaODadoNoArrayLocalmente="onAcrescentaODadoNoArrayLocalmente"/>


      </div>

      <div class="d-flex ga-2 d-flex ga-2 flex-md-row flex-column">
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
          Exportar Excel
        </v-btn>

        <v-btn
          color="lime-darken-3"
          prepend-icon="mdi-file-export"
          variant="tonal"
          density="comfortable"
          class="text-white"
          rounded="pill"
          :disabled="datatable.carregando || datatable.itensSelecionados.length !== 1"
          @click="visualizaXml"
        >
          Visualizar XML
        </v-btn>

        <v-btn
          color="orange-darken-2"
          prepend-icon="mdi-file-export"
          variant="tonal"
          density="comfortable"
          class="text-white"
          rounded="pill"
          :disabled="datatable.carregando || datatable.itensSelecionados.length !== 1"
          @click="visualizaPdf"
        >
          Visualizar PDF
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
            @update:options="buscaCte"
            height="56vh"
            density="comfortable"
            no-data-text="Nenhum Cte encontrado, tente alterar o(s) filtro(s)"
          >
            <template #[`item.status`]="{ item }">
              <v-chip
                prepend-icon="mdi-alert-circle-outline"
                variant="flat"
                size="small"
                :color="item.status == StatusCteEnumDescricao.CANCELADO ? 'red-darken-3' : 'green-darken-3'"
              >
                {{ StatusCteEnum[item.status] }}
              </v-chip>
            </template>
            <template #[`item.vCarga`]="{ item }">
              {{ formataMoeda(item.vCarga) }}
            </template>
            <template #[`item.vTPrest`]="{ item }">
              {{ formataMoeda(item.vTPrest) }}
            </template>
            <template #[`item.tomador_cnpj`]="{ item }">
              {{ formataCNPJ(item.tomador_cnpj) }}
            </template>
            <template #[`footer.prepend`]>
              <div class="d-flex w-100 align-center my-auto ps-4">
                <div
                  class="rounded-circle"
                  style="width: 12px; height: 12px; background-color: #a7d6ff;"
                ></div>
                <div class="ms-4 d-flex align-center text-caption">
                  <span>CTEs que possuem um pagamento associado e não podem ser cancelados</span>
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
import { formataCEP, formataData, formataCNPJ, formataMoeda } from '@/utils/masks';
import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import BtnCreateCte from '@/components/Fiscal/RegistrarCte/Embeeded/BtnCreateCte.vue';
import BtnEmiteCte from '@/components/Fiscal/RegistrarCte/Embeeded/BtnEmiteCte.vue';
import BtnEmiteMDFe from '@/components/Fiscal/RegistrarMDFe/Embeeded/BtnEmiteMDFe.vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { StatusCteEnum, StatusCteEnumDescricao } from '@/Enums/Fiscal/StatusCteEnum';
import { inject } from 'vue'
import { format as formatDate } from 'date-fns'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue';
import InputText from '@/components/Form/InputText.vue';
import { buscaListaDeClientesHelper } from '@/helpers/buscaListaDeClientes';
import { estadosBrasileiros } from '@/Enums/estadosEnum';
import { geraUrlTemporariaParaImagemS3, urlEDaS3 } from '@/helpers/funcoesParaS3';

export default {
  name: 'CtesScreen',
  components: {
    GlobalAlertFixed,
    BtnCreateCte,
    InputTextMoeda,
    InputText,
    BtnEmiteMDFe,
    BtnEmiteCte,
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
    },
    'filtros.rem_xNome'(newValue) {
      if (typeof newValue === 'object') {
        this.filtros.rem_xNome = newValue.razao_social
      }
    },
  },
  data () {

    const hoje = new Date();
    const noventaDiasAtras = new Date();
    noventaDiasAtras.setDate(hoje.getDate() - 90);

    const diaAtualMaisUm = new Date(hoje);
    diaAtualMaisUm.setDate(hoje.getDate() + 1);

    return {
      estadosBrasileiros,
      noventaDiasAtras,
      diaAtualMaisUm,

      formataCEP,
      formataCNPJ,
      formataMoeda,
      StatusCteEnum,
      StatusCteEnumDescricao,
      SimENaoEnumDescricao,
      SimENaoEnum,
      mostrarFiltros: false,
      desativaInputDeAutorizar: false,
      desativaInputDeCancelar: false,
      itemSelecionado: {},
      permissao: false,
      propriedadesDoAlertaFixo: null,
      filtrosAplicadosAntesDaBusca: 0,
      filtrosAplicadosDepoisDaBusca: 0,

      // combobox
      listaDeRemetentes: [],
      comboBoxRemetenteLoading: false,

      filtros: {
        data_inicial_emissao: noventaDiasAtras,
        data_final_emissao: diaAtualMaisUm,
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
        ctes_autorizados: null,
        ctes_cancelados: null,
        itensSelecionados: [],
        carregando: false,
        mensagemCarregando: 'Buscando, aguarde...',
        chave_primaria: 'Id_CTe',
        itens: [],
        itens_por_pagina: [
            {value: 50, title: '50'},
            {value: 100, title: '100'},
            {value: -1, title: 'Todos'},
            // {value: -1, title: 'Todos'}
        ],
        totalRegistros: 0,
        ultima_pagina: 0,
        pagina_atual: 1,
        por_pagina: 50,
        ordenarPor: [{key: 'Id_CTe', order: 'desc'}],
        ordenarDirecao: true,
        opcoes: {},

        cabecalho: [
          {
            title: 'ID CTE',
            key: 'Id_CTe',
            align: 'center',
            width: '210',
            sortable: false,
          },
          {
            title: 'Emissão',
            key: 'dhEmi',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
            width: '250'
          },
          {
            title: 'Status',
            key: 'status',
            align: 'center',
            width: '170',
          },
          {
            title: 'Remetente',
            key: 'rem_xNome',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Destinatário',
            key: 'dest_xNome',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Dest. Cidade',
            key: 'dest_xMun',
            width: '200',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
          },
          {
            title: 'Dest. UF',
            key: 'dest_UF',
            width: '200',
            align:'center',
          },
          {
            title: 'Tomador',
            key: 'tomador',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Tom. CNPJ',
            key: 'tomador_cnpj',
            align: 'center',
            width: '250',
          },
          {
            title: 'Observação',
            key: 'xObs',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'Nota',
            key: 'vCarga',
            align: 'center',
            width: '240'
          },
          {
            title: 'Frete',
            key: 'vTPrest',
            width: '240',
            align:'center',
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

    async visualizaPdf() {

      const item = this.datatable.itens.find(item => {
        return item.Id_CTe == this.datatable.itensSelecionados
      })

      if(!item.pdf_path) {
        const alertStore = useAlertStore()
        alertStore.addAlert(`CTE <strong>${item.Id_CTe}</strong> não possui PDF vinculado, tente outro`, 'warning');
        return
      }

      let urlFinal = item.pdf_path;

      if (urlEDaS3(urlFinal)) {
        urlFinal = await geraUrlTemporariaParaImagemS3(urlFinal);
      }

      window.open(urlFinal, '_blank');
    },

    async visualizaXml() {
      const item = this.datatable.itens.find(item => {
        return item.Id_CTe == this.datatable.itensSelecionados
      })

      if(!item.xml_path) {
        const alertStore = useAlertStore()
        alertStore.addAlert(`CTE <strong>${item.Id_CTe}</strong> não possui XML vinculado, tente outro`, 'warning');
        return
      }

      let urlFinal = item.xml_path;

      if (urlEDaS3(urlFinal)) {
        urlFinal = await geraUrlTemporariaParaImagemS3(urlFinal);
      }

      window.open(urlFinal, '_blank');
    },

    async buscarRemetente() {
      await buscaListaDeClientesHelper(
        this.filtros.rem_xNome,
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

    limpaFiltros() {
      this.filtros = {
        data_inicial_emissao: this.noventaDiasAtras,
        data_final_emissao: this.diaAtualMaisUm,
      }
    },

    desativaOuAtivaBotoes() {
       if(this.datatable.itensSelecionados.length == 1) {

        const alertStore = useAlertStore()

        const item = this.datatable.itens.find(item => {
          return item.Id_CTe == this.datatable.itensSelecionados
        })

        if(!item) {
          alertStore.addAlert('CTE com ID selecionado não encontrado, tente novamente', 'warning');
          return;
        }

        if(item.status == StatusCteEnumDescricao.CANCELADO) {
          this.desativaInputDeCancelar = true
          this.desativaInputDeAutorizar = false
        }

        if(item.status == StatusCteEnumDescricao.AUTORIZADO) {
          this.desativaInputDeAutorizar = true
          this.desativaInputDeCancelar = false
        }

        if(item.possui_pagamento == SimENaoEnumDescricao.SIM) {
          this.desativaInputDeCancelar = true
        }

        this.itemSelecionado = item

        return
      }

      this.itemSelecionado = {}
      this.desativaInputDeAutorizar = true
      this.desativaInputDeCancelar = true
    },

    gerarQuery( page, itemsPerPage, sortBy ) {
      const camposQueADataPrecisaSerConvertida = [
        'data_inicial_emissao',
        'data_final_emissao',
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

    async buscaCte( options = {} ) {
      this.datatable.carregando = true;
      if(!this.permissao) {
        const loading = useLoadingStore()
        loading.show('Carregando Ctes...')
      }
      this.datatable.itensSelecionados = [];

      const {
          page = this.page || 1,
          itemsPerPage = this.itemsPerPage || 50,
          sortBy = this.sortBy || [{ key: 'Id_CTe', order: 'desc' }]
      } = options;

      this.page = page;
      this.itemsPerPage = itemsPerPage;
      this.sortBy = sortBy;

      this.filtrosAplicadosDepoisDaBusca = this.filtrosAplicadosAntesDaBusca

      try {
        const query = this.gerarQuery(this.page, this.itemsPerPage, this.sortBy);
        const url = endpoints.cte.datatable;

        const resposta =  await ApiService({
          method: 'get',
          url: `${url}/${query}`,
        })

        this.permissao = true

        if(resposta?.data) {
          this.datatable.itens = resposta.data.data.itens;
          this.datatable.totalRegistros = resposta.data.data.total;
          this.datatable.ctes_autorizados = resposta.data.data.ctes_autorizados;
          this.datatable.ctes_cancelados = resposta.data.data.ctes_cancelados;
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

    async cancelaCte() {
      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      if(this.datatable.itensSelecionados.length != 1) {
        alertStore.addAlert('Selecione um item por vez para Cancelar', 'warning');
        return
      }

      if(!this.itemSelecionado) {
        alertStore.addAlert('CTE com ID selecionado não encontrado, tente novamente', 'warning');
        return;
      }

      if(this.itemSelecionado.possui_pagamento == SimENaoEnumDescricao.SIM) {
        alertStore.addAlert('O CTE possui um Pagamento associado e não pode ser cancelado', 'warning');
        return
      }

      const mensagem = `Deseja realmente Cancelar o CTE de ID <strong>${this.datatable.itensSelecionados[0]}</strong> ?`

      const confirmado = await this.dialog.value.open({
        title: `Cancelar CTE`,
        message: mensagem,
        titleColor: 'error'
      })

      if(!confirmado) {
        return
      }

      loading.show('Cancelando CTE...')
      const url = `${endpoints.cte.cancela}/${this.datatable.itensSelecionados[0]}`;

      try {
        const resposta =  await ApiService({
          method: 'delete',
          url: `${url}`,
        })

        alertStore.addAlert(
          `${resposta?.data?.message}`,
          'success'
        );

        this.itemSelecionado.status = StatusCteEnumDescricao.CANCELADO
        this.datatable.ctes_autorizados -= 1
        this.datatable.ctes_cancelados += 1

        this.datatable.itensSelecionados = [];
        this.itemSelecionado = {};

      } catch (error) {
        alertStore.addAlert(`Erro ao Cancelar CTE: ${error?.response?.data?.message}`, 'error');
      } finally {
        loading.hide()
      }
    },

    async autorizaCte() {
      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      if(this.datatable.itensSelecionados.length != 1) {
        alertStore.addAlert('Selecione um item por vez para Autorizar', 'warning');
        return
      }

      if(!this.itemSelecionado) {
        alertStore.addAlert('CTE com ID selecionado não encontrado, tente novamente', 'warning');
        return;
      }

      const mensagem = `Deseja realmente Autorizar o CTE de ID <strong>${this.datatable.itensSelecionados[0]}</strong> ?`

      const confirmado = await this.dialog.value.open({
        title: `Desativar CTE`,
        message: mensagem,
        titleColor: 'success'
      })

      if(!confirmado) {
        return
      }

      loading.show('Autorizando CTE...')
      const url = `${endpoints.cte.autoriza}/${this.itemSelecionado.Id_CTe}`;

      try {
        const resposta =  await ApiService({
          method: 'post',
          url: `${url}`,
        })

        alertStore.addAlert(
          `${resposta?.data?.message}`,
          'success'
        );

        this.itemSelecionado.status = StatusCteEnumDescricao.AUTORIZADO
        this.datatable.ctes_autorizados += 1
        this.datatable.ctes_cancelados -= 1

        this.datatable.itensSelecionados = [];
        this.itemSelecionado = {};

      } catch (error) {
        alertStore.addAlert(`Erro ao Autorizar CTE: ${error?.response?.data?.message}`, 'error');
      } finally {
        loading.hide()
      }
    },

    onAcrescentaODadoNoArrayLocalmente(itemCriado) {
      const novoItem = {
        Id_CTe: itemCriado.Id_CTe,
        rem_xNome: itemCriado.rem_xNome,
        dest_xNome: itemCriado.dest_xNome,
        dest_xMun: itemCriado.dest_xMun,
        dest_UF: itemCriado.dest_UF,
        dhEmi: itemCriado.dhEmi,
        vCarga: itemCriado.vCarga,
        vTPrest: itemCriado.vTPrest,
        status: itemCriado.status,
        possui_pagamento: itemCriado.possui_pagamento,
        data_criacao: formataData(itemCriado.data_criacao),
        usuario_criacao: itemCriado.usuario_criacao,
        usuario_ultima_alteracao: itemCriado.usuario_ultima_alteracao,
        data_ultima_alteracao: formataData(itemCriado.data_ultima_alteracao)
      }
      this.datatable.itens.unshift(novoItem)
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

    // apagarDadosDoArrayLocalmente() {
    //   const arrayFiltrado = this.items.filter(item => {
    //       return !this.datatable.itensSelecionados.includes(item.id_cte);
    //   })
    //   this.datatable.itens = arrayFiltrado
    // },

    regraPintaLinha(item) {
      // 🔵 Azul (pendente ou incompleto)
      if (item.item.possui_pagamento == SimENaoEnumDescricao.SIM)
      {
        return { style: 'background-color: #d6ecff;' }; // azul claro
      }

      // 🔁 Alterna entre linhaPar/linhaImpar como fallback se nenhuma condição for atendida
      return {
        class: item.index % 2 === 0 ? 'linhaPar' : 'linhaImpar', // Alterna classes com base no ID
      };

    },
  }
}

</script>

<style>
.class-on-data-table table {
    table-layout: fixed;
}

</style>
