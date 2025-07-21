<template>
  <div>
    <div class="d-flex justify-space-between align-end w-100">
      <div class="text-redNeveah mb-2 text-h6">
        Recebedor
      </div>

      <div class="d-flex ga-12">



        <div class="d-flex ga-4 mb-1 align-end">
          <v-radio-group
          max-width="800"
          v-model="valorDosRadios"
          inline
          hide-details
        >
          <v-radio
            label="Não há Recebedor"
            :value="1"
          ></v-radio>

          <v-radio
            label="Recebedor é igual o Destinatario"
            :base-color="!destinatarioTemTodosOsDadosObrigatoriosPreenchidos ? 'grey-lighten-1' : ''"
            :class="!destinatarioTemTodosOsDadosObrigatoriosPreenchidos ? 'text-grey-lighten-1' : ''"
            :readonly="!destinatarioTemTodosOsDadosObrigatoriosPreenchidos"
            v-tooltip="!destinatarioTemTodosOsDadosObrigatoriosPreenchidos ? 'Preencha os dados do destinatario para ativar essa funcionalidade' : 'Traz dados do Destinatario'"
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

    <v-form ref="formDadosRecebedor" class="bg-grey-lighten-4 border pa-6 elevation-2">
      <v-row class="my-3">
        <v-col cols="12" md="4" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="CNPJ *"
            v-model="dadosFormAtoresRecebedorLocal.cnpj"
            mask="##.###.###/####-##"
            :rules="rules.campoObrigatorio"
            counter="18"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Razão Social *"
            v-model="dadosFormAtoresRecebedorLocal.nome_razao"
            :rules="rules.campoObrigatorio"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" class="py-2">
          <v-badge
            class="w-100"
            v-tooltip="'informe ISENTO se não houver'"
            content="?"
          >
            <v-text-field
              variant="outlined"
              density="compact"
              bg-color="white"
              label="Inscrição Estadual (IE)"
              v-model="dadosFormAtoresRecebedorLocal.ie"
              :disabled="semRecebedorLocal"
              clearable
            >
            </v-text-field>
          </v-badge>
        </v-col>
      </v-row>
      <v-row class="my-3">
        <v-col cols="12" md="2" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="CEP *"
            v-model="dadosFormAtoresRecebedorLocal.cep"
            mask="#####-###"
            :rules="rules.campoObrigatorio"
            counter="8"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
            clearable
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Endereço *"
            v-model="dadosFormAtoresRecebedorLocal.endereco"
            :rules="rules.campoObrigatorio"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
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
            v-model="dadosFormAtoresRecebedorLocal.numero"
            :rules="rules.campoObrigatorio"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
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
            v-model="dadosFormAtoresRecebedorLocal.complemento"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
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
            v-model="dadosFormAtoresRecebedorLocal.bairro"
            :rules="rules.campoObrigatorio"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
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
            v-model="dadosFormAtoresRecebedorLocal.cidade"
            :rules="rules.campoObrigatorio"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2" class="py-2">
          <v-select
            v-model="dadosFormAtoresRecebedorLocal.uf"
            bg-color="white"
            :items="estadosBrasileiros"
            item-value="value"
            item-title="text"
            variant="outlined"
            label="UF *"
            density="compact"
            :rules="rules.campoObrigatorio"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="Telefone *"
            v-model="dadosFormAtoresRecebedorLocal.telefone"
            :mask="dadosFormAtoresRecebedorLocal?.telefone?.length > 10 ? '(##) #####-####' : '(##) ####-####'"
            counter="15"
            :disabled="recebedorEhIgualDestinatarioLocal || semRecebedorLocal"
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
  name: 'FormDadosRecebedor',
  components: {
    InputText
  },
  props: {
    dadosFormAtoresRecebedor: {
      type: Object,
      required: true
    },
    dadosFormAtoresDestinatario: {
      type: Object,
      required: true
    },
    recebedorEhIgualDestinatario: {
      type: Boolean,
      required: true
    },
    semRecebedor: {
      type: Boolean,
      required: true
    },
    destinatarioTemTodosOsDadosObrigatoriosPreenchidos: {
      type: Boolean,
      required: true
    },
  },
  watch: {
    valorDosRadios(newValue) {

      this.semRecebedorLocal = false
      this.recebedorEhIgualDestinatarioLocal = false
      this.preenchimentoManualAtivo = false

      if(newValue == 1) {
        this.limpaCampos()
        this.semRecebedorLocal = true
        return
      }
      if(newValue == 2) {
        Object.assign(this.dadosFormAtoresRecebedorLocal, this.dadosFormAtoresDestinatario)
        this.recebedorEhIgualDestinatarioLocal = true
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

      recebedorVazio: {
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
      preenchimentoManualAtivo: false
    }
  },
  computed: {
    dadosFormAtoresRecebedorLocal: {
      get() {
        return this.dadosFormAtoresRecebedor
      },
      set(novosDados) {
        this.$emit('update:dadosFormAtores', novosDados)
      }
    },

    recebedorEhIgualDestinatarioLocal: {
      get() {
        return this.recebedorEhIgualDestinatario
      },
      set(novoValor) {
        this.$emit('update:recebedorEhIgualDestinatario', novoValor)
      }
    },

    semRecebedorLocal: {
      get() {
        return this.semRecebedor
      },
      set(novoValor) {
        this.$emit('update:semRecebedor', novoValor)
      }
    },
  },
  methods: {
    desabilitaPreenchimentoAutomatico() {
      if(
        this.dadosFormAtoresRecebedorLocal?.cnpj?.length != 14 ||
        this.recebedorEhIgualDestinatario
      ) {
        return true
      }
      return false
    },

    limpaCampos() {
      Object.assign(this.dadosFormAtoresRecebedorLocal, this.recebedorVazio)
    },

    async preencheDadosDoClienteAutomaticamente() {
      const dadosDoCliente = await buscaDadosDoClientePeloCNPJ(this.dadosFormAtoresRecebedorLocal?.cnpj)
      this.preencheDadosEncontrados(dadosDoCliente)
    },

    preencheDadosEncontrados(clienteEncontrado) {

      if(!clienteEncontrado) return;

      this.dadosFormAtoresRecebedorLocal.nome_razao = clienteEncontrado.nome
      this.dadosFormAtoresRecebedorLocal.nome_fantasia = clienteEncontrado.nome_fantasia ?? null
      this.dadosFormAtoresRecebedorLocal.cep = clienteEncontrado.cep
      this.dadosFormAtoresRecebedorLocal.endereco = clienteEncontrado.logradouro
      this.dadosFormAtoresRecebedorLocal.bairro = clienteEncontrado.bairro
      this.dadosFormAtoresRecebedorLocal.numero = clienteEncontrado.numero
      this.dadosFormAtoresRecebedorLocal.estado = clienteEncontrado.estado
      this.dadosFormAtoresRecebedorLocal.cidade = clienteEncontrado.cidade
      this.dadosFormAtoresRecebedorLocal.complemento = clienteEncontrado.complemento ?? null
      this.dadosFormAtoresRecebedorLocal.uf = clienteEncontrado.uf
      this.dadosFormAtoresRecebedorLocal.telefone = clienteEncontrado.telefone ?? null
      this.dadosFormAtoresRecebedorLocal.email = clienteEncontrado.email ?? null
      this.dadosFormAtoresRecebedorLocal.ie = clienteEncontrado.ie ?? null
      // this.dadosFormAtoresRecebedorLocal.estado_inscricao_estadual = clienteEncontrado.estado_inscricao_estadual ?? null
      // this.dadosFormAtoresRecebedorLocal.situacao_cadastral = clienteEncontrado.situacao_cadastral ?? null
    },
  }
}
</script>

