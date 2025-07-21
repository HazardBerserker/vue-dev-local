<template>
  <div>
    <v-row>
      <v-col md="4">
        <div class="d-flex justify-center align-center ga-2 align-end w-100">
          <v-icon color="redNeveah" size="large">
            mdi-file-document-multiple
          </v-icon>
          <div class="text-red-lighten-4 text-redNeveah mb-2 text-body-1 pt-2">
            Documentos Vinculados <strong>({{dadosFormDocumentoLocal.length}})</strong>
          </div>
        </div>

        <div v-if="dadosFormDocumentoLocal.length == 0" class="d-flex justify-center pt-2 text-grey text-body-2">
          <div class="d-flex flex-column justify-center text-center ga-6">
            <em>Nenhum Documento vinculado</em>
            <span class="text-h6 text-grey-lighten-2">Seus Documentos Aparecerão Aqui</span>
          </div>
        </div>

        <v-card class="pa-4 bg-grey-lighten-4 rounded-md d-flex flex-column ga-3 overflow-y-auto" variant="flat" max-height="450" v-else>
          <div
            class="bg-red-lighten-5 text-redNeveah pa-2 rounded-lg text-body-2 d-flex flex-column ga-3"
            style="border: 1px solid #ba1614;"
            v-for="documento, index in dadosFormDocumentoLocal" :key="`documento-${index}`"
          >

            <div class="px-3 py-1">
              <div class="d-flex align-center">
                <div class="d-flex flex-column w-100 ga-2">
                  <div class="w-100">Tipo: <strong>{{ DocumentoFiscalEnumDescricao[documento.tipo]}}</strong></div>
                  <div class="w-100">Chave: <strong>{{documento.chave}}</strong></div>
                </div>
                <v-btn icon="mdi-close" size="x-small" variant="tonal" @click="removeQuantidade(index)"/>
              </div>
            </div>

          </div>
        </v-card>
      </v-col>
      <v-col md="8">
        <div class="d-flex justify-space-between align-end w-100">
          <div class="text-redNeveah mb-2 text-h6">
            Documentos
          </div>
        </div>
        <v-form ref="formDadosDocumento" class="bg-grey-lighten-4 border pa-6 elevation-2">
          <v-row dense>
            <v-col cols="12">
              <div class="px-2 text-redNeveah">
                Vincular Documento ao CT-e
                <v-divider :thickness="2"></v-divider>
              </div>
            </v-col>
          </v-row>
          <v-row class="my-3">
            <v-col cols="12" md="3" class="py-2">
              <v-select
                variant="outlined"
                density="compact"
                bg-color="white"
                label="Tipo *"
                item-value="value"
                item-title="text"
                :items="DocumentoFiscalEnum"
                v-model="objetoDocumento.tipo"
                clearable
              />
            </v-col>
            <v-col cols="12" md="9" class="py-2">
              <v-text-field
                variant="outlined"
                density="compact"
                bg-color="white"
                label="Chave *"
                v-model="objetoDocumento.chave"
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

import { DocumentoFiscalEnum, DocumentoFiscalEnumDescricao } from '@/Enums/Fiscal/DocumentoFiscalEnum'
import { useAlertStore } from '@/stores/alertStore'

export default {
  name: 'FormDadosDocumento',
  props: {
    dadosFormDocumento: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      DocumentoFiscalEnum,
      DocumentoFiscalEnumDescricao,

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },

      // objetoQuantidade: {
      //   unidade: null,
      //   medida: null,
      //   quantidade: null
      // },

      objetoDocumento: {
        tipo: 1,
        chave: null,
      }
    }
  },

  computed: {
    dadosFormDocumentoLocal: {
      get() {
        return this.dadosFormDocumento
      },
      set(novosDados) {
        this.$emit('update:dadosFormDocumento', novosDados)
      }
    },
  },
  methods: {
    adicionarQuantidade() {
      const novoObjeto = {
        ...this.objetoDocumento,
      }

      if(this.objetoDocumento.tipo == null
        || this.objetoDocumento.chave == null
      ) {
        const alertStore = useAlertStore();
        alertStore.addAlert('Preencha todos os campos do Documento corretamente para adiciona-lo', 'warning')
        return
      }

      this.dadosFormDocumentoLocal.push(novoObjeto);
    },

    removeQuantidade(index) {
      this.dadosFormDocumentoLocal.splice(index, 1);
    },

    validate() {
      return this.$refs?.formDadosDocumento.validate()
    }
  }
}
</script>

