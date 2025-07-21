<template>
  <div>
    <v-row>
      <v-col md="3">
        <div class="d-flex justify-center align-center ga-2 align-end w-100">
          <v-icon color="redNeveah" size="large">
            mdi-archive-check
          </v-icon>
          <div class="text-red-lighten-4 text-redNeveah mb-2 text-body-1 pt-2">
            Quantidades Adicionadas <strong>({{dadosFormCarga.quantidades.length}})</strong>
          </div>
        </div>

        <div v-if="dadosFormCarga.quantidades.length == 0" class="d-flex justify-center pt-2 text-grey text-body-2">
          <div class="d-flex flex-column justify-center text-center ga-6">
            <em>Nenhuma quantidade adicionada</em>
            <span class="text-h6 text-grey-lighten-2">Suas Quantidades Aparecerão Aqui</span>
          </div>
        </div>

        <v-card class="pa-4 bg-grey-lighten-4 rounded-md d-flex flex-column ga-3 overflow-y-auto" variant="flat" max-height="450" v-else>
          <div
            class="bg-red-lighten-5 text-redNeveah pa-2 rounded-lg text-body-2 d-flex flex-column ga-3"
            style="border: 1px solid #ba1614;"
            v-for="quantidade, index in dadosFormCarga.quantidades" :key="`quantidade-${index}`"
          >

            <div class="px-3 py-1">
              <div class="d-flex align-center">
                <div class="d-flex flex-column w-100 ga-2">
                  <div class="w-100">Unidade: <strong>{{ UnidadeDeMedidaEnumDescricao[quantidade.unidade_medida]}}</strong></div>
                  <div class="w-100">Quantidade: <strong>{{quantidade.quantidade}}</strong></div>
                  <div class="w-100">Medida: <strong>{{quantidade.tipo_medida}}</strong></div>
                </div>
                <v-btn icon="mdi-close" size="x-small" variant="tonal" @click="removeQuantidade(index)"/>
              </div>
            </div>

          </div>
        </v-card>
      </v-col>
      <v-col md="9">
        <div class="d-flex justify-space-between align-end w-100">
          <div class="text-redNeveah mb-2 text-h6">
            Carga
          </div>
        </div>
        <v-form ref="formDadosCarga" class="bg-grey-lighten-4 border pa-6 elevation-2">
          <v-row dense>
            <v-col cols="12">
              <div class="px-2 text-redNeveah">
                Informações do Transporte da Carga
                <v-divider :thickness="2"></v-divider>
              </div>
            </v-col>
          </v-row>
          <v-row class="my-3">
            <v-col cols="12" md="6" class="py-2">
              <v-text-field
                v-model="dadosFormCargaLocal.produto_predominante"
                variant="outlined"
                density="compact"
                bg-color="white"
                label="Produto Predominante *"
                :rules="rules.campoObrigatorio"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-2">
              <v-text-field
                variant="outlined"
                density="compact"
                bg-color="white"
                label="Características"
                v-model="dadosFormCargaLocal.caracteristicas"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-2">
              <InputTextMoeda
                v-model="dadosFormCargaLocal.valor_total"
                prefix="R$"
                density="compact"
                bg-color="white"
                label="Valor Total *"
                clearable
                :rules="rules.campoObrigatorio"
              />
            </v-col>
            <v-col cols="12" md="6" class="py-2">
              <v-text-field
                variant="outlined"
                density="compact"
                bg-color="white"
                label="Valor de Averbação"
                v-model="dadosFormCargaLocal.valor_averbacao"
                clearable
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <div class="px-2 text-redNeveah">
                Quantidades
                <v-divider :thickness="2"></v-divider>
              </div>
            </v-col>
          </v-row>
          <v-row class="my-3">
            <v-col cols="12" md="4" class="py-2">
              <v-select
                variant="outlined"
                density="compact"
                bg-color="white"
                item-value="value"
                item-title="text"
                label="Unidade *"
                :items="UnidadeDeMedidaEnum"
                v-model="objetoQuantidade.unidade_medida"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4" class="py-2">
              <v-badge
                class="w-100"
                v-tooltip="'Exemplos: PESO BRUTO, PESO DECLARADO, LITRAGEM, CAIXAS e etc.'"
                content="?"
              >
                <v-text-field
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  label="Medida *"
                  v-model="objetoQuantidade.tipo_medida"
                  hide-details
                  clearable
                >
                </v-text-field>
              </v-badge>
            </v-col>
            <v-col cols="12" md="4" class="pt-2">
              <v-text-field
                type="number"
                variant="outlined"
                density="compact"
                bg-color="white"
                label="Quantidade *"
                v-model="objetoQuantidade.quantidade"
                hide-details
                clearable
              />
            </v-col>
            <v-col class="mb-4">
              <v-btn prepend-icon="mdi-plus" variant="flat" color="red-darken-3" @click="adicionarQuantidade">
                Adicionar
              </v-btn>
            </v-col>
          </v-row>
          <v-card class="border pa-4 text-body-2 mt-2" variant="tonal" color="redNeveah">
            (*) Campos com esta estrela são obrigatórios
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import InputTextMoeda from '@/components/Form/InputTextMoeda.vue'
import { UnidadeDeMedidaEnum, UnidadeDeMedidaEnumDescricao } from '@/Enums/Fiscal/UnidadeDeMedidaEnum'
import { useAlertStore } from '@/stores/alertStore'

export default {
  name: 'FormDadosCarga',
  components: {
    InputTextMoeda
  },
  props: {
    dadosFormCarga: {
      type: Object,
      required: true
    },
  },
  mounted() {
    this.quantidades = this.dadosFormCargaLocal.quantidades
  },
  data() {
    return {
      UnidadeDeMedidaEnum,
      UnidadeDeMedidaEnumDescricao,

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },

      objetoQuantidade: {
        unidade_medida: null,
        tipo_medida: null,
        quantidade: null,
      },

      quantidades: []
    }
  },

  watch: {
    quantidades: {
      handler() {
        this.dadosFormCargaLocal.quantidades = this.quantidades
      },
      deep: true
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
    adicionarQuantidade() {
      const novoObjeto = {
        ...this.objetoQuantidade
      }

      if(this.objetoQuantidade.unidade_medida == null
        || this.objetoQuantidade.tipo_medida == null
        || this.objetoQuantidade.quantidade == null
      ) {
        const alertStore = useAlertStore();
        alertStore.addAlert('Preencha todos os campos de Quantidades corretamente para adicionar uma Quantidade', 'warning')
        return
      }

      this.quantidades.push(novoObjeto);
    },

    removeQuantidade(index) {
      this.quantidades.splice(index, 1);
    },

    validate() {
      return this.$refs?.formDadosCarga.validate()
    }
  }
}
</script>

