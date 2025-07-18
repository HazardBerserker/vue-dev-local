<template>
  <div>
    <div class="d-flex justify-space-between align-end w-100">
      <div class="text-redNeveah mb-2 text-h6">
        Expedidor
      </div>

      <div class="d-flex ga-12">



        <div class="d-flex ga-2 mb-1 align-end">
          <v-radio-group
          v-model="valorDosRadios"
          inline
          hide-details
        >
          <v-radio
            label="Não há Expedidor"
            :value="1"
          ></v-radio>

          <v-radio
            label="Expedidor é igual o Remetente"
            :base-color="!remetenteTemTodosOsDadosObrigatoriosPreenchidos ? 'grey-lighten-1' : ''"
            :class="!remetenteTemTodosOsDadosObrigatoriosPreenchidos ? 'text-grey-lighten-1' : ''"
            :readonly="!remetenteTemTodosOsDadosObrigatoriosPreenchidos"
            v-tooltip="!remetenteTemTodosOsDadosObrigatoriosPreenchidos ? 'Preencha os dados do remetente para ativar essa funcionalidade' : 'Traz dados do Remetente'"
            :value="2"
          ></v-radio>

          <v-radio
            label="Preencher manualmente"
            :value="3"
          ></v-radio>
        </v-radio-group>
        </div>

        <div class="d-flex flex-column ga-2 mb-1">
          <v-btn
            class="ms-auto"
            variant="flat"
            color="grey-darken-3"
            rounded="pill"
            max-width="300"
            prepend-icon="mdi-sync"
            :disabled="desabilitaPreenchimentoAutomatico()"
            @click="preencheDadosDoClienteAutomaticamente"
          >
            Preenchimento automatico
          </v-btn>
          <span class="text-caption">
            Preencha o CNPJ para ativar essa funcionalidade
          </span>
        </div>
      </div>
    </div>

    <v-form ref="formDadosAtores" class="bg-grey-lighten-4 border pa-6 elevation-2">
      <v-row class="my-3">
        <v-col cols="12" md="4" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="CNPJ *"
            v-model="dadosFormAtoresExpedidorLocal.cnpj"
            mask="##.###.###/####-##"
            :rules="rules.campoObrigatorio"
            counter="18"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Razão Social *"
            v-model="dadosFormAtoresExpedidorLocal.nome_razao"
            :rules="rules.campoObrigatorio"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
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
            v-model="dadosFormAtoresExpedidorLocal.ie"
            :disabled="semExpedidorLocal"
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
            v-model="dadosFormAtoresExpedidorLocal.cep"
            mask="#####-###"
            :rules="rules.campoObrigatorio"
            counter="8"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
            clearable
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Endereço *"
            v-model="dadosFormAtoresExpedidorLocal.endereco"
            :rules="rules.campoObrigatorio"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
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
            v-model="dadosFormAtoresExpedidorLocal.numero"
            :rules="rules.campoObrigatorio"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
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
            v-model="dadosFormAtoresExpedidorLocal.complemento"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
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
            v-model="dadosFormAtoresExpedidorLocal.bairro"
            :rules="rules.campoObrigatorio"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
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
            v-model="dadosFormAtoresExpedidorLocal.cidade"
            :rules="rules.campoObrigatorio"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2" class="py-2">
          <v-select
            v-model="dadosFormAtoresExpedidorLocal.uf"
            bg-color="white"
            :items="estadosBrasileiros"
            item-value="value"
            item-title="text"
            variant="outlined"
            label="UF *"
            density="compact"
            :rules="rules.campoObrigatorio"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="Telefone *"
            v-model="dadosFormAtoresExpedidorLocal.telefone"
            :mask="dadosFormAtoresExpedidorLocal?.telefone?.length > 10 ? '(##) #####-####' : '(##) ####-####'"
            counter="15"
            :disabled="expedidorEhIgualRemetenteLocal || semExpedidorLocal"
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
  name: 'FormDadosExpedidor',
  components: {
    InputText
  },
  props: {
    dadosFormAtoresExpedidor: {
      type: Object,
      required: true
    },
    dadosFormAtoresRemetente: {
      type: Object,
      required: true
    },
    expedidorEhIgualRemetente: {
      type: Boolean,
      required: true
    },
    semExpedidor: {
      type: Boolean,
      required: true
    },
    remetenteTemTodosOsDadosObrigatoriosPreenchidos: {
      type: Boolean,
      required: true
    },
  },
  watch: {
    valorDosRadios(newValue) {

      this.semExpedidorLocal = false
      this.expedidorEhIgualRemetenteLocal = false
      this.ativaPreenchimentoManual = false

      if(newValue == 1) {
        this.limpaCampos()
        this.semExpedidorLocal = true
        return
      }
      if(newValue == 2) {
        Object.assign(this.dadosFormAtoresExpedidorLocal, this.dadosFormAtoresRemetente)
        this.expedidorEhIgualRemetenteLocal = true
        return
      }
       if(newValue == 3) {
        this.ativaPreenchimentoManual = true
      }
    },
  },

  data() {
    return {
      estadosBrasileiros,
      FinalidadeCteEnum,
      ModalidadeEntregaEnum,
      TipoDeEmissaoCteEnum,
      NaturezaOperacaoEnum,

      expedidorVazio: {
        nome_razao: null,
        nome_fantasia: null,
        cnpj: null,
        telefone: null,
        endereco: null,
        numero: null,
        complemento: null,
        bairro: null,
        cep: null,
        cidade: null,
        uf: null,
        ie: null,
      },

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },

      valorDosRadios: 1,
      ativaPreenchimentoManual: false,
    }
  },
  computed: {
    dadosFormAtoresExpedidorLocal: {
      get() {
        return this.dadosFormAtoresExpedidor
      },
      set(novosDados) {
        this.$emit('update:dadosFormAtores', novosDados)
      }
    },

    expedidorEhIgualRemetenteLocal: {
      get() {
        return this.expedidorEhIgualRemetente
      },
      set(novoValor) {
        this.$emit('update:expedidorEhIgualRemetente', novoValor)
      }
    },

    semExpedidorLocal: {
      get() {
        return this.semExpedidor
      },
      set(novoValor) {
        this.$emit('update:semExpedidor', novoValor)
      }
    },
  },
  methods: {
    desabilitaPreenchimentoAutomatico() {
      if(
        this.dadosFormAtoresExpedidorLocal?.cnpj?.length != 14 ||
        this.expedidorEhIgualRemetente
      ) {
        return true
      }
      return false
    },

    limpaCampos() {
      Object.assign(this.dadosFormAtoresExpedidorLocal, this.expedidorVazio)
    },

    async preencheDadosDoClienteAutomaticamente() {
      const dadosDoCliente = await buscaDadosDoClientePeloCNPJ(this.dadosFormAtoresExpedidorLocal?.cnpj)
      this.preencheDadosEncontrados(dadosDoCliente)
    },

    preencheDadosEncontrados(clienteEncontrado) {

      if(!clienteEncontrado) return;

      this.dadosFormAtoresExpedidorLocal.nome_razao = clienteEncontrado.nome
      this.dadosFormAtoresExpedidorLocal.nome_fantasia = clienteEncontrado.nome_fantasia ?? null
      this.dadosFormAtoresExpedidorLocal.cep = clienteEncontrado.cep
      this.dadosFormAtoresExpedidorLocal.endereco = clienteEncontrado.logradouro
      this.dadosFormAtoresExpedidorLocal.bairro = clienteEncontrado.bairro
      this.dadosFormAtoresExpedidorLocal.numero = clienteEncontrado.numero
      this.dadosFormAtoresExpedidorLocal.estado = clienteEncontrado.estado
      this.dadosFormAtoresExpedidorLocal.cidade = clienteEncontrado.cidade
      this.dadosFormAtoresExpedidorLocal.complemento = clienteEncontrado.complemento ?? null
      this.dadosFormAtoresExpedidorLocal.uf = clienteEncontrado.uf
      this.dadosFormAtoresExpedidorLocal.telefone = clienteEncontrado.telefone ?? null
      this.dadosFormAtoresExpedidorLocal.email = clienteEncontrado.email ?? null
      this.dadosFormAtoresExpedidorLocal.ie = clienteEncontrado.ie ?? null
      // this.dadosFormAtoresExpedidorLocal.estado_inscricao_estadual = clienteEncontrado.estado_inscricao_estadual ?? null
      // this.dadosFormAtoresExpedidorLocal.situacao_cadastral = clienteEncontrado.situacao_cadastral ?? null
    },
  }
}
</script>

