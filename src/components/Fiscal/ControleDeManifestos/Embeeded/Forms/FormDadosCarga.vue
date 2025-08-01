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
          readonly
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
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF de Carregamento *"
          density="compact"
          :rules="rules.campoObrigatorio"
          bg-color="grey-lighten-3"
          readonly
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormCargaLocal.uf_descarregamento"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF de Descarregamento *"
          density="compact"
          :rules="rules.campoObrigatorio"
          bg-color="grey-lighten-3"
          readonly
        />
      </v-col>
      <v-col cols="12" md="2" class="py-2">
        <InputTextMoeda
          v-model="dadosFormCargaLocal.peso_bruto"
          label="Peso Bruto *"
          :rules="rules.campoObrigatorio"
          bg-color="grey-lighten-3"
          readonly
        />
      </v-col>
      <v-col cols="12" md="2" class="py-2">
         <v-select
          v-model="dadosFormCargaLocal.unidade"
          :items="UnidadeMedidaMdfeEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Un. Medida *"
          density="compact"
          :rules="rules.campoObrigatorio"
          bg-color="grey-lighten-3"
          readonly
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
          bg-color="grey-lighten-3"
          readonly
          item-title="nome_municipio"
          item-value="codigo_municipio"
          variant="outlined"
          no-data-text="Municípios com base nas UFs de carregamento selecionadas"
          label="Municípios *"
          density="compact"
          :rules="rules.campoObrigatorio"
          color="blue-darken-2"
          multiple
          chips
        />
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
                  :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
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
                  :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
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
                  :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
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
                :rules="rules.campoObrigatorio"
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
                :rules="rules.campoObrigatorio"
                density="compact"
                clearable
                />
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
import { formataMoeda } from '@/utils/masks';
import { TipoDoEmitenteEnum } from '@/Enums/Fiscal/TipoDoEmitenteEnum'
import { TipoDoTransportadorEnum } from '@/Enums/Fiscal/TipoDoTransportadorEnum.js.js'
import { UnidadeMedidaMdfeEnum } from '@/Enums/Fiscal/UnidadeMedidaMdfeEnum'
import { TipoCargaEnum } from '@/Enums/Fiscal/TipoCargaEnum'
import { TipoResponsavelEnum, TipoResponsavelEnumValorDescricao } from '@/Enums/Fiscal/TipoResponsavelEnum'
import InputText from '@/components/Form/InputText.vue'

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
    tipoDoResponsavelComputado(newValue, oldValue) {
      if(newValue == oldValue) return

      if(oldValue == TipoResponsavelEnumValorDescricao.RESPONSAVEL_PELA_CONTRATACAO && this.dadosFormCargaLocal.seguro[0].responsavel.cnpj != null) {
        this.dadosFormCargaLocal.seguro[0].responsavel.cnpj = null
      }
    }
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
        Deve ser preenchido com <strong>3</strong>, para transportador de carga que emitirá o posterior CT-e Globalizado relacionando as NF-e.
      `,

      rules: {
        campoObrigatorio: [
          (v) => v != null && v !== undefined && v != '' || 'Este campo é obrigatório'
        ],
      },
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
    tipoDoResponsavelComputado() {
      return this.dadosFormCargaLocal.seguro[0].responsavel.tipo_responsavel
    }
  },
  methods: {
    validate() {
      return this.$refs?.formDadosCarga.validate()
    },
  }
}
</script>
