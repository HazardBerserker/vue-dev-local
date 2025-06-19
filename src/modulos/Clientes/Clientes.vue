<template>
   <div>
    <v-breadcrumbs :items="['Cadastros', 'Clientes']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <v-card class="pa-2 ps-4 rounded-xl justify-space-between elevation-4 d-flex" color="grey-lighten-3" variant="tonal" v-if="permissao">
      <div class="d-flex flex-column w-100">
        <h5 class="text-subtitle-1 font-weight-bold text-grey-darken-3 ps-1">Filtros:</h5>
        <div class="d-flex my-auto ga-2">
          <v-text-field
            v-model="filtros.busca_geral"
            hide-details
            label="Busca Geral..."
            width="500"
            variant="solo-filled"
            density="compact"
            bg-color="white"
            clearable
            flat
            rounded
          ></v-text-field>
          <v-select
            v-model="filtros.ativo"
            hide-details
            label="Busca pelo Status de Ativo"
            width="300"
            variant="solo-filled"
            density="compact"
            :items="opcoesAtivo"
            item-value="value"
            item-title="label"
            bg-color="white"
            clearable
            flat
            rounded
          ></v-select>
          <v-btn
            color="blue-darken-3"
            variant="flat"
            class="text-white fill-height"
            @click="buscaCliente"
            rounded="pill"
          >
            <v-icon>
              mdi-magnify
            </v-icon>
          </v-btn>
        </div>

      </div>

      <v-divider></v-divider>

      <!-- KPIs -->
      <div class="d-flex ga-2 my-auto">
        <!-- Clientes Ativos -->
        <v-card
          width="250"
          class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
          color="blue-darken-4"
        >
            <v-avatar size="40" class="me-4 bg-white text-blue-darken-4">
                <v-icon>mdi-account</v-icon>
            </v-avatar>
            <div class="d-flex flex-column">
                <span class="text-body-2 text-white">Clientes Ativos</span>
                <v-chip variant="flat" size="small" color="white" class="mt-1 text-blue-darken-4">
                    <v-fade-transition mode="out-in">
                        <span v-if="!datatable.carregando">
                        <strong :key="'inativos'">
                          {{ numeroDeClientesAtivos() }}
                        </strong>
                      </span>
                        <span v-else>
                          <v-progress-circular indeterminate color="primary" size="15"></v-progress-circular>
                        </span>
                    </v-fade-transition>
                </v-chip>
            </div>
        </v-card>

        <!-- Clientes Inativos -->
        <v-card
            width="250"
            class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
            color="red-darken-4"
        >
            <v-avatar size="40" class="me-4 bg-white text-red-darken-4">
                <v-icon>mdi-account-off</v-icon>
            </v-avatar>
            <div class="d-flex flex-column justify-center">
              <span class="text-body-2 text-white">Clientes Inativos</span>
                <v-chip variant="flat" size="small" color="white" class="mt-1 text-red-darken-4" loading="true">
                    <v-fade-transition mode="out-in">
                      <span v-if="!datatable.carregando">
                        <strong :key="'inativos'">
                          {{ numeroDeClientesInativos() }}
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

    </v-card>

    <div class="py-3 justify-space-between mt-6" v-if="permissao">
        <div class="d-flex align-center ga-2">
          <v-btn
              color="green-darken-2"
              prepend-icon="mdi-plus"
              variant="tonal"
              density="comfortable"
              class="text-white"
              rounded="pill"
          >
              Criar cliente
          </v-btn>

          <v-btn
              color="blue-darken-3"
              prepend-icon="mdi-pencil"
              variant="tonal"
              density="comfortable"
              class="text-white"
              rounded="pill"
              :disabled="desativaInput()"
          >
              Editar
          </v-btn>

          <v-btn
              color="red-darken-3"
              prepend-icon="mdi-delete"
              variant="tonal"
              density="comfortable"
              class="text-white"
              rounded="pill"
              :disabled="desativaInput()"
          >
              Excluir
          </v-btn>

          <v-btn
              color="teal-darken-2"
              prepend-icon="mdi-file-export"
              variant="tonal"
              density="comfortable"
              class="text-white"
              rounded="pill"
          >
              Exportar
          </v-btn>
        </div>

    </div>

    <v-row v-if="permissao">
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
            @update:options="buscaCliente"
            height="56vh"
            density="comfortable"
            no-data-text="Nenhum Cliente encontrado, tente alterar o(s) filtro(s)"
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
            <template #[`item.cep`]="{ item }">
              {{ formataCep(item.cep) }}
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
import { formataCep } from '@/utils/formataCep';
import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/Global/GlobalAlertFixed.vue';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';

export default {
  name: 'ClientesScreen',
  components: {
    GlobalAlertFixed
  },
  async mounted() {
    const loading = useLoadingStore();
    try {
      loading.show('Carregando Clientes...')
      await this.buscaCliente()
      this.permissao = true
    } catch (error) {
      this.propriedadesDoAlertaFixo = {
        type: 'error',
        text: error?.response?.data?.message,
        title: `Módulo inacessível (${error.status})`
      }
    } finally {
      loading.hide();
    }
  },
  data () {
    return {
      formataCep,
      SimENaoEnumDescricao,
      SimENaoEnum,
      permissao: false,
      propriedadesDoAlertaFixo: null,
      filtros: {
        id_cliente: null,
        ativo: null
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
        chave_primaria: 'id_cliente',
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
        ordenarPor: [{key: 'id_cliente', order: 'desc'}],
        ordenarDirecao: true,
        opcoes: {},

        cabecalho: [
          {
            title: 'ID',
            key: 'id_cliente',
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
            title: 'Razão Social',
            key: 'razao_social',
            width: '400',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
          },
          {
            title: 'Endereço',
            key: 'endereco',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
            width: '400'
          },
          {
            title: 'Cep',
            key: 'cep',
            align: 'center',
            width: '300'
          },
          {
            title: 'Cidade',
            key: 'cidade',
            width: '250',
            align:'start',
            cellProps: {
              class: 'text-start'
            }
          },
          {
            title: 'Bairro',
            key: 'bairro',
            width: '300',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
          },
          {
            title: 'Número',
            key: 'numero',
            width: '250',
            align: 'center'
          },
          {
            title: 'País',
            key: 'pais',
            width: '300',
            align:'start',
            cellProps: {
              class: 'text-start'
            },
          },
          {
            title: 'UF',
            key: 'uf',
            width: '100',
            align: 'center'
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
    gerarQuery( page, itemsPerPage, sortBy ) {
      let arrayDeFiltros = []

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

      return `?${queryParams.toString()}`;
    },

    numeroDeClientesInativos() {
      const itensAtivos = this.datatable.itens.filter(item => {
        return item.ativo == SimENaoEnumDescricao.NAO
      })
      return itensAtivos.length
    },

    numeroDeClientesAtivos() {
      const itensAtivos = this.datatable.itens.filter(item => {
        return item.ativo == SimENaoEnumDescricao.SIM
      })
      return itensAtivos.length
    },

    async buscaCliente( options = {} ) {
      this.datatable.carregando = true;
      this.datatable.itensSelecionados = [];

      const {
          page = this.page || 1,
          itemsPerPage = this.itemsPerPage || 50,
          sortBy = this.sortBy || [{ key: 'id_cliente', order: 'desc' }]
      } = options;

      this.page = page;
      this.itemsPerPage = itemsPerPage;
      this.sortBy = sortBy;

      try {
        const query = this.gerarQuery(this.page, this.itemsPerPage, this.sortBy);
        const url = endpoints.cliente.datatable;

        const resposta =  await ApiService({
            method: 'get',
            url: `${url}/${query}`,
        })

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
        throw error
      } finally {
        this.datatable.carregando = false;
      }
    },

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
