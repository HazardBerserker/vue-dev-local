<template>
   <div>
    <v-breadcrumbs :items="['Comercial', 'Fretes e Cotações']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <v-card class="pa-2 ps-4 rounded-xl justify-space-between elevation-4 d-flex" color="grey-lighten-3" variant="tonal" v-if="permissao">
      <div class="d-flex flex-column w-100">
        <h5 class="text-subtitle-1 font-weight-bold text-grey-darken-3 ps-1">Filtros:</h5>


      <v-card class="rounded-xl mt-2" width="700">
        <v-tabs
          v-model="tab"
          bg-color="primary"
        >
          <v-tab value="one">Item One</v-tab>
          <v-tab value="two">Item Two</v-tab>
          <v-tab value="three">Item Three</v-tab>
        </v-tabs>

        <v-card-text color="white">
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one" class="bg-white pa-2">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="busca_geral"
                    hide-details
                    label="Busca Geral..."
                    variant="outlined"
                    density="compact"
                    class="bg-white"
                    clearable
                    flat
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="busca_geral"
                    hide-details
                    label="Busca Geral..."
                    variant="outlined"
                    density="compact"
                    class="bg-white"
                    clearable
                    flat
                    rounded
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                    v-model="busca_geral"
                    hide-details
                    label="Busca Geral..."
                    variant="outlined"
                    density="compact"
                    class="bg-white"
                    clearable
                    flat
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="busca_geral"
                    hide-details
                    label="Busca Geral..."
                    variant="outlined"
                    density="compact"
                    class="bg-white"
                    clearable
                    flat
                    rounded
                  ></v-text-field>
                </v-col>
              </v-row>

                <!-- <v-btn
                  color="blue-darken-3"
                  variant="flat"
                  class="text-white fill-height"
                  @click="buscaMotorista"
                  rounded="pill"
                >
                  <v-icon>
                    mdi-magnify
                  </v-icon>
                </v-btn> -->
              </v-tabs-window-item>

              <v-tabs-window-item value="two" class="pa-2">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="busca_geral"
                      hide-details
                      label="Busca Geral..."
                      variant="outlined"
                      density="compact"
                      class="bg-white"
                      clearable
                      flat
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="busca_geral"
                      hide-details
                      label="Busca Geral..."
                      variant="outlined"
                      density="compact"
                      class="bg-white"
                      clearable
                      flat
                      rounded
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="busca_geral"
                      hide-details
                      label="Busca Geral..."
                      variant="outlined"
                      density="compact"
                      class="bg-white"
                      clearable
                      flat
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="busca_geral"
                      hide-details
                      label="Busca Geral..."
                      variant="outlined"
                      density="compact"
                      class="bg-white"
                      clearable
                      flat
                      rounded
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-tabs-window-item>

              <v-tabs-window-item value="three" class="pa-2">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="busca_geral"
                      hide-details
                      label="Busca Geral..."
                      variant="outlined"
                      density="compact"
                      class="bg-white"
                      clearable
                      flat
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="busca_geral"
                      hide-details
                      label="Busca Geral..."
                      variant="outlined"
                      density="compact"
                      class="bg-white"
                      clearable
                      flat
                      rounded
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>


      </div>

      <v-divider></v-divider>

      <!-- KPIs -->
      <div class="d-flex ga-2 my-auto">
        <!-- Motoristas Ativos -->
        <v-card
          width="250"
          height="140"
          class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between"
          color="blue-lighten-4"
        >
          <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
            <v-avatar size="40" class="me-4 bg-blue-darken-2 text-white text-start">
                <v-icon>mdi-account</v-icon>
            </v-avatar>
            <span class="text-body-2 text-start font-weight-bold text-blue-darken-2 w-100 ps-3">Em Aberto</span>
          </div>
          <v-card class="h-100 rounded-xl align-center justify-center d-flex bg-blue-darken-2 w-100 text-white text-h5 mt-3" variant="flat">
            <v-fade-transition mode="out-in">
                <span v-if="!datatable.carregando">
                <strong :key="'inativos'">
                {{ numeroDeMotoristasAtivos() }}
                </strong>
              </span>
                <span v-else>
                  <v-progress-circular indeterminate color="white" size="30"></v-progress-circular>
                </span>
              </v-fade-transition>
          </v-card>
        </v-card>

       <v-card
          width="250"
          class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between"
          color="green-lighten-4"
        >
          <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
            <v-avatar size="40" class="me-4 bg-green-darken-2 text-white text-start">
                <v-icon>mdi-account</v-icon>
            </v-avatar>
            <span class="text-body-2 text-start font-weight-bold text-green-darken-2 w-100 ps-3">Aceitas</span>
          </div>
          <v-card class="h-100 rounded-xl align-center justify-center d-flex bg-green-darken-2 w-100 text-white text-h5 mt-3" variant="flat">
            <v-fade-transition mode="out-in">
                <span v-if="!datatable.carregando">
                <strong :key="'inativos'">
                {{ numeroDeMotoristasAtivos() }}
                </strong>
              </span>
                <span v-else>
                  <v-progress-circular indeterminate color="white" size="30"></v-progress-circular>
                </span>
              </v-fade-transition>
          </v-card>
        </v-card>

        <v-card
          width="250"
          class="pa-3 rounded-xl elevation-2 d-flex flex-column align-center justify-space-between"
          color="red-lighten-4"
        >
          <div class="d-flex ga-4 justify-space-between text-start align-center w-100">
            <v-avatar size="40" class="me-4 bg-red-darken-2 text-white text-start">
                <v-icon>mdi-account</v-icon>
            </v-avatar>
            <span class="text-body-2 text-start font-weight-bold text-red-darken-2 w-100 ps-3">Rejeitadas</span>
          </div>
          <v-card class="h-100 rounded-xl align-center justify-center d-flex bg-red-darken-2 w-100 text-white text-h5 mt-3" variant="flat">
            <v-fade-transition mode="out-in">
                <span v-if="!datatable.carregando">
                <strong :key="'inativos'">
                {{ numeroDeMotoristasAtivos() }}
                </strong>
              </span>
                <span v-else>
                  <v-progress-circular indeterminate color="white" size="30"></v-progress-circular>
                </span>
              </v-fade-transition>
          </v-card>
        </v-card>
      </div>

    </v-card>

    <div class="py-3 justify-space-between mt-6" v-if="permissao">
        <div class="d-flex align-center ga-2">

          <BtnCreateMotorista @acrescentaODadoNoArrayLocalmente="onAcrescentaODadoNoArrayLocalmente"/>

          <!-- <v-btn
              color="red-darken-3"
              prepend-icon="mdi-delete"
              variant="tonal"
              density="comfortable"
              class="text-white"
              rounded="pill"
              :disabled="desativaInput()"
              @click="desativaMotorista"
          >
              Excluir
          </v-btn> -->

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
            show-select
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
            @update:options="buscaMotorista"
            height="56vh"
            density="comfortable"
            no-data-text="Nenhum Motorista encontrado, tente alterar o(s) filtro(s)"
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
              <BtnAtualizaMotorista :item="item" @atualizaODadoNoArrayLocalmente="onAtualizaODadoNoArrayLocalmente"/>
            </template>
            <template #[`item.cep_residencia`]="{ item }">
              {{ formataCEP(item.cep_residencia) }}
            </template>
            <template #[`item.cpf`]="{ item }">
              {{ formataCPF(item.cpf) }}
            </template>
            <template #[`item.telefone`]="{ item }">
              {{ formataTelefone(item.telefone) }}
            </template>
            <template #[`item.detalhes`]="{ item }">
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-icon
                    v-if="isHovering"
                    size="25"
                    v-bind="props"
                    @click="abrirDialogDetalhesMotorista(item)"
                    class="cursor-pointer"
                    key="olhoAberto"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
                  v-else
                    size="25"
                    v-bind="props"
                    @click="abrirDialogDetalhesMotorista(item)"
                    class="cursor-pointer"
                    key="olhoFechado"
                  >
                    mdi-eye-outline
                  </v-icon>
                </template>
              </v-hover>
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>
    <MotoristaDetalhesDialog ref="dialogMotorista"/>
  </div>
</template>

<script>
import ApiService from '@/services/ApiService';
import { SimENaoEnum, SimENaoEnumDescricao } from '@/Enums/SimENaoEnum';
import { formataCEP, formataData, formataCPF, formataTelefone } from '@/utils/masks';
import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import BtnCreateMotorista from '@/components/Cadastros/Motoristas/Embeeded/BtnCreateMotorista.vue';
import BtnAtualizaMotorista from '@/components/Cadastros/Motoristas/Embeeded/BtnAtualizaMotorista.vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import MotoristaDetalhesDialog from '@/components/Cadastros/Motoristas/Embeeded/MotoristaDetalhesDialog.vue';


export default {
  name: 'FretesCotacoes',
  components: {
    GlobalAlertFixed,
    BtnCreateMotorista,
    BtnAtualizaMotorista,
    MotoristaDetalhesDialog

  },
  data () {
    return {
      formataCEP,
      formataCPF,
      formataTelefone,
      tab: null,
      SimENaoEnumDescricao,
      SimENaoEnum,
      permissao: false,
      propriedadesDoAlertaFixo: null,
      filtros: {
        ativo: null
      },
      busca_geral: null,
      filtrosDaBuscaGeral: {
        id_motorista: null,
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
        chave_primaria: 'id_motorista',
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
        ordenarPor: [{key: 'id_motorista', order: 'desc'}],
        ordenarDirecao: true,
        opcoes: {},

        cabecalho: [
          {
            title: 'Detalhes',
            key: 'detalhes',
            align: 'center',
            width: '150',
            sortable: false,
          },
          {
            title: 'Ação',
            key: 'acao',
            align: 'center',
            width: '210',
            sortable: false,
          },
          {
            title: 'ID',
            key: 'id_motorista',
            align: 'center',
            width: '150',
          },
          {
            title: 'Ativo',
            key: 'ativo',
            align: 'center',
            width: '150',
          },
          {
            title: 'Nome Completo',
            key: 'nome_completo',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
            width: '350',
          },
          {
            title: 'CPF',
            key: 'cpf',
            width: '300',
            align:'center',
          },
          {
            title: 'Telefone',
            key: 'telefone',
            align: 'center',
            width: '150'
          },
          {
            title: 'Placa Carro',
            key: 'placa_carro',
            align: 'center',
            width: '300'
          },
          {
            title: 'Placa Carreta',
            key: 'placa_carreta',
            align: 'center',
            width: '300'
          },
          {
            title: 'Tipo Veículo',
            key: 'tipo_veiculo',
            align: 'start',
            cellProps: {
              class: 'text-start'
            },
            width: '300'
          },
          {
            title: 'Pix',
            key: 'pix',
            align: 'center',
            width: '300'
          },
          {
            title: 'UF Residência',
            key: 'uf_residencia',
            width: '250',
            align: 'center'
          },
          {
            title: 'Cidade Residência',
            key: 'cidade_residencia',
            width: '250',
            align: 'center'
          },
          {
            title: 'CEP Residência',
            key: 'cep_residencia',
            width: '250',
            align:'center',
          },
          {
            title: 'Observações',
            key: 'observacoes',
            width: '250',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
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
    abrirDialogDetalhesMotorista(motorista) {
      this.$refs.dialogMotorista.abrir(motorista);
    },
    gerarQuery( page, itemsPerPage, sortBy ) {
      let arrayDeFiltros = []
      let arrayDeFiltrosGerais = []

      for (const chave in this.filtrosDaBuscaGeral) {
        if (this.busca_geral != null && this.busca_geral !== '') {
          const filtro = {
            key: [chave], value: this.busca_geral
          }
          arrayDeFiltrosGerais.push(filtro)
        }
      }

      //laço iterativo para fazer buscar apenas os filtros que estao preenchidos
      for (const chave in this.filtros) {
        if (this.filtros[chave] != null && this.filtros[chave] !== '') {
          const filtro = { key: [chave], value: this.filtros[chave] };
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

    numeroDeMotoristasInativos() {
      const itensAtivos = this.datatable.itens.filter(item => {
        return item.ativo == SimENaoEnumDescricao.NAO
      })
      return itensAtivos.length
    },

    numeroDeMotoristasAtivos() {
      const itensAtivos = this.datatable.itens.filter(item => {
        return item.ativo == SimENaoEnumDescricao.SIM
      })
      return itensAtivos.length
    },

    async buscaMotorista( options = {} ) {
      this.datatable.carregando = true;
      if(!this.permissao) {
        const loading = useLoadingStore()
        loading.show('Carregando Motoristas...')
      }
      this.datatable.itensSelecionados = [];

      const {
          page = this.page || 1,
          itemsPerPage = this.itemsPerPage || 50,
          sortBy = this.sortBy || [{ key: 'id_motorista', order: 'desc' }]
      } = options;

      this.page = page;
      this.itemsPerPage = itemsPerPage;
      this.sortBy = sortBy;

      try {
        const query = this.gerarQuery(this.page, this.itemsPerPage, this.sortBy);
        const url = endpoints.motorista.datatable;

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

    onAcrescentaODadoNoArrayLocalmente(itemCriado) {
      const novoItem = {
        id_motorista: itemCriado.id_motorista,
        nome_completo: itemCriado.nome_completo,
        cpf: itemCriado.cpf,
        telefone: itemCriado.telefone,
        placa_carro: itemCriado.placa_carro,
        placa_carreta: itemCriado.placa_carreta,
        tipo_veiculo: itemCriado.tipo_veiculo,
        pix: itemCriado.pix,
        uf_residencia: itemCriado.uf_residencia,
        cidade_residencia: itemCriado.cidade_residencia,
        cep_residencia: itemCriado.cep_residencia,
        ativo: itemCriado.ativo,
        arquivo_cnh: itemCriado.arquivo_cnh,
        arquivo_comprovante_residencia: itemCriado.arquivo_comprovante_residencia,
        arquivo_documento_carro: itemCriado.arquivo_documento_carro,
        arquivo_antt: itemCriado.arquivo_antt,
        arquivo_foto_veiculo: itemCriado.arquivo_foto_veiculo,
        observacoes: itemCriado.observacoes,
        data_criacao: formataData(itemCriado.data_criacao),
        usuario_criacao: itemCriado.usuario_criacao,
        usuario_ultima_alteracao: itemCriado.usuario_ultima_alteracao,
        data_ultima_alteracao: formataData(itemCriado.data_ultima_alteracao)
      }
      this.datatable.itens.unshift(novoItem)
    },

    onAtualizaODadoNoArrayLocalmente(itemAtualizado) {
      const itemQueSeraAtualizado = this.datatable.itens.find(i => i.id_motorista == itemAtualizado.id_motorista);

      if (itemQueSeraAtualizado) {
        itemQueSeraAtualizado.id_motorista = itemAtualizado.id_motorista
        itemQueSeraAtualizado.nome_completo = itemAtualizado.nome_completo
        itemQueSeraAtualizado.cpf = itemAtualizado.cpf
        itemQueSeraAtualizado.telefone = itemAtualizado.telefone
        itemQueSeraAtualizado.placa_carro = itemAtualizado.placa_carro
        itemQueSeraAtualizado.placa_carreta = itemAtualizado.placa_carreta
        itemQueSeraAtualizado.tipo_veiculo = itemAtualizado.tipo_veiculo
        itemQueSeraAtualizado.pix = itemAtualizado.pix
        itemQueSeraAtualizado.uf_residencia = itemAtualizado.uf_residencia
        itemQueSeraAtualizado.cidade_residencia = itemAtualizado.cidade_residencia
        itemQueSeraAtualizado.cep_residencia = itemAtualizado.cep_residencia
        itemQueSeraAtualizado.ativo = itemAtualizado.ativo
        itemQueSeraAtualizado.observacoes = itemAtualizado.observacoes
        itemQueSeraAtualizado.data_criacao = formataData(itemAtualizado.data_criacao)
        itemQueSeraAtualizado.usuario_criacao = itemAtualizado.usuario_criacao
        itemQueSeraAtualizado.usuario_ultima_alteracao = itemAtualizado.usuario_ultima_alteracao
        itemQueSeraAtualizado.data_ultima_alteracao = formataData(itemAtualizado.data_ultima_alteracao)
      }
    },

    async exportarExcel() {

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Motoristas');

      const itensFormatados = this.datatable.itens.map(item => ({
        ...item,
        ativo: SimENaoEnum[item.ativo]
      }));

      // Adicionando cabeçalhos
      worksheet.columns = [
      { header: 'ID', key: 'id_motorista', width: 15 },
      { header: 'Ativo', key: 'ativo', width: 15 },
      { header: 'Nome Completo', key: 'nome_completo', width: 15 },
      { header: 'cpf', key: 'cpf', width: 40 },
      { header: 'telefone', key: 'telefone', width: 40 },
      { header: 'Placa Carro', key: 'placa_carro', width: 40 },
      { header: 'Placa Carreta', key: 'placa_carreta', width: 30 },
      { header: 'Tipo Veiculo', key: 'tipo_veiculo', width: 25 },
      { header: 'Pix', key: 'pix', width: 30 },
      { header: 'Número', key: 'numero', width: 25 },
      { header: 'País', key: 'pais', width: 30 },
      { header: 'UF Residência', key: 'uf_residencia', width: 10 },
      { header: 'Cidade Residência', key: 'cidade_residencia', width: 30 },
      { header: 'CEP Residência', key: 'cep_residencia', width: 30 },
      { header: 'Observações', key: 'observacoes', width: 30 },
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
      saveAs(new Blob([buffer]), 'motoristas.xlsx');
    },

    // apagarDadosDoArrayLocalmente() {
    //   const arrayFiltrado = this.items.filter(item => {
    //       return !this.datatable.itensSelecionados.includes(item.id_motorista);
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
