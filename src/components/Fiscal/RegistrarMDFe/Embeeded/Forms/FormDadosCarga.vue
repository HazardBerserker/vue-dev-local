<template>
  <v-form class="bg-grey-lighten-4 border elevation-2 pa-6" ref="formDadosGeral">
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
        <v-text-field
          v-model="dadosFormCargaLocal.peso_bruto"
          label="Peso Bruto *"
          density="compact"
          variant="outlined"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          clearable
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="2" class="py-2">
         <v-select
          v-model="dadosFormCargaLocal.unidade"
          bg-color="white"
          :items="UnidadeDeMedidaEnum"
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
        <InputTextMoeda
          prefix="R$"
          v-model="dadosFormCargaLocal.valor_carga"
          label="Valor Carga *"
          bg-color="white"
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-2">
         <v-badge
          class="w-100"
          v-tooltip:bottom="'Informar os Estados por onde a Carga passou'"
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
            :rules="rules.campoObrigatorio"
            color="blue-darken-2"
            multiple
            chips
            clearable
          />
        </v-badge>
      </v-col>
    </v-row>
    <v-row dense class="mt-4">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          Carregamento
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
          :items="municipiosDoPercurso"
          item-title="description"
          item-value="item"
          variant="outlined"
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
    <v-row dense class="mt-4">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          Descarregamento
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="bg-red-lighten-5 mx-1 pa-2 pt-4 text-grey-darken-2 text-body-2" style="border: 1px solid #ffbdb7;">
          <!-- [

            "nome_municipio": "São Paulo",
            "codigo_municipio": "3550308",
            "documentos_fiscais": [...]
            ] -->
          <!-- [

            "documentos_fiscais": [
                {
                    "chave": "00000000000000000000000000000000000000000000"
                },
                {
                    "chave": "00000000000000000000000000000000000000000000"
                },
                {
                    "chave": "00000000000000000000000000000000000000000000"
                }
            ],
            ] -->
          <v-row dense>
            <v-col cols="12" md="1" class="align-center d-flex">
              <div class="text-h6 text-center bg-grey-darken-3 border-md w-100">
                <strong>#1</strong>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="dadosFormCargaLocal.uf_carregamento"
                bg-color="white"
                :items="estadosBrasileiros"
                item-value="value"
                item-title="text"
                variant="outlined"
                label="Município de descarga*"
                density="compact"
                return-object
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="7">
              <v-text-field
                v-model="dadosFormCargaLocal.peso_bruto"
                label="Chave de acesso dos Documentos Fiscais*"
                density="compact"
                variant="outlined"
                bg-color="white"
                hide-details
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="1" class="align-center d-flex">
              <v-btn variant="flat" icon="mdi-close" size="x-small" color="grey-darken-3">

              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row dense class="mt-4">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          Produto Predominante
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="bg-red-lighten-5 mx-1 pa-2 pt-4 text-grey-darken-2 text-body-2" style="border: 1px solid #ffbdb7;">
          <v-row dense>
            <v-col cols="12" md="1" class="align-center d-flex">
              <div class="text-h6 text-center bg-grey-darken-3 border-md w-100">
                <strong>#1</strong>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="dadosFormCargaLocal.produto_predominante.tipo_carga"
                bg-color="white"
                :items="ProdutoPredominanteEnum"
                item-value="value"
                item-title="text"
                variant="outlined"
                label="Tipo da Carga*"
                density="compact"
                return-object
                hide-details
                clearable
                />
            </v-col>
            <v-col cols="12" md="">
              <v-text-field
                v-model="dadosFormCargaLocal.produto_predominante.nome"
                label="Nome/Descrição do produto *"
                density="compact"
                variant="outlined"
                bg-color="white"
                hide-details
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- <v-row dense>
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          Serviços Personalizados
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

     <v-row class="my-3 bg-grey-lighten-2 mx-1 pt-4">
        <v-col cols="12" md="3" class="py-2">
          <v-text-field
            v-model="nomeServicoPersonalizado"
            label="Nome do Serviço *"
            placeholder="Ex: AJUDANTE"
            density="compact"
            variant="outlined"
            bg-color="white"
            clearable
          />
        </v-col>
        <v-col cols="12" md="9" class="py-2">
          <InputTextMoeda
            v-model="valorServicoPersonalizado"
            prefix="R$"
            label="Valor do Serviço *"
            bg-color="white"
            clearable
          />
        </v-col>
        <v-col class="mb-4">
          <v-btn prepend-icon="mdi-plus" variant="flat" color="red-darken-4" @click="adicionarServicoPersonalizado">
            Adicionar
          </v-btn>
        </v-col>
     </v-row>

     <v-row class="mx-1 bg-red-lighten-5 mb-6" v-if="Object.keys(dadosFormCargaLocal.servico.componentes).length !== 0">
        <v-col>
          <v-row>
            <v-col cols="3" v-for="valorServico, campo in dadosFormCargaLocal.servico.componentes" :key="campo">
              <v-card class="pa-2 pe-4 d-flex rounded-pill align-center ga-2 justify-space-between" color="grey-darken-1">
                <div class="d-flex ga-2">
                  <v-btn icon="mdi-close" size="x-small" color="grey-darken-4" @click="removeServico(campo)">
                  </v-btn>
                  <v-chip variant="flat" color="grey-darken-4">
                    {{campo}}
                  </v-chip>
                </div>
                <div>
                  {{formataMoeda(valorServico)}}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
     </v-row> -->

    <v-row>
        <v-col md="12" class="py-2">
          <v-textarea
            v-model="dadosFormCargaLocal.observacoes_gerais"
            bg-color="white"
            variant="outlined"
            label="Observações Gerais"
            density="compact"
            clearable
          >
          </v-textarea>
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
import { UnidadeDeMedidaEnum } from '@/Enums/Fiscal/UnidadeDeMedidaEnum'
import { ProdutoPredominanteEnum } from '@/Enums/Fiscal/ProdutoPredominanteEnum'

export default {
  name: 'FormDadosGeral',
  components: {
    InputTextMoeda
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
    municipiosDoPercurso: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      formataMoeda,

      TipoDoEmitenteEnum,
      TipoDoTransportadorEnum,
      estadosBrasileiros,
      UnidadeDeMedidaEnum,
      ProdutoPredominanteEnum,

      FinalidadeCteEnum,
      ModalidadeEntregaEnum,
      TipoDeEmissaoCteEnum,
      NaturezaOperacaoEnum,
      ClassificacaoTributariaEnum,

       mensagemTooltipModalidade: `
        Obs.: Deve ser preenchido com <strong>2</strong>, para emitentes de NF-e e pelas transportadoras quando estiverem fazendo transporte de carga própria.<br>
        Deve ser preenchido com <strong>3</strong>, para transportador de carga que emitirá à posteriori CT-e Globalizado relacionando as NF-e.
      `,

      nomeServicoPersonalizado: null,
      valorServicoPersonalizado: null,

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
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
  },
  methods: {
  //   depois

  //   const dadosParaSalvar = {
  //   carregamento: this.dadosFormCargaLocal.carregamento.map(municipio => ({
  //     nome_municipio: municipio.description,
  //     codigo_municipio: municipio.codigo_municipio
  //   }))
  // }

    municipiosDoEstadoSelecionado(uf) {
      if(!uf) {
        return []
      }
      return this.estadosESeusMunicipios[uf]
    },

    validate() {
      return this.$refs?.formDadosGeral.validate()
    },

    adicionarServicoPersonalizado() {

      const alertStore = useAlertStore();

      if(this.nomeServicoPersonalizado == null
        || this.valorServicoPersonalizado == null
      ) {
        alertStore.addAlert('Preencha todos os campos do Serviço corretamente para adiciona-lo', 'warning')
        return
      }

      const campo = this.dadosFormCargaLocal?.servico?.componentes[this.nomeServicoPersonalizado]

      if(campo) {
        alertStore.addAlert('Já existe um Serviço com este Nome', 'warning')
        return
      }

      this.dadosFormCargaLocal.servico.componentes[this.nomeServicoPersonalizado] = this.valorServicoPersonalizado;
    },

    removeServico(chave) {
      delete this.dadosFormCargaLocal.servico.componentes[chave]
    },
  }
}
</script>
