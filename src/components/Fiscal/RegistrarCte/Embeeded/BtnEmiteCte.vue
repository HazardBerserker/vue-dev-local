<template>
  <div>
    <v-btn
      color="cyan-darken-2"
      prepend-icon="mdi-file-plus"
      variant="tonal"
      density="compact"
      class="text-white"
      rounded="pill"
      @click="openDialog"
    >
      Emitir Cte
    </v-btn>

    <v-dialog v-model="dialogIsOpen" transition="dialog-bottom-transition" ref="dialogEmite" fullscreen>
      <v-card>
      <v-toolbar color="redNeveah">
        <v-btn
          icon="mdi-close"
          @click="dialogIsOpen = false"
        ></v-btn>

        <v-toolbar-title>Emitir CT-e</v-toolbar-title>

      </v-toolbar>

        <div class="d-flex justify-center align-center ga-2 my-3 mx-auto px-2">
          <v-row dense>
            <v-col>
              <v-card
                :class="classeBaseDosCards"
                min-width="160" color="redNeveah"
                :variant="stepAtual == 1 ? 'flat' : 'tonal'"
                @click="avancaStep(1)"
              >
                <v-icon>
                  mdi-car
                </v-icon>
                GERAL
              </v-card>
            </v-col>
            <v-col >
              <v-card
                :class="classeBaseDosCards"
                min-width="160" color="redNeveah"
                :variant="stepAtual == 2 ? 'flat' : 'tonal'"
                @click="avancaStep(2)"
              >
                <v-icon>
                  mdi-car
                </v-icon>
                ATORES
              </v-card>
            </v-col>
            <v-col >
              <v-card
                :class="classeBaseDosCards"
                min-width="160" color="redNeveah"
                :variant="stepAtual == 4 ? 'flat' : 'tonal'"
                @click="avancaStep(3)"
              >
                <v-icon>
                  mdi-car
                </v-icon>
                IMPOSTOS
              </v-card>
            </v-col>
            <v-col>
              <v-card
                :class="classeBaseDosCards"
                min-width="160" color="redNeveah"
                :variant="stepAtual == 4 ? 'flat' : 'tonal'"
                @click="avancaStep(4)"
              >
                <v-icon>
                  mdi-car
                </v-icon>
                DOCUMENTOS
              </v-card>
            </v-col>
            <v-col>
              <v-card
                class="d-flex flex-column justify-center align-center ga-2 pa-2"
                :class="classeBaseDosCards"
                min-width="160" color="redNeveah"
                :variant="stepAtual == 5 ? 'flat' : 'tonal'"
                @click="avancaStep(5)"
              >
                <v-icon>
                  mdi-car
                </v-icon>
                RODOVIÁRIOS
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex">

          <div class="w-100 ma-6">

            <v-fade-transition>
              <FormDadosGeral
                :dadosFormGeral="dadosFormGeral"
                :estadosESeusMunicipios="estadosESeusMunicipios"
                v-if="stepAtual == 1"
              />
            </v-fade-transition>

            <v-fade-transition>
              <div v-if="stepAtual == 2">
                <v-row>
                  <v-col cols="2">
                    <div class="text-body-2 mb-4 px-1">
                      <em>Preencha os Autores</em>
                    </div>

                    <div class="d-flex flex-column ga-2">
                      <v-card
                        title="Remetente"
                        subtitle="Selecionado"
                        prepend-icon="mdi-account-eye"
                        color="redNeveah"
                        :variant="formAtorAtual == 1 ? 'flat': 'tonal'"
                        @click="formAtorAtual = 1"
                      />
                      <v-card
                        title="Destinatário"
                        subtitle="Selecionado"
                        prepend-icon="mdi-account-eye"
                        color="redNeveah"
                        :variant="formAtorAtual == 2 ? 'flat': 'tonal'"
                        @click="formAtorAtual = 2"
                      />
                      <v-card
                        title="Expedidor"
                        subtitle="Selecionado"
                        prepend-icon="mdi-account-eye"
                        color="redNeveah"
                        :variant="formAtorAtual == 3 ? 'flat': 'tonal'"
                        @click="formAtorAtual = 3"
                      />
                      <v-card
                        title="Recebedor"
                        subtitle="Selecionado"
                        prepend-icon="mdi-account-eye"
                        color="redNeveah"
                        :variant="formAtorAtual == 4 ? 'flat': 'tonal'"
                        @click="formAtorAtual = 4"
                      />
                      <v-card
                        title="Tomador"
                        subtitle="Selecionado"
                        prepend-icon="mdi-account-eye"
                        color="redNeveah"
                        :variant="formAtorAtual == 5 ? 'flat': 'tonal'"
                        @click="formAtorAtual = 5"
                      />
                    </div>
                  </v-col>
                  <v-col cols="10">
                    <div>
                      <v-fade-transition mode="out-in">
                        <template v-if="formAtorAtual == 1">
                          <FormDadosAtores
                            :dadosFormAtoresRemetente="dadosFormAtores.remetente"
                            v-if="formAtorAtual == 1"
                          />
                        </template>
                        <template v-if="formAtorAtual == 2">
                          <FormDadosAtores
                            :dadosFormAtoresRemetente="dadosFormAtores.destinatario"
                            v-if="formAtorAtual == 2"
                          />
                        </template>
                      </v-fade-transition>

                      <v-sheet
                        class="d-flex align-center px-4 mt-8 w-100"
                        max-width="550"
                        rounded="lg"
                      >
                        <v-progress-linear
                          :location="null"
                          bg-color="#92aed9"
                          buffer-color="#6a3e0b"
                          buffer-opacity="1"
                          buffer-value="0"
                          color="redNeveah"
                          height="12"
                          max="5"
                          min="0"
                          model-value="2"
                          rounded
                        ></v-progress-linear>
                        <div class="d-flex w-100 align-center">
                          <div class="ms-4 text-h6">2/5</div>
                          <div class="ms-4 text-body-2">(Atores Preenchidos)</div>
                          <v-icon class="ms-2">
                            mdi-check
                          </v-icon>
                        </div>
                      </v-sheet>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-fade-transition>

            <div class="d-flex justify-end mt-2">
              <v-btn variant="text" append-icon="mdi-chevron-right"  @click="avancaStep(stepAtual + 1)" color="grey-darken-2">
                Avançar
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

// import ApiService from '@/services/ApiService';
// import { useAlertStore } from '@/stores/alertStore';
// import { endpoints } from '@/utils/apiEndpoints';
// import { useLoadingStore } from '@/stores/loading';
import { estadosBrasileiros } from '@/Enums/estadosEnum'
import { FinalidadeCteEnum } from '@/Enums/Fiscal/FinalidadeCteEnum'
import { ModalidadeEntregaEnum } from '@/Enums/Fiscal/ModalidadeEntregaEnum'
import { NaturezaOperacaoEnum } from '@/Enums/Fiscal/NaturezaOperacaoEnum'
import { TipoDeEmissaoCteEnum } from '@/Enums/Fiscal/TipoDeEmissaoCteEnum'
import ApiService from '@/services/ApiService'
import { useAlertStore } from '@/stores/alertStore'
import { useLoadingStore } from '@/stores/loading'
import { endpoints } from '@/utils/apiEndpoints'
import FormDadosGeral from './Forms/FormDadosGeral.vue'
import FormDadosAtores from './Forms/FormDadosAtores.vue'

export default {
  name: 'BtnEmiteCte',
  components: {
    FormDadosGeral,
    FormDadosAtores
  },
  data() {
    return {

      stepsValidos: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      },

      refsForms: {
        1: 'formDadosGeral',
        2: 'formStep2',
        3: 'formStep3',
        4: 'formStep4',
        5: 'formStep5',
      },

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },

      // enums
      estadosBrasileiros,
      TipoDeEmissaoCteEnum,
      FinalidadeCteEnum,
      NaturezaOperacaoEnum,
      ModalidadeEntregaEnum,

      dialogIsOpen: false,

      // dadosformGeral
      dadosFormGeral: {
        cfop: null,
        natureza_operacao:  {
          // preencher depois
        },
        finalidade: { value: '0', text: '0 - Normal' },
        tipo: { value: '0', text: '0 - Normal' },
        modalidade: { value: '1', text: '1 - Rodoviário' },
        local_inicio_prestacao: {
          cidade: null,
          uf: null,
        },
        local_termino_prestacao: {
          cidade: null,
          uf: null,
        },
        servico: {
          valor_total: null,
          valor_recebido: null,
          componentes:  {}
        },
        observacoes_gerais: null,
      },

      // dadosFormAtores
      dadosFormAtores: {
        remetente: {
          nome_razao: null,
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
        destinatario: {
          nome_razao: null,
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
        expedidor: {
          nome_razao: null,
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
        recebedor: {
          nome_razao: null,
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
        tomador: {
          nome_razao: null,
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
      },

      estadosESeusMunicipios: {},

      stepAtual: 2,
      formAtorAtual: 1,
      classeBaseDosCards: 'd-flex flex-column justify-center align-center ga-2 pa-2'
    }
  },
  methods: {

    async avancaStep(novoStep) {

      const alertStore = useAlertStore()
      const formRefAtual = this.refsForms[this.stepAtual];
      const form = this.$refs[formRefAtual];

      if (!form) return;

      const { valid } = await form.validate();

      if (!valid) {
        alertStore.addAlert('Formulário possui campos incorretos', 'warning')
        return; // early return se o step atual não for válido
      }

      const regrasDeEmissao = this.validaRegrasParaEmissao(alertStore)

      if(!regrasDeEmissao) return

      // Marca como válido o step atual
      this.stepsValidos[this.stepAtual] = true;

      // Permite ir pro próximo step ou qualquer anterior já validado
      const podeIr = novoStep <= this.stepAtual + 1 || this.stepsValidos[novoStep];

      if (podeIr) {
        this.stepAtual = novoStep;
      }
    },

    voltaStep(novoStep) {
      // Permite voltar livremente para steps anteriores
      if (novoStep < this.stepAtual) {
        this.stepAtual = novoStep;
      }
    },

    validaRegrasParaEmissao(alertStore) {

      const UFlocalInicioEUFLocalTerminoSaoDiferentes = this.dadosFormGeral.local_inicio_prestacao.uf != this.dadosFormGeral.local_termino_prestacao.uf

      if(this.dadosFormGeral.cfop == '5353' && UFlocalInicioEUFLocalTerminoSaoDiferentes) {
        alertStore.addAlert('CFOP (5353) Não permite que A UF da Origem e UF do Destino sejam diferentes', 'warning')
        return false
      }

      return true
    },

    async buscaEstadosESeusMunicipios() {
      try {

        const endpoint = endpoints.cte.listaMunicipios

        const resposta = await ApiService({
          method: 'get',
          url: endpoint,
        });

        this.estadosESeusMunicipios = resposta.data

      } catch {
        //
      }
    },

    municipiosDoEstadoSelecionado(uf) {
      if(!uf) {
        return []
      }
      return this.estadosESeusMunicipios[uf]
    },

    closeDialog() {
      this.dialogIsOpen = false
    },
    async openDialog() {
      this.dialogIsOpen = true

      const alertStore = useAlertStore();
      const loadingStore = useLoadingStore();

      try {
        loadingStore.show('Buscando Municípios...');
          await this.buscaEstadosESeusMunicipios()
        loadingStore.hide();
      } catch {
        alertStore.addAlert('Erro ao Carregar Municípios', 'error')
      }
    },
  }
}
</script>
