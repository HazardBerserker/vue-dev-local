<template>
  <div>
    <div class="d-flex justify-space-between align-end w-100">
      <div class="text-redNeveah mb-2 text-h6">
        Remetente
      </div>
      <div class="d-flex flex-column ga-2 mb-1">
        <v-btn
          class="ms-auto"
          variant="flat"
          color="grey-darken-3"
          rounded="pill"
          max-width="300"
          prepend-icon="mdi-sync"
          :disabled="dadosFormAtoresRemetenteLocal?.cnpj?.length != 14 ? true : false"
          @click="preencheDadosDoClienteAutomaticamente"
        >
          Preenchimento automatico
        </v-btn>
        <span class="text-caption">
          Preencha o CNPJ para ativar essa funcionalidade
        </span>
      </div>
    </div>

    <v-form ref="formDadosRemetente" class="bg-grey-lighten-4 border pa-6 elevation-2">
      <v-row class="my-3">
        <v-col cols="12" md="4" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="CNPJ *"
            v-model="dadosFormAtoresRemetenteLocal.cnpj"
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
            v-model="dadosFormAtoresRemetenteLocal.nome_razao"
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
            v-model="dadosFormAtoresRemetenteLocal.ie"
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
            v-model="dadosFormAtoresRemetenteLocal.cep"
            mask="#####-###"
            :rules="rules.campoObrigatorio"
            counter="8"
            clearable
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Endereço *"
            v-model="dadosFormAtoresRemetenteLocal.endereco"
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
            v-model="dadosFormAtoresRemetenteLocal.numero"
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
            v-model="dadosFormAtoresRemetenteLocal.complemento"
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
            v-model="dadosFormAtoresRemetenteLocal.bairro"
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
            v-model="dadosFormAtoresRemetenteLocal.cidade"
            :rules="rules.campoObrigatorio"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2" class="py-2">
          <v-select
            v-model="dadosFormAtoresRemetenteLocal.uf"
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
            v-model="dadosFormAtoresRemetenteLocal.telefone"
            :mask="dadosFormAtoresRemetenteLocal?.telefone?.length > 10 ? '(##) #####-####' : '(##) ####-####'"
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
  name: 'FormDadosRemetente',
  components: {
    InputText
  },
  props: {
    dadosFormAtoresRemetente: {
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
    dadosFormAtoresRemetenteLocal: {
      get() {
        return this.dadosFormAtoresRemetente
      },
      set(novosDados) {
        this.$emit('update:dadosFormAtores', novosDados)
      }

    }
  },
  methods: {
    async preencheDadosDoClienteAutomaticamente() {
      const dadosDoCliente = await buscaDadosDoClientePeloCNPJ(this.dadosFormAtoresRemetenteLocal?.cnpj)
      this.preencheDadosEncontrados(dadosDoCliente)
    },

    preencheDadosEncontrados(clienteEncontrado) {

      if(!clienteEncontrado) return;

      this.dadosFormAtoresRemetenteLocal.nome_razao = clienteEncontrado.nome
      this.dadosFormAtoresRemetenteLocal.nome_fantasia = clienteEncontrado.nome_fantasia ?? null
      this.dadosFormAtoresRemetenteLocal.cep = clienteEncontrado.cep
      this.dadosFormAtoresRemetenteLocal.endereco = clienteEncontrado.logradouro
      this.dadosFormAtoresRemetenteLocal.bairro = clienteEncontrado.bairro
      this.dadosFormAtoresRemetenteLocal.numero = clienteEncontrado.numero
      this.dadosFormAtoresRemetenteLocal.cidade = clienteEncontrado.cidade
      this.dadosFormAtoresRemetenteLocal.complemento = clienteEncontrado.complemento ?? null
      this.dadosFormAtoresRemetenteLocal.uf = clienteEncontrado.uf
      this.dadosFormAtoresRemetenteLocal.telefone = clienteEncontrado.telefone ?? null
      this.dadosFormAtoresRemetenteLocal.email = clienteEncontrado.email ?? null
      this.dadosFormAtoresRemetenteLocal.ie = clienteEncontrado.ie ?? null
      // this.dadosFormAtoresRemetenteLocal.estado_inscricao_estadual = clienteEncontrado.estado_inscricao_estadual ?? null
      // this.dadosFormAtoresRemetenteLocal.situacao_cadastral = clienteEncontrado.situacao_cadastral ?? null
    },
  }
}
</script>

