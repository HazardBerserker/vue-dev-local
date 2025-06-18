<template>
   <div>

      <v-card outlined class="pa-6 elevation-6 mb-4">
          <v-row class="pb-2">
              <v-col class="py-2">
                  <h3 class="pa-1 font-weight-bold">FILTROS:</h3>
              </v-col>
          </v-row>

          <v-divider></v-divider>

          <v-row class="pt-6">
              <v-col cols="12" sm="3" class="py-2">
                  <v-text-field
                      v-model="filtros.id_cliente"
                      density="compact"
                      label="Busca geral"
                      prepend-inner-icon="mdi-magnify"
                      variant="solo"
                      hide-details
                      clearable
                  ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" class="py-2">
                  <v-text-field
                      density="compact"
                      label="ID Cargo"
                      prepend-inner-icon="mdi-magnify"
                      variant="solo"
                      hide-details
                      clearable
                  ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" class="py-2">
                  <v-text-field
                      density="compact"
                      label="Nome"
                      prepend-inner-icon="mdi-magnify"
                      variant="solo"
                      hide-details
                      clearable
                  ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" class="py-2">
                <v-text-field
                      density="compact"
                      label="Nome"
                      prepend-inner-icon="mdi-magnify"
                      variant="solo"
                      hide-details
                      clearable
                  ></v-text-field>
              </v-col>
          </v-row>
      </v-card>


      <v-row >
          <v-col cols="12" class="text-right">
            <v-data-table-server
              fixed-header
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
              height="65vh"
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



                      <!-- <template #item.cobrar_cliente="{ item, column }">
                          <v-chip v-if="item.cobrar_cliente" size="small" :color="selecionaCorCobrarCliente(item.cobrar_cliente)" :style="`text-align: ${column.align};`">
                              {{ item.cobrar_cliente }}
                          </v-chip>
                      </template>

                      <template #item.acao="{ item }">
                          <v-icon size="small" class="mr-2" @click="editaItem(item)">
                              mdi-pencil
                          </v-icon>
                      </template> -->
          </v-col>
      </v-row>
   </div>
</template>

<script>
import ApiService from '@/services/ApiService';
import { SimENaoEnum, SimENaoEnumDescricao } from '@/Enums/SimENaoEnum';
import { formataCep } from '@/utils/formataCep';

export default {
  name: 'ClientesScreen',
  data () {
    return {
      formataCep,
      SimENaoEnumDescricao,
      SimENaoEnum,
      filtros: {
        id_cliente: null
      },
      datatable: {
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

          const resposta =  await ApiService({
              method: 'get',
              url: `http://api-dev.local/clientes/datatable/${query}`,
          })

          if(resposta?.data) {
              console.log(resposta);
              this.datatable.itens = resposta.data.data.itens;
              this.datatable.totalRegistros = resposta.data.data.total;
          }

      } catch (error) {
          // if(this.permissao) {
          //     useAlertStore().addAlert(erro.message, 'error');
          //     return
          // }
            console.log(error.message);

          // throw new Error(erro);

      } finally {
        this.datatable.carregando = false;
      }
    },

    regraPintaLinha(item) {
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
