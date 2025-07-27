<template>
  <div>
    <div class="d-flex justify-space-between align-end w-100">
      <div class="text-redNeveah mb-2 text-h6">
        Tomador
      </div>

      <div class="d-flex ga-12">
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

    <v-form ref="formDadosDestinatario" class="bg-grey-lighten-4 border pa-6 elevation-2">
      <v-row dense>
       <v-col cols="6">
          <v-row dense>
            <v-col cols="12">
              <div class="px-2 text-redNeveah">
                Indicador do Tomador
                <v-divider :thickness="2"></v-divider>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="d-flex ga-4 mb-4 align-end">
                <v-radio-group
                  max-width="800"
                  v-model="valorDosRadios"
                  inline
                  hide-details
                >
                  <v-radio
                    label="Remetente"
                    :value="1"
                  ></v-radio>

                  <v-radio
                    label="Destinatário"
                    :value="2"
                  ></v-radio>

                  <v-radio
                    label="Recebedor"
                    :value="3"
                  ></v-radio>

                  <v-radio
                    label="Expedidor"
                    :value="4"
                  ></v-radio>

                  <v-radio
                    label="Outros"
                    :value="5"
                  ></v-radio>
                </v-radio-group>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row dense>
            <v-col cols="12">
              <div class="px-2 text-redNeveah">
                Contribuição do Tomador
                <v-divider :thickness="2"></v-divider>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="d-flex ga-4 mb-4 align-end">
                <v-radio-group
                  max-width="800"
                  v-model="contribuicaoTomadorLocal"
                  inline
                  hide-details
                >
                  <v-radio
                    label="Contribuinte ICMS"
                    :value="ContribuicaoTomadorEnumDescricao.CONTRIBUINTE_ICMS"
                  ></v-radio>

                  <v-radio
                    label="Contribuinte isento de inscrição"
                    :value="ContribuicaoTomadorEnumDescricao.CONTRIBUINTE_ISENTO_INSCRICAO"
                  ></v-radio>

                  <v-radio
                    label="Não Contribuinte"
                    :value="ContribuicaoTomadorEnumDescricao.NAO_CONTRIBUINTE"
                  ></v-radio>
                </v-radio-group>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="my-3">
        <v-col cols="12" md="4" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="CNPJ *"
            v-model="dadosFormAtoresTomadorLocal.cnpj"
            mask="##.###.###/####-##"
            :rules="rules.campoObrigatorio"
            counter="18"
            :disabled="valorDosRadios != 5"
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Razão Social *"
            v-model="dadosFormAtoresTomadorLocal.nome_razao"
            :rules="rules.campoObrigatorio"
            :disabled="valorDosRadios != 5"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" class="py-2">
          <InputText
            density="compact"
            variant="outlined"
            bg-color="white"
            label="Inscrição Estadual (IE)"
            v-model="dadosFormAtoresTomadorLocal.ie"
            :disabled="valorDosRadios != 5"
            mask="##############"
            counter="14"
            clearable
          />
        </v-col>
      </v-row>
      <v-row class="my-3">
        <v-col cols="12" md="2" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="CEP *"
            v-model="dadosFormAtoresTomadorLocal.cep"
            mask="#####-###"
            :rules="rules.campoObrigatorio"
            counter="8"
            :disabled="valorDosRadios != 5"
            clearable
          />
        </v-col>
        <v-col cols="12" md="5" class="py-2">
          <v-text-field
            variant="outlined"
            density="compact"
            bg-color="white"
            label="Endereço *"
            v-model="dadosFormAtoresTomadorLocal.endereco"
            :rules="rules.campoObrigatorio"
            :disabled="valorDosRadios != 5"
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
            v-model="dadosFormAtoresTomadorLocal.numero"
            :rules="rules.campoObrigatorio"
            :disabled="valorDosRadios != 5"
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
            v-model="dadosFormAtoresTomadorLocal.complemento"
            :disabled="valorDosRadios != 5"
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
            v-model="dadosFormAtoresTomadorLocal.bairro"
            :rules="rules.campoObrigatorio"
            :disabled="valorDosRadios != 5"
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
            v-model="dadosFormAtoresTomadorLocal.cidade"
            :rules="rules.campoObrigatorio"
            :disabled="valorDosRadios != 5"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2" class="py-2">
          <v-select
            v-model="dadosFormAtoresTomadorLocal.uf"
            bg-color="white"
            :items="estadosBrasileiros"
            item-value="value"
            item-title="text"
            variant="outlined"
            label="UF *"
            density="compact"
            :rules="rules.campoObrigatorio"
            :disabled="valorDosRadios != 5"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3" class="py-2">
          <InputText
            density="compact"
            bg-color="white"
            label="Telefone *"
            v-model="dadosFormAtoresTomadorLocal.telefone"
            :mask="dadosFormAtoresTomadorLocal?.telefone?.length > 10 ? '(##) #####-####' : '(##) ####-####'"
            counter="15"
            :disabled="valorDosRadios != 5"
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
import { ContribuicaoTomadorEnumDescricao } from '@/Enums/Fiscal/ContribuicaoTomadorEnum'

export default {
  name: 'FormDadosTomador',
  components: {
    InputText
  },
  props: {
    dadosFormAtoresTomador: {
      type: Object,
      required: true
    },
    tomadorEhIgualRemetente: {
      type: Boolean,
      required: true
    },
    tomadorEhIgualDestinatario: {
      type: Boolean,
      required: true
    },
    tomadorEhIgualRecebedor: {
      type: Boolean,
      required: true
    },
    tomadorEhIgualExpedidor: {
      type: Boolean,
      required: true
    },
    tomadorPreenchido: {
      type: Boolean,
      required: true
    },
    contribuicaoTomador: {
      type: Number,
      required: true
    },
  },
  watch: {
    valorDosRadios(newValue) {

      this.tomadorEhIgualRemetenteLocal = false
      this.tomadorEhIgualDestinatarioLocal = false
      this.tomadorEhIgualRecebedorLocal = false
      this.tomadorEhIgualExpedidorLocal = false
      this.tomadorPreenchidoLocal = false

      if(newValue == 1) {
        this.limpaCampos()
        this.tomadorEhIgualRemetenteLocal = true
        this.tomadorPreenchidoLocal = true
        return
      }
      if(newValue == 2) {
        this.limpaCampos()
        this.tomadorEhIgualDestinatarioLocal = true
        this.tomadorPreenchidoLocal = true
        return
      }
      if(newValue == 3) {
        this.limpaCampos()
        this.tomadorEhIgualRecebedorLocal = true
        this.tomadorPreenchidoLocal = true
        return
      }
      if(newValue == 4) {
        this.limpaCampos()
        this.tomadorEhIgualExpedidorLocal = true
        this.tomadorPreenchidoLocal = true
        return
      }

    },
  },
  mounted() {
    this.defineValorDoRadio()
  },

  data() {
    return {
      estadosBrasileiros,
      ContribuicaoTomadorEnumDescricao,
      FinalidadeCteEnum,
      ModalidadeEntregaEnum,
      TipoDeEmissaoCteEnum,
      NaturezaOperacaoEnum,

      tomadorVazio: {
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

      valorDosRadios: null,
      preenchimentoManualAtivo: false
    }
  },
  computed: {
    dadosFormAtoresTomadorLocal: {
      get() {
        return this.dadosFormAtoresTomador
      },
      set(novosDados) {
        this.$emit('update:dadosFormAtores', novosDados)
      }
    },
    tomadorEhIgualRemetenteLocal: {
      get() {
        return this.tomadorEhIgualRemetente
      },
      set(novoValor) {
        this.$emit('update:tomadorEhIgualRemetente', novoValor)
      }
    },
    tomadorEhIgualDestinatarioLocal: {
      get() {
        return this.tomadorEhIgualDestinatario
      },
      set(novoValor) {
        this.$emit('update:tomadorEhIgualDestinatario', novoValor)
      }
    },
    tomadorEhIgualRecebedorLocal: {
      get() {
        return this.tomadorEhIgualRecebedor
      },
      set(novoValor) {
        this.$emit('update:tomadorEhIgualRecebedor', novoValor)
      }
    },
    tomadorEhIgualExpedidorLocal: {
      get() {
        return this.tomadorEhIgualExpedidor
      },
      set(novoValor) {
        this.$emit('update:tomadorEhIgualExpedidor', novoValor)
      }
    },
    tomadorPreenchidoLocal: {
      get() {
        return this.tomadorPreenchido
      },
      set(novoValor) {
        this.$emit('update:tomadorPreenchido', novoValor)
      }
    },
    contribuicaoTomadorLocal: {
      get() {
        return this.contribuicaoTomador
      },
      set(novoValor) {
        this.$emit('update:contribuicaoTomador', novoValor)
      }
    },
  },
  methods: {
    defineValorDoRadio() {
      if(this.tomadorEhIgualRemetente) {
        this.valorDosRadios = 1
        return
      }
      if(this.tomadorEhIgualDestinatario) {
        this.valorDosRadios = 2
        return
      }
      if(this.tomadorEhIgualRecebedor) {
        this.valorDosRadios = 3
        return
      }
      if(this.tomadorEhIgualExpedidor) {
        this.valorDosRadios = 4
        return
      }

      this.valorDosRadios = 5
    },

    desabilitaPreenchimentoAutomatico() {
      if(this.dadosFormAtoresTomadorLocal?.cnpj?.length != 14) {
        return true
      }
      return false
    },

    limpaCampos() {
      Object.assign(this.dadosFormAtoresTomadorLocal, this.tomadorVazio)
    },

    async preencheDadosDoClienteAutomaticamente() {
      const dadosDoCliente = await buscaDadosDoClientePeloCNPJ(this.dadosFormAtoresTomadorLocal?.cnpj)
      this.preencheDadosEncontrados(dadosDoCliente)
    },

    preencheDadosEncontrados(clienteEncontrado) {

      if(!clienteEncontrado) return;

      this.dadosFormAtoresTomadorLocal.nome_razao = clienteEncontrado.nome
      this.dadosFormAtoresTomadorLocal.nome_fantasia = clienteEncontrado.nome_fantasia ?? null
      this.dadosFormAtoresTomadorLocal.cep = clienteEncontrado.cep
      this.dadosFormAtoresTomadorLocal.endereco = clienteEncontrado.logradouro
      this.dadosFormAtoresTomadorLocal.bairro = clienteEncontrado.bairro
      this.dadosFormAtoresTomadorLocal.numero = clienteEncontrado.numero
      this.dadosFormAtoresTomadorLocal.cidade = clienteEncontrado.cidade
      this.dadosFormAtoresTomadorLocal.complemento = clienteEncontrado.complemento ?? null
      this.dadosFormAtoresTomadorLocal.uf = clienteEncontrado.uf
      this.dadosFormAtoresTomadorLocal.telefone = clienteEncontrado.telefone ?? null
      this.dadosFormAtoresTomadorLocal.email = clienteEncontrado.email ?? null
      this.dadosFormAtoresTomadorLocal.ie = clienteEncontrado.ie ?? null
      // this.dadosFormAtoresTomadorLocal.estado_inscricao_estadual = clienteEncontrado.estado_inscricao_estadual ?? null
      // this.dadosFormAtoresTomadorLocal.situacao_cadastral = clienteEncontrado.situacao_cadastral ?? null
    },
  }
}
</script>

