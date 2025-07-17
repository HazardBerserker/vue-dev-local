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
                :class="stepAtual == 1 ? `${classeBaseDosCards} card-selecionado` : classeBaseDosCards"
                min-width="160" color="redNeveah"
                variant="tonal"
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
                :class="stepAtual == 2 ? `${classeBaseDosCards} card-selecionado` : classeBaseDosCards"
                min-width="160" color="redNeveah"
                variant="tonal"
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
                :class="stepAtual == 3 ? `${classeBaseDosCards} card-selecionado` : classeBaseDosCards"
                min-width="160" color="redNeveah"
                variant="tonal"
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
                :class="stepAtual == 4 ? `${classeBaseDosCards} card-selecionado` : classeBaseDosCards"
                min-width="160" color="redNeveah"
                variant="tonal"
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
                :class="stepAtual == 5 ? `${classeBaseDosCards} card-selecionado` : classeBaseDosCards"
                min-width="160" color="redNeveah"
                variant="tonal"
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
            <v-form class="bg-grey-lighten-4 border elevation-2" ref="formDadosGeral" v-show="stepAtual == 1">
              <v-row class="my-3">
                <v-col cols="12" class="py-2">
                  <v-select
                    v-model="dadosFormGeral.cfop"
                    bg-color="white"
                    :items="NaturezaOperacaoEnum"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="CFOP *"
                    density="compact"
                    :rules="rules.campoObrigatorio"
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row class="my-3">
                <v-col cols="12" md="4" class="py-2">
                  <v-select
                    v-model="dadosFormGeral.finalidade"
                    bg-color="white"
                    :items="FinalidadeCteEnum"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="Finalidade CTE *"
                    density="compact"
                    :rules="rules.campoObrigatorio"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4" class="py-2">
                  <v-select
                    v-model="dadosFormGeral.tipo"
                    bg-color="white"
                    :items="TipoDeEmissaoCteEnum"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="Tipo de Emissão *"
                    density="compact"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4" class="py-2">
                  <v-select
                    v-model="dadosFormGeral.modalidade"
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
              </v-row>
              <v-row class="my-3">
                <v-col cols="12" md="2" class="py-2">
                  <v-select
                    v-model="dadosFormGeral.local_inicio_prestacao.uf"
                    bg-color="white"
                    :items="estadosBrasileiros"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="UF Origem *"
                    density="compact"
                    :rules="rules.campoObrigatorio"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4" class="py-2">
                  <v-select
                    v-model="dadosFormGeral.local_inicio_prestacao.cidade"
                    no-data-text="Primeiro selecione uma UF..."
                    bg-color="white"
                    :items="municipiosDoEstadoSelecionado(dadosFormGeral.local_inicio_prestacao.uf)"
                    item-value="value"
                    item-title="description"
                    variant="outlined"
                    label="Município Origem *"
                    density="compact"
                    :rules="rules.campoObrigatorio"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="2" class="py-2">
                  <v-select
                    v-model="dadosFormGeral.local_termino_prestacao.uf"
                    bg-color="white"
                    :items="estadosBrasileiros"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="UF Destino *"
                    density="compact"
                    :rules="rules.campoObrigatorio"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4" class="py-2">
                  <v-select
                    v-model="dadosFormGeral.local_termino_prestacao.cidade"
                    no-data-text="Primeiro selecione uma UF..."
                    bg-color="white"
                    :items="municipiosDoEstadoSelecionado(dadosFormGeral.local_termino_prestacao.uf)"
                    item-value="value"
                    item-title="description"
                    variant="outlined"
                    label="Município Destino *"
                    density="compact"
                    :rules="rules.campoObrigatorio"
                    clearable
                  />
                </v-col>
              </v-row>

              <v-row>
                 <v-col cols="12" md="6" class="py-2">
                  <InputTextMoeda
                    v-model="dadosFormGeral.servico.valor_total"
                    prefix="R$"
                    label="Valor Total do Serviço: *"
                    bg-color="white"
                    :rules="rules.campoObrigatorio"
                  />
                </v-col>
                <v-col cols="12" md="6" class="py-2">
                  <InputTextMoeda
                    v-model="dadosFormGeral.servico.valor_recebido"
                    prefix="R$"
                    label="Valor Recebido do Serviço: *"
                    bg-color="white"
                    :rules="rules.campoObrigatorio"
                  />
                </v-col>
              </v-row>

              <v-row>
                 <v-col md="12" class="py-2">
                    <v-textarea
                      v-model="dadosFormGeral.observacoes_gerais"
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

            <div v-show="stepAtual == 2">
              <v-row>
                <v-col cols="2">
                  <div class="text-body-2 mb-4 px-1">
                    <em>Preencha os Autores</em>
                  </div>

                  <div class="d-flex flex-column ga-2">
                    <v-card title="Remetente" subtitle="Selecionado" prepend-icon="mdi-account-eye" color="redNeveah" variant="flat">
                    </v-card>
                    <v-card title="Destinatário" subtitle="Clique para selecionar" prepend-icon="mdi-account" color="redNeveah" variant="tonal">
                    </v-card>
                    <v-card title="Expedidor" subtitle="Clique para selecionar" prepend-icon="mdi-account" color="redNeveah" variant="tonal">
                    </v-card>
                    <v-card title="Recebedor" subtitle="Clique para selecionar" prepend-icon="mdi-account" color="redNeveah" variant="tonal">
                    </v-card>
                    <v-card title="Tomador" subtitle="Clique para selecionar" prepend-icon="mdi-account" color="redNeveah" variant="tonal">
                    </v-card>
                  </div>
                </v-col>
                <v-col cols="10">

                  <div class="d-flex flex-column ga-2 mb-1">
                    <v-btn
                      class="ms-auto"
                      variant="flat"
                      color="grey-darken-3"
                      rounded="pill"
                      max-width="300"
                      prepend-icon="mdi-sync"
                      :disabled="dadosFormAtores.remetente.cnpj?.length != 14 ? true : false"
                      @click="preencheDadosDoClienteAutomaticamente"
                    >
                      Preenchimento automatico
                    </v-btn>
                    <span class="text-caption text-end">
                      Preencha o CNPJ para ativar essa funcionalidade
                    </span>
                  </div>

                  <v-form ref="formDadosAtores" class="bg-grey-lighten-4 border pa-6 elevation-2" v-show="stepAtual == 2">
                    <v-row class="my-3">
                      <v-col cols="12" md="4" class="py-2">
                        <InputText
                          density="compact"
                          bg-color="white"
                          label="CNPJ"
                          v-model="dadosFormAtores.remetente.cnpj"
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
                          label="Razão Social"
                          v-model="dadosFormAtores.remetente.nome_razao"
                          :rules="rules.campoObrigatorio"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" class="py-2">
                        <v-text-field
                          variant="outlined"
                          density="compact"
                          bg-color="white"
                          label="Inscrição Estadual (IE)"
                          v-model="dadosFormAtores.remetente.ie"
                          :rules="rules.campoObrigatorio"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="my-3">
                      <v-col cols="12" md="2" class="py-2">
                        <InputText
                          density="compact"
                          bg-color="white"
                          label="CEP"
                          v-model="dadosFormAtores.remetente.cep"
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
                          label="Endereço"
                          v-model="dadosFormAtores.remetente.endereco"
                          :rules="rules.campoObrigatorio"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="2" class="py-2">
                        <v-text-field
                          variant="outlined"
                          density="compact"
                          bg-color="white"
                          label="Número"
                          v-model="dadosFormAtores.remetente.endereco"
                          :rules="rules.campoObrigatorio"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" class="py-2">
                        <v-text-field
                          variant="outlined"
                          density="compact"
                          bg-color="white"
                          label="Complemento"
                          v-model="dadosFormAtores.remetente.complemento"
                          :rules="rules.campoObrigatorio"
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
                          label="Bairro"
                          v-model="dadosFormAtores.remetente.bairro"
                          :rules="rules.campoObrigatorio"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="5" class="py-2">
                        <v-text-field
                          variant="outlined"
                          density="compact"
                          bg-color="white"
                          label="Cidade"
                          v-model="dadosFormAtores.remetente.cidade"
                          :rules="rules.campoObrigatorio"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="2" class="py-2">
                         <v-select
                          v-model="dadosFormAtores.remetente.uf"
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
                        <v-text-field
                          variant="outlined"
                          density="compact"
                          bg-color="white"
                          label="Telefone"
                          v-model="dadosFormAtores.remetente.telefone"
                          :rules="rules.campoObrigatorio"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-card class="border pa-4 text-body-2 mt-2" variant="tonal" color="redNeveah">
                      (*) Campos com esta estrela são obrigatórios
                    </v-card>
                  </v-form>
                </v-col>
              </v-row>
            </div>

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
import InputText from '@/components/Form/InputText.vue'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue'
import { estadosBrasileiros } from '@/Enums/estadosEnum'
import { FinalidadeCteEnum } from '@/Enums/Fiscal/FinalidadeCteEnum'
import { ModalidadeEntregaEnum } from '@/Enums/Fiscal/ModalidadeEntregaEnum'
import { NaturezaOperacaoEnum } from '@/Enums/Fiscal/NaturezaOperacaoEnum'
import { TipoDeEmissaoCteEnum } from '@/Enums/Fiscal/TipoDeEmissaoCteEnum'
import ApiService from '@/services/ApiService'
import { useAlertStore } from '@/stores/alertStore'
import { useLoadingStore } from '@/stores/loading'
import { endpoints } from '@/utils/apiEndpoints'

export default {
  name: 'BtnEmiteCte',
  components: {
    InputTextMoeda,
    InputText
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
    // async criaCte() {

    //   const alertStore = useAlertStore()
    //   const loading = useLoadingStore()

    //   const formValidado = await this.validateForm();

    //   if(!formValidado.valid) {
    //     return;
    //   }

    //   const dadosParaEnvio = this.formataDadosParaEnvio();
    //   const url = endpoints.cte.novo;

    //   try {
    //     loading.show('Criando Cte...')
    //     const resposta =  await ApiService({
    //       method: 'post',
    //       url: url,
    //       data: dadosParaEnvio,
    //       headers: {
    //         'Content-Type': 'multipart/form-data', // importante!
    //       },
    //     });

    //     const arrayDeitens = resposta?.data?.data

    //     arrayDeitens.forEach((item) => {
    //       if(item.status == 'erro') {
    //         alertStore.addAlert(item?.mensagem, 'error')
    //         return
    //       }

    //       alertStore.addAlert(`CTE de ID ${item.cte.Id_CTe} Criado`, 'success')
    //       this.$emit('acrescentaODadoNoArrayLocalmente', item.cte)

    //     })
    //     this.limpaCampos()
    //     this.closeDialog()
    //   } finally {
    //     loading.hide()
    //   }
    // }
  }
}
</script>

<style scoped>

.card-selecionavel {
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
  border-radius: 12px;
}
.card-selecionado {
  border-color: #c62828; /* Ou alguma cor de destaque */
  box-shadow: 0 0 10px rgba(198, 40, 40, 0.6);
}
</style>
