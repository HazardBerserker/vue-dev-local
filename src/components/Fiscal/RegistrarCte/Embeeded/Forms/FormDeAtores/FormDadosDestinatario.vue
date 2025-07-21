<template>
  <div>
    <div class="d-flex justify-space-between align-end w-100">
      <div class="text-redNeveah mb-2 text-h6">
        Destinatário
      </div>
      <div class="d-flex flex-column ga-2 mb-1">
        <v-btn
          class="ms-auto"
          variant="flat"
          color="grey-darken-3"
          rounded="pill"
          max-width="300"
          prepend-icon="mdi-sync"
          :disabled="dadosFormAtoresDestinatarioLocal?.cnpj?.length != 14 ? true : false"
          @click="preencheDadosDoClienteAutomaticamente"
        >
          Preenchimento automatico
        </v-btn>
        <span class="text-caption">
          Preencha o CNPJ para ativar essa funcionalidade
        </span>
      </div>
    </div>

    <v-form ref="formDadosDestinatario" class="bg-grey-lighten-4 border pa-6 elevation-2">
      <v-row class="my-3">
        <v-col cols="12" md="4" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="CNPJ *"
            v-model="dadosFormAtoresDestinatarioLocal.cnpj"
            mask="##.###.###/####-##"
            :rules="rules.campoObrigatorio"
            counter="18"
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Razão Social *"
            v-model="dadosFormAtoresDestinatarioLocal.nome_razao"
            :rules="rules.campoObrigatorio"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Inscrição Estadual (IE)"
            v-model="dadosFormAtoresDestinatarioLocal.ie"
            clearable
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="my-3">
        <v-col cols="12" md="2" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="CEP *"
            v-model="dadosFormAtoresDestinatarioLocal.cep"
            mask="#####-###"
            :rules="rules.campoObrigatorio"
            counter="8"
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Endereço *"
            v-model="dadosFormAtoresDestinatarioLocal.endereco"
            :rules="rules.campoObrigatorio"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Número *"
            v-model="dadosFormAtoresDestinatarioLocal.numero"
            :rules="rules.campoObrigatorio"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Complemento"
            v-model="dadosFormAtoresDestinatarioLocal.complemento"
            clearable
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="my-3">
        <v-col cols="12" md="2" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Bairro *"
            v-model="dadosFormAtoresDestinatarioLocal.bairro"
            :rules="rules.campoObrigatorio"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Cidade *"
            v-model="dadosFormAtoresDestinatarioLocal.cidade"
            :rules="rules.campoObrigatorio"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2" class="py-2">
          <v-select
            v-model="dadosFormAtoresDestinatarioLocal.uf"
            bg-color="white"
            :items="estadosBrasileiros"
            item-value="value"
            item-title="text"
            variant="outlined"
            label="UF *"
            density="compact"
            :rules="rules.campoObrigatorio"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="Telefone *"
            v-model="dadosFormAtoresDestinatarioLocal.telefone"
            :mask="dadosFormAtoresDestinatarioLocal?.telefone?.length > 10 ? '(##) #####-####' : '(##) ####-####'"
            counter="15"
          />
        </v-col>
      </v-row>
      <v-card class="border pa-4 text-body-2 mt-2" variant="tonal" color="redNeveah">
        (*) Campos com esta estrela são obrigatórios
      </v-card>
    </v-form>
  </div>
</template>

<script>

import { estadosBrasileiros } from '@/Enums/estadosEnum'
import { FinalidadeCteEnum } from '@/Enums/Fiscal/FinalidadeCteEnum'
import { ModalidadeEntregaEnum } from '@/Enums/Fiscal/ModalidadeEntregaEnum'
import { NaturezaOperacaoEnum } from '@/Enums/Fiscal/NaturezaOperacaoEnum'
import { TipoDeEmissaoCteEnum } from '@/Enums/Fiscal/TipoDeEmissaoCteEnum'
import InputText from '@/components/Form/InputText.vue'
import { buscaDadosDoClientePeloCNPJ } from '@/helpers/buscaDadosDoClientePeloCNPJ'

export default {
  name: 'FormDadosDestinatario',
  components: {
    InputText
  },
  props: {
    dadosFormAtoresDestinatario: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      estadosBrasileiros,
      FinalidadeCteEnum,
      ModalidadeEntregaEnum,
      TipoDeEmissaoCteEnum,
      NaturezaOperacaoEnum,

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },
    }
  },
  computed: {
    dadosFormAtoresDestinatarioLocal: {
      get() {
        return this.dadosFormAtoresDestinatario
      },
      set(novosDados) {
        this.$emit('update:dadosFormAtores', novosDados)
      }
    }
  },
  methods: {

    async preencheDadosDoClienteAutomaticamente() {
      const dadosDoCliente = await buscaDadosDoClientePeloCNPJ(this.dadosFormAtoresDestinatarioLocal?.cnpj)
      this.preencheDadosEncontrados(dadosDoCliente)
    },

    preencheDadosEncontrados(clienteEncontrado) {

      if(!clienteEncontrado) return;

      this.dadosFormAtoresDestinatarioLocal.nome_razao = clienteEncontrado.nome
      this.dadosFormAtoresDestinatarioLocal.nome_fantasia = clienteEncontrado.nome_fantasia ?? null
      this.dadosFormAtoresDestinatarioLocal.cep = clienteEncontrado.cep
      this.dadosFormAtoresDestinatarioLocal.endereco = clienteEncontrado.logradouro
      this.dadosFormAtoresDestinatarioLocal.bairro = clienteEncontrado.bairro
      this.dadosFormAtoresDestinatarioLocal.numero = clienteEncontrado.numero
      this.dadosFormAtoresDestinatarioLocal.cidade = clienteEncontrado.cidade
      this.dadosFormAtoresDestinatarioLocal.complemento = clienteEncontrado.complemento ?? null
      this.dadosFormAtoresDestinatarioLocal.uf = clienteEncontrado.uf
      this.dadosFormAtoresDestinatarioLocal.telefone = clienteEncontrado.telefone ?? null
      this.dadosFormAtoresDestinatarioLocal.email = clienteEncontrado.email ?? null
      this.dadosFormAtoresDestinatarioLocal.ie = clienteEncontrado.ie ?? null
      // this.dadosFormAtoresDestinatarioLocal.estado_inscricao_estadual = clienteEncontrado.estado_inscricao_estadual ?? null
      // this.dadosFormAtoresDestinatarioLocal.situacao_cadastral = clienteEncontrado.situacao_cadastral ?? null
    },
  }
}
</script>

