<template>
  <div>
    <v-breadcrumbs :items="['Fiscal', 'Controle de MDF-es']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <div class="d-flex ga-2 my-auto justify-end mb-4" v-if="permissao">
      <!-- Manifestos Autorizados -->
      <v-card
        width="250"
        class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
        color="green-darken-4"
      >
          <v-avatar size="40" class="me-4 bg-white text-green-darken-4">
              <v-icon>mdi-note-check</v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
              <span class="text-body-2 text-white">Manifestos Finalizados</span>
              <v-chip variant="flat" size="small" color="white" class="mt-1 text-green-darken-4">
                  <v-fade-transition mode="out-in">
                      <span v-if="!datatable.carregando">
                      <strong :key="'inativos'">
                        {{ datatable.manifestos_finalizados }}
                      </strong>
                    </span>
                      <span v-else>
                        <v-progress-circular indeterminate color="green-darken-2" size="15"></v-progress-circular>
                      </span>
                  </v-fade-transition>
              </v-chip>
          </div>
      </v-card>

      <v-card
        width="250"
        class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
        color="blue-darken-4"
      >
          <v-avatar size="40" class="me-4 bg-white text-blue-darken-4">
              <v-icon>mdi-note-check</v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
              <span class="text-body-2 text-white">Manifestos Autorizados</span>
              <v-chip variant="flat" size="small" color="white" class="mt-1 text-blue-darken-4">
                  <v-fade-transition mode="out-in">
                      <span v-if="!datatable.carregando">
                      <strong :key="'inativos'">
                        {{ datatable.manifestos_autorizados }}
                      </strong>
                    </span>
                      <span v-else>
                        <v-progress-circular indeterminate color="blue-darken-2" size="15"></v-progress-circular>
                      </span>
                  </v-fade-transition>
              </v-chip>
          </div>
      </v-card>

      <!-- Manifestos Cancelados -->
      <v-card
          width="250"
          class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
          color="red-darken-4"
      >
          <v-avatar size="40" class="me-4 bg-white text-red-darken-4">
              <v-icon>mdi-note-remove</v-icon>
          </v-avatar>
          <div class="d-flex flex-column justify-center">
            <span class="text-body-2 text-white">Manifestos Cancelados</span>
              <v-chip variant="flat" size="small" color="white" class="mt-1 text-red-darken-4" loading="true">
                  <v-fade-transition mode="out-in">
                    <span v-if="!datatable.carregando">
                      <strong :key="'inativos'">
                        {{ datatable.manifestos_cancelados }}
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
                    v-model="filtros.Id_MDFE"
                    label="ID MDFe"
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

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="filtros.condutor_xNome"
                    label="Nome do Condutor"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-select
                    v-model="filtros.UFIni"
                    variant="outlined"
                    density="compact"
                    :items="estadosBrasileiros"
                    label="UF Início"
                    item-value="value"
                    item-title="text"
                    clearable
                    hide-details
                  >
                  </v-select>
                </v-col>

                 <v-col cols="12" md="2">
                    <v-select
                      v-model="filtros.UFFim"
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
              </v-row>

              <v-row dense>
                <v-col cols="12" md="2">
                  <InputText
                    density="compact"
                    variant="outlined"
                    bg-color="white"
                    label="CPF do Condutor"
                    v-model="filtros.condutor_CPF"
                    mask="###.###.###-##"
                    hide-details
                    counter="14"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <InputText
                    density="compact"
                    variant="outlined"
                    bg-color="white"
                    label="Placa do Veículo"
                    v-model="filtros.placa_veiculo"
                    mask="#######"
                    hide-details
                    counter="7"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <InputTextMoeda
                    v-model="filtros.valor_carga"
                    label="Valor da Carga"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <InputTextMoeda
                    v-model="filtros.peso_bruto"
                    label="Peso Bruto"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  />
                </v-col>
              </v-row>

            </v-card-text>

            <!-- Botão Buscar -->
            <v-card-actions>
              <v-btn
                color="blue-darken-3"
                variant="flat"
                class="text-white"
                @click="buscaManifesto"
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

        <BtnCancelaMDFe
          :mdfes_autorizados="datatable.manifestos_autorizados"
          :mdfes_cancelados="datatable.manifestos_cancelados"
          :mdfes_finalizados="datatable.manifestos_finalizados"
          :itensSelecionados="datatable.itensSelecionados"
          :mdfe="itemSelecionado"
          :disabled="datatable.carregando || desativaInputDeCancelar"
        />

        <BtnEmiteMDFe/>

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
            show-expand
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
            @update:options="buscaManifesto"
            height="56vh"
            density="comfortable"
            no-data-text="Nenhum Manifesto encontrado, tente alterar o(s) filtro(s)"
          >
            <template #[`item.data-table-expand`]="{ internalItem, isExpanded, toggleExpand }">
              <v-btn
                :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                :text="isExpanded(internalItem) ? 'Ocultar' : 'Ct-es Vinculados'"
                class="text-none"
                color="grey-darken-2"
                size="small"
                variant="text"
                border
                slim
                @click="toggleExpand(internalItem)"
              ></v-btn>
            </template>

            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length" class="py-2 bg-grey-lighten-3">
                  <v-sheet rounded="lg" width="1400" class="overflow-x-auto border-m" elevation="1">
                    <v-table density="compact" class="text-start ma-1">
                      <thead>
                        <tr>
                          <th
                            v-for="coluna in datatable.colunasDoCteVisiveis"
                            :key="coluna.chave"
                          >
                            {{ coluna.label}}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="cte in datatable.ctes_por_manifesto[item.chaveMDFe]" :key="cte.Id_CTe">
                          <td
                            v-for="coluna in datatable.colunasDoCteVisiveis"
                            :key="coluna.chave"
                            :title="cte[coluna.chave]"
                          >
                            <template v-if="coluna.chave == 'vCarga'">
                              {{ formataMoeda(cte[coluna.chave]) }}
                            </template>
                            <template v-else-if="coluna.chave == 'dhEmi'">
                              {{ formataData(cte[coluna.chave]) }}
                            </template>
                            <template v-else>
                              {{ cte[coluna.chave] ?? '--' }}
                            </template>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-sheet>
                </td>
              </tr>
            </template>

            <template #[`item.status`]="{ item }">
              <v-chip
                prepend-icon="mdi-alert-circle-outline"
                variant="flat"
                size="small"
                :color="defineCorDoStatus(item.status)"
              >
                {{ StatusManifestoEnum[item.status] }}
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
            <!-- <template #[`footer.prepend`]>
              <div class="d-flex w-100 align-center my-auto ps-4">
                <div
                  class="rounded-circle"
                  style="width: 12px; height: 12px; background-color: #a7d6ff;"
                ></div>
                <div class="ms-4 d-flex align-center text-caption">
                  <span>CTEs que possuem um pagamento associado e não podem ser cancelados</span>
                </div>
              </div>
            </template> -->
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ApiService from '@/services/ApiService';
import { SimENaoEnum, SimENaoEnumDescricao } from '@/Enums/SimENaoEnum';
import { formataCEP, formataData, formataCNPJ, formataMoeda, formataNumeroBR } from '@/utils/masks';
import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import BtnEmiteMDFe from '@/components/Fiscal/ControleDeManifestos/Embeeded/BtnEmiteMDFe.vue';
import BtnCancelaMDFe from '@/components/Fiscal/ControleDeManifestos/Embeeded/BtnCancelaMDFe.vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { StatusManifestoEnum, StatusManifestoEnumDescricao } from '@/Enums/Fiscal/StatusManifestoEnum';
import { inject } from 'vue'
import { format as formatDate } from 'date-fns'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue';
import InputText from '@/components/Form/InputText.vue';
import { estadosBrasileiros } from '@/Enums/estadosEnum';
import { geraUrlTemporariaParaImagemS3, urlEDaS3 } from '@/helpers/funcoesParaS3';

export default {
  name: 'ControleDeManifestos',
  components: {
    GlobalAlertFixed,
    InputTextMoeda,
    InputText,
    BtnEmiteMDFe,
    BtnCancelaMDFe
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
      formataData,

      StatusManifestoEnum,
      StatusManifestoEnumDescricao,
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
          label: StatusManifestoEnum[StatusManifestoEnumDescricao.AUTORIZADO],
          value: StatusManifestoEnumDescricao.AUTORIZADO,
        },
        {
          label: StatusManifestoEnum[StatusManifestoEnumDescricao.CANCELADO],
          value: StatusManifestoEnumDescricao.CANCELADO,
        },
        {
          label: StatusManifestoEnum[StatusManifestoEnumDescricao.FINALIZADO],
          value: StatusManifestoEnumDescricao.FINALIZADO,
        },
      ],
      datatable: {
        colunasDoCteVisiveis: [
          { chave: 'Id_CTe', label: 'ID CT-e', largura: '100px' },
          { chave: 'dhEmi', label: 'Data de Emissão', largura: '100px' },
          { chave: 'rem_xNome', label: 'Remetente', largura: '100px' },
          { chave: 'dest_xNome', label: 'Destinatário', largura: '100px' },
          { chave: 'vCarga', label: 'Valor da Carga', largura: '100px' },
          { chave: 'chCTe', label: 'Chave CT-e', largura: '100px' }
        ],
        manifestos_autorizados: null,
        manifestos_cancelados: null,
        manifestos_finalizados: null,
        ctes_por_manifesto: [],
        itensSelecionados: [],
        carregando: false,
        mensagemCarregando: 'Buscando, aguarde...',
        chave_primaria: 'Id_MDFE',
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
        ordenarPor: [{key: 'Id_MDFE', order: 'desc'}],
        ordenarDirecao: true,
        opcoes: {},

        cabecalho: [
          {
            title: 'ID MDF-e',
            key: 'Id_MDFE',
            align: 'center',
            width: '210',
            sortable: false,
          },
          {
            title: '',
            key: 'data-table-expand',
            align: 'center',
            width: '170',
          },
          {
            title: 'Status',
            key: 'status',
            align: 'center',
            width: '170',
          },
          {
            title: 'Emissão',
            key: 'dhEmi',
            align:'center',
            width: '170'
          },
          {
            title: 'UF Início',
            key: 'UFIni',
            align:'center',
            width: '140'
          },
          {
            title: 'UF Destino',
            key: 'UFFim',
            align:'center',
            width: '140'
          },
          {
            title: 'Chave MDF-e',
            key: 'chaveMDFe',
            align:'center',
            width: '450'
          },
          {
            title: 'Placa do Veículo',
            key: 'placa_veiculo',
            align:'center',
            width: '250'
          },
          {
            title: 'CPF do Condutor',
            key: 'condutor_CPF',
            align:'center',
            width:'200'
          },
          {
            title: 'Nome do Condutor',
            key: 'condutor_xNome',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350'
          },
          {
            title: 'Valor da Carga',
            key: 'valor_carga',
            align:'center',
            width: '300'
          },
          {
            title: 'Peso Bruto',
            key: 'peso_bruto',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
            width: '150'
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

    defineCorDoStatus(status) {
      const cancelado = StatusManifestoEnumDescricao.CANCELADO
      const autorizado = StatusManifestoEnumDescricao.AUTORIZADO
      const finalizado = StatusManifestoEnumDescricao.FINALIZADO

      const statusColor = {
        [cancelado]: 'red-darken-3',
        [autorizado]: 'blue-darken-3',
        [finalizado]: 'green-darken-3',
      }

      return statusColor[status] || 'grey'
    },

    async visualizaPdf() {

      const item = this.datatable.itens.find(item => {
        return item.Id_MDFE == this.datatable.itensSelecionados
      })

      if(!item.pdf_path) {
        const alertStore = useAlertStore()
        alertStore.addAlert(`MDF-e <strong>${item.Id_MDFE}</strong> não possui PDF vinculado, tente outro`, 'warning');
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
        return item.Id_MDFE == this.datatable.itensSelecionados
      })

      if(!item.xml_path) {
        const alertStore = useAlertStore()
        alertStore.addAlert(`MDF-e <strong>${item.Id_MDFE}</strong> não possui XML vinculado, tente outro`, 'warning');
        return
      }

      let urlFinal = item.xml_path;

      if (urlEDaS3(urlFinal)) {
        urlFinal = await geraUrlTemporariaParaImagemS3(urlFinal);
      }

      window.open(urlFinal, '_blank');
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
          return item.Id_MDFE == this.datatable.itensSelecionados
        })

        if(!item) {
          alertStore.addAlert('MDF-e com ID selecionado não encontrado, tente novamente', 'warning');
          return;
        }

        this.itemSelecionado = item

        if(item.status == StatusManifestoEnumDescricao.CANCELADO) {
          this.desativaInputDeCancelar = true
          return
        }

        this.desativaInputDeCancelar = false
        return
      }

      this.itemSelecionado = {}
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

    async buscaManifesto( options = {} ) {
      this.datatable.carregando = true;
      if(!this.permissao) {
        const loading = useLoadingStore()
        loading.show('Carregando Manifestos...')
      }
      this.datatable.itensSelecionados = [];

      const {
          page = this.page || 1,
          itemsPerPage = this.itemsPerPage || 50,
          sortBy = this.sortBy || [{ key: 'Id_MDFE', order: 'desc' }]
      } = options;

      this.page = page;
      this.itemsPerPage = itemsPerPage;
      this.sortBy = sortBy;

      this.filtrosAplicadosDepoisDaBusca = this.filtrosAplicadosAntesDaBusca

      try {
        const query = this.gerarQuery(this.page, this.itemsPerPage, this.sortBy);
        const url = endpoints.mdfe.datatable;

        const resposta =  await ApiService({
          method: 'get',
          url: `${url}/${query}`,
        })

        console.log(resposta);


        this.permissao = true

        if(resposta?.data) {
          this.datatable.itens = resposta.data.data.itens;
          this.datatable.totalRegistros = resposta.data.data.total;
          this.datatable.manifestos_autorizados = resposta.data.data.totais.manifestos_autorizados;
          this.datatable.manifestos_cancelados = resposta.data.data.totais.manifestos_cancelados;
          this.datatable.manifestos_finalizados = resposta.data.data.totais.manifestos_finalizados;
          this.datatable.ctes_por_manifesto = resposta.data.data.ctes_por_manifesto
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

    async cancelaManifesto() {
      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      if(this.datatable.itensSelecionados.length != 1) {
        alertStore.addAlert('Selecione um item por vez para Cancelar', 'warning');
        return
      }

      if(!this.itemSelecionado) {
        alertStore.addAlert('MDF-e com ID selecionado não encontrado, tente novamente', 'warning');
        return;
      }

      if(this.itemSelecionado.possui_pagamento == SimENaoEnumDescricao.SIM) {
        alertStore.addAlert('O MDF-e possui um Pagamento associado e não pode ser cancelado', 'warning');
        return
      }

      const mensagem = `Deseja realmente Cancelar o MDF-e de ID <strong>${this.datatable.itensSelecionados[0]}</strong> ?`

      const confirmado = await this.dialog.value.open({
        title: `Cancelar MDF-e`,
        message: mensagem,
        titleColor: 'error'
      })

      if(!confirmado) {
        return
      }

      loading.show('Cancelando MDF-e...')
      const url = `${endpoints.manifesto.cancela}/${this.datatable.itensSelecionados[0]}`;

      try {
        const resposta =  await ApiService({
          method: 'delete',
          url: `${url}`,
        })

        alertStore.addAlert(
          `${resposta?.data?.message}`,
          'success'
        );

        if(this.itemSelecionado.status == StatusManifestoEnumDescricao.AUTORIZADO) {
          this.datatable.manifestos_autorizados -= 1
        }

        if(this.itemSelecionado.status == StatusManifestoEnumDescricao.FINALIZADO) {
          this.datatable.manifestos_finalizados -= 1
        }

        this.itemSelecionado.status = StatusManifestoEnumDescricao.CANCELADO
        this.datatable.manifestos_cancelados += 1

        this.datatable.itensSelecionados = [];
        this.itemSelecionado = {};

      } catch (error) {
        alertStore.addAlert(`Erro ao Cancelar MDF-e: ${error?.response?.data?.message}`, 'error');
      } finally {
        loading.hide()
      }
    },

    async exportarExcel() {

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Manifestos');

      const itensFormatados = this.datatable.itens.map(item => ({
        ...item,
        status: StatusManifestoEnum[item.status],
        vCarga: formataMoeda(item.valor_carga),
        vTPrest: formataNumeroBR(item.peso_bruto),
      }));

      // Adicionando cabeçalhos
      worksheet.columns = [
        { header: 'ID MDF-e', key: 'Id_MDFE', width: 30 },
        { header: 'Status', key: 'status', width: 20 },
        { header: 'Emissão', key: 'dhEmi', width: 25 },
        { header: 'UF Início', key: 'UFIni', width: 15 },
        { header: 'UF Destino', key: 'UFFim', width: 15 },
        { header: 'Chave MDF-e', key: 'chaveMDFe', width: 50 },
        { header: 'Placa do Veículo', key: 'placa_veiculo', width: 25 },
        { header: 'CPF do Condutor', key: 'condutor_CPF', width: 25 },
        { header: 'Nome do Condutor', key: 'condutor_xNome', width: 35 },
        { header: 'Valor da Carga', key: 'valor_carga', width: 25 },
        { header: 'Peso Bruto', key: 'peso_bruto', width: 20 },
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
      saveAs(new Blob([buffer]), 'manifestos.xlsx');
    },

    // apagarDadosDoArrayLocalmente() {
    //   const arrayFiltrado = this.items.filter(item => {
    //       return !this.datatable.itensSelecionados.includes(item.id_manifesto);
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
