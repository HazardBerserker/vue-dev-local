<template>
  <v-form class="bg-grey-lighten-4 border elevation-2 pa-6" ref="formDadosCarga">
    <v-row class="my-3">
      <v-col cols="12" md="4" class="py-2">
        <v-select
          v-model="dadosFormCargaLocal.modalidade"
          bg-color="white"
          :items="ModalidadeEntregaEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Modalidade *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
        <!--  -->
      <v-col cols="4" class="py-2">
        <v-tooltip location="top">
          <!-- Ativador: o badge com o select dentro -->
          <template #activator="{ props }">
            <v-badge
              class="w-100 px-0"
              v-bind="props"
              content="?"
            >
              <v-select
                v-model="dadosFormCargaLocal.emitente"
                bg-color="white"
                :items="TipoDoEmitenteEnum"
                item-value="value"
                item-title="text"
                variant="outlined"
                label="Tipo do Emitente *"
                density="compact"
                :rules="rules.campoObrigatorio"
                clearable
              />
            </v-badge>
          </template>

            <!-- Conteúdo HTML com quebra de linha -->
          <span v-html="mensagemTooltipModalidade"></span>
        </v-tooltip>
      </v-col>

      <v-col cols="12" md="4" class="py-2">
        <v-select
          v-model="dadosFormCargaLocal.transportador"
          bg-color="white"
          :items="TipoDoTransportadorEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Tipo do Transportador"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          Informações Gerais
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormCargaLocal.uf_carregamento"
          bg-color="white"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF de Carregamento *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormCargaLocal.uf_descarregamento"
          bg-color="white"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF de Descarregamento *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2" class="py-2">
        <InputTextMoeda
          v-model="dadosFormCargaLocal.peso_bruto"
          label="Peso Bruto *"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2" class="py-2">
         <v-select
          v-model="dadosFormCargaLocal.unidade"
          bg-color="white"
          :items="UnidadeMedidaMdfeEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Un. Medida *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2" class="py-2">
        <v-badge
          class="w-100"
          v-tooltip:bottom="'Gerado automaticamente ao vincular os CT-es'"
          content="?"
        >
          <InputTextMoeda
            prefix="R$"
            v-model="dadosFormCargaLocal.valor_carga"
            label="Valor Carga *"
            bg-color="grey-lighten-3"
            :rules="rules.campoObrigatorio"
            readonly
            clearable
          />
        </v-badge>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-2">
        <v-badge
          class="w-100"
          v-tooltip:bottom="'Informar os Estados por onde a Carga passa (Este campo não é obrigatório se os estados fizerem fronteira)'"
          content="?"
        >
          <v-select
            v-model="dadosFormCargaLocal.percurso"
            placeholder="Selecionar..."
            bg-color="white"
            :items="estadosBrasileiros"
            item-value="value"
            item-title="text"
            variant="outlined"
            label="Percursos"
            density="compact"
            color="blue-darken-2"
            multiple
            chips
            clearable
          />
        </v-badge>
      </v-col>
    </v-row>
    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <v-icon size="large">
              mdi-truck-plus
            </v-icon>
            <span>Carregamento</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12" class="pt-2">
        <v-select
          v-model="dadosFormCargaLocal.carregamento"
          placeholder="Selecionar..."
          bg-color="white"
          :items="estadosESeusMunicipios[dadosFormCargaLocal.uf_carregamento] ? estadosESeusMunicipios[dadosFormCargaLocal.uf_carregamento] : []"
          item-title="description"
          item-value="item"
          variant="outlined"
          no-data-text="Municípios com base nas UFs de carregamento selecionadas"
          label="Municípios *"
          density="compact"
          :rules="rules.campoObrigatorio"
          color="blue-darken-2"
          return-object
          multiple
          chips
          clearable
        />
      </v-col>
    </v-row>
    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <v-icon size="large">
              mdi-truck-minus
            </v-icon>
            <span>Descarregamento</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="bg-red-lighten-5 mx-1 pa-2 pt-4 text-grey-darken-2 text-body-2" style="border: 1px solid #ffbdb7;">
          <v-row dense class="bg-red-lighten-4 mt-4 pa-2">
            <v-col cols="12" md="4" class="d-flex ga-2 align-center">
              <div>
                <v-icon color="redNeveah">
                  mdi-note-plus
                </v-icon>
              </div>
              <v-select
                v-model="municipioDescarregamentoSelecionado"
                bg-color="white"
                :items="estadosESeusMunicipios[dadosFormCargaLocal.uf_descarregamento] ? estadosESeusMunicipios[dadosFormCargaLocal.uf_descarregamento] : []"
                item-title="description"
                variant="outlined"
                label="Município de descarga *"
                no-data-text="Municípios com base nas UFs de descarregamento selecionadas"
                density="compact"
                return-object
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="3" class="d-flex ga-2 align-center">
               <v-combobox
                :loading="comboBoxCteLoading"
                @keyup="(event) => {
                  const tecla = event.key
                  const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                  if (teclaValida) buscaCtes()
                }"
                v-model="cteSelecionado"
                density="compact"
                variant="outlined"
                bg-color="white"
                label="Buscar Cte para Vincular:"
                placeholder="Comece a digitar..."
                :items="listaDeCtes"
                item-title="Id_CTe"
                class="w-100"
                hide-selected
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex ga-2 align-center">
              <v-btn variant="flat" color="redNeveah" @click="vincularCte">
              Adicionar
              </v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 align-center pt-2 text-redNeveah justify-end text-body-1">
                <div>
                  <em>CT-Es vinculados</em>
                </div>
                <div>
                  <v-chip>{{ calculaQuantidadeDeCtesVinculados() }}</v-chip>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">

              <div v-if="dadosFormCargaLocal.descarregamento.length == 0" class="d-flex pt-2 text-grey text-body-2">
                <div class="mt-2">
                  <em>Nenhum CT-e vinculado</em>
                </div>
              </div>

              <v-card class="pa-4 rounded-md bg-red-lighten-5 d-flex flex-column ga-3 overflow-y-auto" variant="flat" max-height="450" v-else>

                <div v-for="item, indexDescarregamento in dadosFormCargaLocal?.descarregamento" :key="`item-descarregamento-${indexDescarregamento}`" class="mt-4 mb-2">
                  <div class="mb-4 d-flex align-center ga-2">
                    <span class="text-body-1 text-redNeveah">
                      <strong>{{item.nome_municipio}}: </strong>
                    </span>
                    <v-chip label color="redNeveah" variant="flat">
                      <div><strong>Código do Município: </strong>{{item.codigo_municipio}}</div>
                    </v-chip>
                  </div>

                  <v-row class="mb-4">
                    <v-col
                      cols="12"
                      md="4"
                      class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
                      v-for="cte, index in item.documentos_fiscais" :key="`cte-${index}`"
                    >
                      <v-card class="px-2 bg-red-lighten-4 text-redNeveah pa-2" style="border: 1px solid #ba1614;">
                        <div class="d-flex align-center text-body-2">
                          <div class="d-flex flex-column w-100 ga-2">
                            <div class="w-100">ID: <strong>{{ cte.Id_CTe}}</strong></div>
                            <div class="w-100">Chave: <strong>{{cte.chCTe}}</strong></div>
                          </div>
                          <v-btn icon="mdi-close" size="x-small" variant="tonal" @click="removeCte(item, index, indexDescarregamento)"/>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-divider :thickness="2"></v-divider>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <v-icon size="large">
              mdi-truck-trailer
            </v-icon>
            <span>Produto Predominante</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="bg-red-lighten-5 mx-1 pa-2 pt-4 text-grey-darken-2 text-body-2" style="border: 1px solid #ffbdb7;">
          <v-row dense>
            <v-col cols="12" md="3">
              <v-select
                v-model="dadosFormCargaLocal.produto_predominante.tipo_carga"
                bg-color="white"
                :items="TipoCargaEnum"
                item-value="value"
                item-title="text"
                variant="outlined"
                label="Tipo da Carga*"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="dadosFormCargaLocal.produto_predominante.nome"
                label="Nome/Descrição do produto *"
                density="compact"
                variant="outlined"
                bg-color="white"
                clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-badge
                class="w-100"
                v-tooltip:bottom="'Obrigatório se houver apenas 1 CT-e vinculado'"
                content="?"
              >
                <InputText
                  v-model="dadosFormCargaLocal.produto_predominante.ncm"
                  :rules="calculaQuantidadeDeCtesVinculados() == 1 ? rules.campoObrigatorio : []"
                  label="NCM"
                  density="compact"
                  variant="outlined"
                  bg-color="white"
                  counter="8"
                  clearable
                />
              </v-badge>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-badge
                class="w-100"
                v-tooltip:bottom="'Obrigatório se houver apenas 1 CT-e vinculado'"
                content="?"
              >
                <InputText
                  v-model="dadosFormCargaLocal.produto_predominante.lotacao.carregamento.cep"
                  :rules="calculaQuantidadeDeCtesVinculados() == 1 ? rules.campoObrigatorio : []"
                  variant="outlined"
                  bg-color="white"
                  density="compact"
                  label="CEP do local de carregamento"
                  mask="#####-###"
                  counter="9"
                  clearable
                />
              </v-badge>
            </v-col>
            <v-col cols="12" md="6">
               <v-badge
                class="w-100"
                v-tooltip:bottom="'Obrigatório se houver apenas 1 CT-e vinculado'"
                content="?"
              >
                <InputText
                  v-model="dadosFormCargaLocal.produto_predominante.lotacao.descarregamento.cep"
                  :rules="calculaQuantidadeDeCtesVinculados() == 1 ? rules.campoObrigatorio : []"
                  variant="outlined"
                  bg-color="white"
                  density="compact"
                  label="CEP do local de descarregamento"
                  mask="#####-###"
                  counter="9"
                  clearable
                />
              </v-badge>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <v-icon size="large">
              mdi-face-agent
            </v-icon>
            <span>Seguro</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row class="mb-4">
      <v-col>
        <div class="bg-red-lighten-5 mx-1 pa-2 pt-4 text-grey-darken-2 text-body-2" style="border: 1px solid #ffbdb7;">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="dadosFormCargaLocal.seguro[0].seguradora.nome_seguradora"
                label="Nome Seguradora *"
                density="compact"
                variant="outlined"
                bg-color="white"
                :rules="rules.campoObrigatorio"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <InputText
                v-model="dadosFormCargaLocal.seguro[0].seguradora.cnpj"
                label="CNPJ Seguradora *"
                bg-color="white"
                density="compact"
                mask="##.###.###/####-##"
                :rules="rules.campoObrigatorio"
                counter="18"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="dadosFormCargaLocal.seguro[0].numero_apolice"
                label="Nº Apólice Seguro *"
                density="compact"
                variant="outlined"
                bg-color="white"
                :rules="rules.campoObrigatorio"
                clearable
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-combobox
                v-model="dadosFormCargaLocal.seguro[0].numero_averbacao"
                bg-color="white"
                variant="outlined"
                density="compact"
                label="Nº da(s) Averbação(es)"
                placeholder="Adicione as averbações"
                chips
                hide-selected
                multiple
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="dadosFormCargaLocal.seguro[0].responsavel.tipo_responsavel"
                bg-color="white"
                :items="TipoResponsavelEnum"
                item-value="value"
                item-title="text"
                variant="outlined"
                label="Responsável *"
                density="compact"
                clearable
                />
            </v-col>
            <v-col cols="12" md="4">
              <v-badge
                class="w-100"
                v-tooltip:bottom="'Não é necessário informar caso o responsável seja o emitente do MDF-e'"
                content="?"
              >
                <v-text-field
                  v-model="dadosFormCargaLocal.seguro[0].responsavel.cnpj"
                  label="CPF/CNPJ Responsável *"
                  density="compact"
                  variant="outlined"
                  bg-color="white"
                  :disabled="dadosFormCargaLocal.seguro[0].responsavel.tipo_responsavel == TipoResponsavelEnumValorDescricao.EMITENTE"
                  clearable
                >
                </v-text-field>
              </v-badge>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-card class="border pa-4 text-body-2 mt-2" variant="tonal" color="redNeveah">
      (*) Campos com esta estrela são obrigatórios
    </v-card>
  </v-form>
</template>

<script>

import { estadosBrasileiros } from '@/Enums/estadosEnum'
import { FinalidadeCteEnum } from '@/Enums/Fiscal/FinalidadeCteEnum'
import { ModalidadeEntregaEnum } from '@/Enums/Fiscal/ModalidadeEntregaEnum'
import { NaturezaOperacaoEnum } from '@/Enums/Fiscal/NaturezaOperacaoEnum'
import { TipoDeEmissaoCteEnum } from '@/Enums/Fiscal/TipoDeEmissaoCteEnum'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue'
import { ClassificacaoTributariaEnum } from '@/Enums/Fiscal/ClassificacaoTributariaEnum'
import { useAlertStore } from '@/stores/alertStore'
import { formataMoeda } from '@/utils/masks';
import { TipoDoEmitenteEnum } from '@/Enums/Fiscal/TipoDoEmitenteEnum'
import { TipoDoTransportadorEnum } from '@/Enums/Fiscal/TipoDoTransportadorEnum.js.js'
import { UnidadeMedidaMdfeEnum } from '@/Enums/Fiscal/UnidadeMedidaMdfeEnum'
import { TipoCargaEnum } from '@/Enums/Fiscal/TipoCargaEnum'
import { TipoResponsavelEnum, TipoResponsavelEnumValorDescricao } from '@/Enums/Fiscal/TipoResponsavelEnum'
import InputText from '@/components/Form/InputText.vue'
import { buscaListaDeCtesHelper } from '@/helpers/buscaListaDeCtes'

export default {
  name: 'FormDadosGeral',
  components: {
    InputTextMoeda,
    InputText
  },
  props: {
    dadosFormCarga: {
      type: Object,
      required: true
    },
    estadosESeusMunicipios: {
      type: Object,
      required: true
    },
    totalDeCtesVinculados: {
      type: Number,
      required: true
    },
  },
  watch: {
    'dadosFormCarga.descarregamento': {
      handler() {
        this.totalDeCtesVinculadosLocal = this.calculaQuantidadeDeCtesVinculados(),
        this.dadosFormCargaLocal.valor_carga = this.calculaValorDaCarga()
      },
      deep: true
    },
    'dadosFormCarga.uf_descarregamento'(newValue, oldValue) {
      if(newValue != oldValue) {
        this.municipioDescarregamentoSelecionado = []
        this.dadosFormCargaLocal.descarregamento = []
        this.municipioDescarregamentoSelecionado = null

      }
    },
  },
  data() {
    return {
      formataMoeda,

      TipoDoEmitenteEnum,
      TipoDoTransportadorEnum,
      estadosBrasileiros,
      UnidadeMedidaMdfeEnum,
      TipoCargaEnum,
      TipoResponsavelEnum,
      TipoResponsavelEnumValorDescricao,

      FinalidadeCteEnum,
      ModalidadeEntregaEnum,
      TipoDeEmissaoCteEnum,
      NaturezaOperacaoEnum,
      ClassificacaoTributariaEnum,

       mensagemTooltipModalidade: `
        Obs.: Deve ser preenchido com <strong>2</strong>, para emitentes de NF-e e pelas transportadoras quando estiverem fazendo transporte de carga própria.<br>
        Deve ser preenchido com <strong>3</strong>, para transportador de carga que emitirá à posteriori CT-e Globalizado relacionando as NF-e.
      `,

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },

      cteSelecionado: null,
      municipioDescarregamentoSelecionado: null,

      listaDeCtes: [],
      comboBoxCteLoading: false
    }
  },
  computed: {
    dadosFormCargaLocal: {
      get() {
        return this.dadosFormCarga
      },
      set(novosDados) {
        this.$emit('update:dadosFormCarga', novosDados)
      }
    },
    totalDeCtesVinculadosLocal: {
      get() {
        return this.totalDeCtesVinculados
      },
      set(novosDados) {
        this.$emit('update:totalDeCtesVinculados', novosDados)
      }
    },
  },
  methods: {
    calculaValorDaCarga() {

      let total = 0

      for(const municipio in this.dadosFormCargaLocal.descarregamento) {
        const valor = this.calculaValorDaCargaDosDocumentosFiscais(this.dadosFormCargaLocal.descarregamento[municipio]?.documentos_fiscais)
        total += valor
      }

      if(total == 0) {
        return null
      }

      return total
    },

    calculaValorDaCargaDosDocumentosFiscais(documentos_fiscais) {
      let total = 0

      for(const index in documentos_fiscais) {
        total += parseFloat(documentos_fiscais[index].vCarga)
      }

      return total
    },

    calculaQuantidadeDeCtesVinculados() {
      let total = 0

      for(const municipio in this.dadosFormCargaLocal.descarregamento) {
        const quantidadeDeDocumentos = this.dadosFormCargaLocal.descarregamento[municipio]?.documentos_fiscais?.length
        total += quantidadeDeDocumentos
      }

      return total
    },

    vincularCte() {

      const alertStore = useAlertStore();

      if(!this.cteSelecionado || typeof this.cteSelecionado != 'object') {
        alertStore.addAlert('Preencha o Campo do Ct-e corretamente selecionando o CT-e', 'warning')
        return
      }

      if(!this.municipioDescarregamentoSelecionado || typeof this.municipioDescarregamentoSelecionado != 'object') {
        alertStore.addAlert('Preencha o Campo do Município de descarregamento corretamente selecionando o Município', 'warning')
        return
      }

      if(this.dadosFormCargaLocal.descarregamento.length == 0) {
        this.criaNovoItemNoArrayDeDescarregamento()
        return
      }

      const item = this.buscaItemPeloMunicipioNoArrayDeDescarregamento()

      if(!item) {
        this.criaNovoItemNoArrayDeDescarregamento()
        return
      }

      const existeCte = this.verificaSeExisteCteNoArrayDeDocumentos(item.documentos_fiscais)

      if(existeCte) {
        alertStore.addAlert('Este CT-e já foi adicionando para o Município em Questão', 'warning')
        return
      }

      item.documentos_fiscais.push(this.cteSelecionado)

    },

    criaNovoItemNoArrayDeDescarregamento() {
      const item = {
        codigo_municipio: this.municipioDescarregamentoSelecionado.codigo_municipio,
        nome_municipio: this.municipioDescarregamentoSelecionado.description,
        documentos_fiscais: [
          {
            ...this.cteSelecionado
          }
        ]
      }

      this.dadosFormCargaLocal.descarregamento.push(item)
    },

    buscaItemPeloMunicipioNoArrayDeDescarregamento() {
      const item = this.dadosFormCargaLocal.descarregamento.find(item => {
        return item.codigo_municipio == this.municipioDescarregamentoSelecionado.codigo_municipio
      })

      return item
    },

    verificaSeExisteCteNoArrayDeDocumentos(documentos_fiscais) {
      for(const cte in documentos_fiscais) {
        if(documentos_fiscais[cte].chCTe == this.cteSelecionado.chCTe) {
          return true
        }
      }

      return false
    },

    async buscaCtes() {
      await buscaListaDeCtesHelper(
        this.cteSelecionado,
        (clientes) => {
          this.listaDeCtes = clientes;
        },
        (loading) => {
          this.comboBoxCteLoading = loading;
        }
      );
    },

    validate() {
      return this.$refs?.formDadosCarga.validate()
    },

    removeCte(item, index, indexDescarregamento) {
      item.documentos_fiscais.splice(index, 1);

      //remove o item por completo caso nao ajam mais documentos, senao os valores de municipio permanecem preenchidos
      if(item.documentos_fiscais.length == 0) {
        this.dadosFormCargaLocal?.descarregamento.splice(indexDescarregamento, 1)
      }
    },
  }
}
</script>
