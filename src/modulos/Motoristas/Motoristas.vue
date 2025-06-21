<template>
   <div>
    <v-breadcrumbs :items="['Cadastros', 'Motoristas']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <v-card class="pa-2 ps-4 rounded-xl justify-space-between elevation-4 d-flex" color="grey-lighten-3" variant="tonal" v-if="permissao">
      <div class="d-flex flex-column w-100">
        <h5 class="text-subtitle-1 font-weight-bold text-grey-darken-3 ps-1">Filtros:</h5>
        <div class="d-flex my-auto ga-2">
          <v-text-field
            v-model="busca_geral"
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
            @click="buscaMotorista"
            rounded="pill"
          >
            <v-icon>
              mdi-magnify
            </v-icon>
          </v-btn>
        </div>
        <span class="text-caption text-grey-darken-1 ps-2 pt-2">Remova todos os acentos e sinais para buscar os dados corretamente</span>
      </div>

      <v-divider></v-divider>

      <!-- KPIs -->
      <div class="d-flex ga-2 my-auto">
        <!-- Motoristas Ativos -->
        <v-card
          width="250"
          class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
          color="blue-darken-4"
        >
            <v-avatar size="40" class="me-4 bg-white text-blue-darken-4">
                <v-icon>mdi-account</v-icon>
            </v-avatar>
            <div class="d-flex flex-column">
                <span class="text-body-2 text-white">Motoristas Ativos</span>
                <v-chip variant="flat" size="small" color="white" class="mt-1 text-blue-darken-4">
                    <v-fade-transition mode="out-in">
                        <span v-if="!datatable.carregando">
                        <strong :key="'inativos'">
                          {{ numeroDeMotoristasAtivos() }}
                        </strong>
                      </span>
                        <span v-else>
                          <v-progress-circular indeterminate color="primary" size="15"></v-progress-circular>
                        </span>
                    </v-fade-transition>
                </v-chip>
            </div>
        </v-card>

        <!-- Motoristas Inativos -->
        <v-card
            width="250"
            class="pa-3 rounded-xl elevation-2 d-flex align-center justify-start"
            color="red-darken-4"
        >
            <v-avatar size="40" class="me-4 bg-white text-red-darken-4">
                <v-icon>mdi-account-off</v-icon>
            </v-avatar>
            <div class="d-flex flex-column justify-center">
              <span class="text-body-2 text-white">Motoristas Inativos</span>
                <v-chip variant="flat" size="small" color="white" class="mt-1 text-red-darken-4" loading="true">
                    <v-fade-transition mode="out-in">
                      <span v-if="!datatable.carregando">
                        <strong :key="'inativos'">
                          {{ numeroDeMotoristasInativos() }}
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
import GlobalAlertFixed from '@/components/Global/GlobalAlertFixed.vue';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import BtnCreateMotorista from '@/components/Cadastros/Motoristas/Embeeded/BtnCreateMotorista.vue';
import BtnAtualizaMotorista from '@/components/Cadastros/Motoristas/Embeeded/BtnAtualizaMotorista.vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import MotoristaDetalhesDialog from '@/components/Cadastros/Motoristas/Embeeded/MotoristaDetalhesDialog.vue';


export default {
  name: 'MotoristasScreen',
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
          },
          {
            title: 'Ação',
            key: 'acao',
            align: 'center',
            width: '210',
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

    // async desativaMotorista() {
    //   const mensagem = this.datatable.itensSelecionados.length === 1
    //     ? `Deseja realmente desativar o Motorista de ID <strong>${this.datatable.itensSelecionados[0]}</strong> ?`
    //     : `Deseja realmente desativar os <strong>${this.itensSelecionados.length}</strong> Motoristas selecionados ?`

    //   const confirmado = await this.$refs.dialogRef.open({
    //     title: `Desativar motorista(s)`,
    //     message: mensagem,
    //     titleColor: 'error'
    //   })

    //   if(!confirmado) {
    //     return
    //   }

    //   const alertStore = useAlertStore()

    //   const requisicoesDeletar = this.itensSelecionados.map(async idSelecionado => {
    //     const item = this.items.find(item => item.id_motorista == idSelecionado);

    //     if (!item) {
    //       alertStore.addAlert(`ID ${idSelecionado} não encontrado para excluir`, 'error');
    //       return Promise.resolve(); // Evita que o Promise.all falhe com esse
    //     }

    //     const url = `${endpoints.motorista.apaga}/${this.item.id_motorista}`;

    //     const resposta = await ApiService({
    //       method: 'delete',
    //       url: url,
    //     });

    //     return resposta;
    //   });

    //   try {
    //       await Promise.all(requisicoesDeletar);

    //       alertStore.addAlert(
    //           `${this.itensSelecionados.length} Motorista(s) desativado(s) com sucesso.`,
    //           'success'
    //       );

    //       this.apagarDadosDoArrayLocalmente();
    //       this.itensSelecionados = [];

    //   } catch (error) {
    //       alertStore.addAlert(`Erro ao desativar Motorista(s): ${error?.response?.data?.message}`, 'error');
    //   }
    // },

    onAcrescentaODadoNoArrayLocalmente(itemCriado) {
      console.log(itemCriado);

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
