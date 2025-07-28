<template>
  <div>
    <v-btn
      color="cyan-darken-3"
      prepend-icon="mdi-file-plus"
      variant="tonal"
      density="compact"
      class="text-white w-100"
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
                :class="[
                  classeBaseDosCards,
                  stepAtual === 1 ? 'elevation-12' : ''
                ]"
                min-width="160"
                :color="stepsValidos['1'] ? 'green' : 'redNeveah'"
                :variant="stepAtual == 1 || stepsValidos['1'] ? 'flat' : 'tonal'"
                @click="avancaOuVoltaStep(1)"
              >
                <v-icon>
                  mdi-tune
                </v-icon>
                GERAL
              </v-card>
            </v-col>

            <v-col>
              <v-card
                :class="[
                  classeBaseDosCards,
                  stepAtual === 2 ? 'elevation-12' : ''
                ]"
                min-width="160"
                :color="stepsValidos['2'] ? 'green' : 'redNeveah'"
                :variant="stepAtual == 2 || stepsValidos['2'] ? 'flat' : 'tonal'"
                @click="avancaOuVoltaStep(2)"
              >
                <v-icon>
                  mdi-account-multiple
                </v-icon>
                ATORES
              </v-card>
            </v-col>

            <v-col>
              <v-card
                :class="[
                  classeBaseDosCards,
                  stepAtual === 3 ? 'elevation-12' : ''
                ]"
                min-width="160"
                :color="stepsValidos['3'] ? 'green' : 'redNeveah'"
                :variant="stepAtual == 3 || stepsValidos['3'] ? 'flat' : 'tonal'"
                @click="avancaOuVoltaStep(3)"
              >
                <v-icon>
                  mdi-truck-trailer
                </v-icon>
                CARGA
              </v-card>
            </v-col>

            <v-col>
              <v-card
                :class="[
                  classeBaseDosCards,
                  stepAtual === 4 ? 'elevation-12' : ''
                ]"
                min-width="160"
                :color="stepsValidos['4'] ? 'green' : 'redNeveah'"
                :variant="stepAtual == 4 || stepsValidos['4'] ? 'flat' : 'tonal'"
                @click="avancaOuVoltaStep(4)"
              >
                <v-icon>
                  mdi-file-document-multiple
                </v-icon>
                DOCUMENTOS
              </v-card>
            </v-col>

            <v-col>
              <v-card
                :class="[
                  classeBaseDosCards,
                  stepAtual === 5 ? 'elevation-12' : ''
                ]"
                min-width="160"
                :color="stepsValidos['5'] ? 'green' : 'redNeveah'"
                :variant="stepAtual == 5 || stepsValidos['5'] ? 'flat' : 'tonal'"
                @click="avancaOuVoltaStep(5)"
              >
                <v-icon>
                  mdi-clipboard-check
                </v-icon>
                RECAPITULAÇÃO
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex">

          <div class="w-100 ma-6">

            <v-fade-transition mode="out-in">
              <template v-if="stepAtual == 1">
                <FormDadosGeral
                  ref="formDadosGeral"
                  :dadosFormGeral="dadosFormGeral"
                  :estadosESeusMunicipios="estadosESeusMunicipios"
                  :valorTotalCalculado="valorTotalCalculado"
                />
              </template>

              <template v-if="stepAtual == 2">
                <div class="mt-6">
                  <v-row>
                    <v-col cols="2">
                      <div class="text-body-2 mb-4 px-1">
                        <em>Preencha os Autores</em>
                      </div>

                      <div class="d-flex flex-column ga-2">
                        <v-card
                          title="Remetente"
                          :subtitle="formAtorAtual == 1 ? 'Selecionado': 'Selecione'"
                          :prepend-icon="formAtorAtual == 1 ? 'mdi-account-eye': 'mdi-account'"
                          color="redNeveah"
                          :variant="formAtorAtual == 1 ? 'flat': 'tonal'"
                          @click="formAtorAtual = 1"
                        >
                          <template #append>
                            <v-fade-transition>
                              <v-icon v-if="verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(dadosFormAtores.remetente)" color="green">
                                mdi-check-circle
                              </v-icon>
                            </v-fade-transition>
                          </template>
                        </v-card>
                        <v-card
                          title="Destinatário"
                          :subtitle="formAtorAtual == 2 ? 'Selecionado': 'Selecione'"
                          :prepend-icon="formAtorAtual == 2 ? 'mdi-account-eye': 'mdi-account'"
                          color="redNeveah"
                          :variant="formAtorAtual == 2 ? 'flat': 'tonal'"
                          @click="formAtorAtual = 2"
                        >
                          <template #append>
                            <v-fade-transition>
                              <v-icon v-if="verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(dadosFormAtores.destinatario)" color="green">
                                mdi-check-circle
                              </v-icon>
                            </v-fade-transition>
                          </template>
                        </v-card>
                        <v-card
                          title="Expedidor"
                          :subtitle="formAtorAtual == 3 ? 'Selecionado': 'Selecione'"
                          :prepend-icon="formAtorAtual == 3 ? 'mdi-account-eye': 'mdi-account'"
                          color="redNeveah"
                          :variant="formAtorAtual == 3 ? 'flat': 'tonal'"
                          @click="formAtorAtual = 3"
                        >
                          <template #append>
                            <v-fade-transition>
                              <v-icon v-if="verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(dadosFormAtores.expedidor) || dadosFormAtoresComplementar.sem_expedidor" color="green">
                                mdi-check-circle
                              </v-icon>
                            </v-fade-transition>
                          </template>
                        </v-card>
                        <v-card
                          title="Recebedor"
                          :subtitle="formAtorAtual == 4 ? 'Selecionado': 'Selecione'"
                          :prepend-icon="formAtorAtual == 4 ? 'mdi-account-eye': 'mdi-account'"
                          color="redNeveah"
                          :variant="formAtorAtual == 4 ? 'flat': 'tonal'"
                          @click="formAtorAtual = 4"
                        >
                          <template #append>
                            <v-fade-transition>
                              <v-icon v-if="verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(dadosFormAtores.recebedor) || dadosFormAtoresComplementar.sem_recebedor" color="green">
                                mdi-check-circle
                              </v-icon>
                            </v-fade-transition>
                          </template>
                        </v-card>
                        <v-card
                          title="Tomador"
                          :subtitle="formAtorAtual == 5 ? 'Selecionado': 'Selecione'"
                          :prepend-icon="formAtorAtual == 5 ? 'mdi-account-eye': 'mdi-account'"
                          color="redNeveah"
                          :variant="formAtorAtual == 5 ? 'flat': 'tonal'"
                          @click="formAtorAtual = 5"
                        >
                          <template #append>
                            <v-fade-transition>
                              <v-icon v-if="verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(dadosFormAtores.tomador) || tomadorPreenchido" color="green">
                                mdi-check-circle
                              </v-icon>
                            </v-fade-transition>
                          </template>
                        </v-card>
                      </div>
                    </v-col>
                    <v-col cols="10">
                      <v-form>
                        <v-fade-transition mode="out-in">
                          <template v-if="formAtorAtual == 1">
                            <FormDadosRemetente
                              ref="formDadosRemetente"
                              :dadosFormAtoresRemetente="dadosFormAtores.remetente"
                            />
                          </template>
                          <template v-if="formAtorAtual == 2">
                            <FormDadosDestinatario
                              ref="formDadosDestinatario"
                              :dadosFormAtoresDestinatario="dadosFormAtores.destinatario"
                            />
                          </template>
                          <template v-if="formAtorAtual == 3">
                            <FormDadosExpedidor
                              ref="formDadosExpedidor"
                              :dadosFormAtoresExpedidor="dadosFormAtores.expedidor"
                              :dadosFormAtoresRemetente="dadosFormAtores.remetente"
                              v-model:expedidorEhIgualRemetente="expedidorEhIgualRemetente"
                              v-model:semExpedidor="dadosFormAtoresComplementar.sem_expedidor"
                              :remetenteTemTodosOsDadosObrigatoriosPreenchidos="verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(dadosFormAtores.remetente)"
                            />
                          </template>
                          <template v-if="formAtorAtual == 4">
                            <FormDadosRecebedor
                              ref="formDadosRecebedor"
                              :dadosFormAtoresRecebedor="dadosFormAtores.recebedor"
                              :dadosFormAtoresDestinatario="dadosFormAtores.destinatario"
                              v-model:recebedorEhIgualDestinatario="recebedorEhIgualDestinatario"
                              v-model:semRecebedor="dadosFormAtoresComplementar.sem_recebedor"
                              :destinatarioTemTodosOsDadosObrigatoriosPreenchidos="verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(dadosFormAtores.destinatario)"
                            />
                          </template>
                          <template v-if="formAtorAtual == 5">
                            <FormDadosTomador
                              ref="formDadosTomador"
                              :dadosFormAtoresTomador="dadosFormAtores.tomador"
                              v-model:tomadorEhIgualRemetente="tomadorEhIgualRemetente"
                              v-model:tomadorEhIgualDestinatario="tomadorEhIgualDestinatario"
                              v-model:tomadorEhIgualRecebedor="tomadorEhIgualRecebedor"
                              v-model:tomadorEhIgualExpedidor="tomadorEhIgualExpedidor"
                              v-model:contribuicaoTomador="dadosFormAtoresComplementar.contribuicao_tomador"
                              v-model:tomadorPreenchido="tomadorPreenchido"
                            />
                          </template>
                        </v-fade-transition>


                        <v-sheet
                          class="d-flex align-center px-4 mt-8 w-100"
                          max-width="750"
                          rounded="lg"
                          @click="progressoDoPreenchimentoDosAtores() "
                        >
                          <v-fade-transition>
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
                              :model-value="progressoDoPreenchimentoDosAtores()"
                              rounded
                            ></v-progress-linear>
                          </v-fade-transition>
                          <div class="d-flex w-100 align-center">
                            <div class="ms-4 text-h6">{{progressoDoPreenchimentoDosAtores()}}/5</div>
                            <div class="ms-4 text-body-2">(Formulários corretamente Preenchidos)</div>
                            <v-icon class="ms-2">
                              mdi-check
                            </v-icon>
                          </div>
                        </v-sheet>
                      </v-form>
                    </v-col>
                  </v-row>
                </div>
              </template>

              <template v-if="stepAtual == 3">
                <FormDadosCarga
                  ref="formDadosCarga"
                  :dadosFormCarga="dadosFormCarga"
                />
              </template>

              <template v-if="stepAtual == 4">
                <FormDadosDocumentos
                  ref="formDadosDocumento"
                  :dadosFormDocumento="dadosFormDocumento"
                />
              </template>

              <template v-if="stepAtual == 5">
                <RecapitulacaoDados
                  ref="recapitulacaoDados"
                  :dadosFormGeral="dadosFormGeral"
                  :dadosFormAtores="dadosFormAtores"
                  :dadosFormCarga="dadosFormCarga"
                  :dadosFormDocumento="dadosFormDocumento"
                  :semExpedidor="dadosFormAtoresComplementar.sem_expedidor"
                  :semRecebedor="dadosFormAtoresComplementar.sem_recebedor"
                  :tomadorEhIgualRemetente="tomadorEhIgualRemetente"
                  :tomadorEhIgualDestinatario="tomadorEhIgualDestinatario"
                  :tomadorEhIgualRecebedor="tomadorEhIgualRecebedor"
                  :tomadorEhIgualExpedidor="tomadorEhIgualExpedidor"
                />
              </template>
            </v-fade-transition>

            <!-- {{ dadosFormGeral }}
            {{ dadosFormAtores }}
            {{ dadosFormAtoresComplementar }}
            {{ dadosFormCarga }}
            {{ dadosFormDocumento }}

            <v-btn @click="formataDadosParaEnvio">
              teste
            </v-btn> -->

            <div class="d-flex justify-end mt-2">
              <v-btn v-if="stepAtual != 5" variant="text" append-icon="mdi-chevron-right"  @click="avancaOuVoltaStep(stepAtual + 1)" color="grey-darken-2">
                Avançar
              </v-btn>
              <v-btn v-if="stepAtual == 5" variant="flat" @click="emiteCte" color="grey-darken-3" size="large">
                EMITIR
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
import { NaturezaOperacaoDescricao, NaturezaOperacaoEnum } from '@/Enums/Fiscal/NaturezaOperacaoEnum'
import { TipoDeEmissaoCteEnum } from '@/Enums/Fiscal/TipoDeEmissaoCteEnum'
import ApiService from '@/services/ApiService'
import { useAlertStore } from '@/stores/alertStore'
import { useLoadingStore } from '@/stores/loading'
import { endpoints } from '@/utils/apiEndpoints'
import FormDadosGeral from './Forms/FormDadosGeral.vue'
import FormDadosRemetente from './Forms/FormDeAtores/FormDadosRemetente.vue'
import FormDadosDestinatario from './Forms/FormDeAtores/FormDadosDestinatario.vue'
import FormDadosExpedidor from './Forms/FormDeAtores/FormDadosExpedidor.vue'
import FormDadosRecebedor from './Forms/FormDeAtores/FormDadosRecebedor.vue'
import FormDadosTomador from './Forms/FormDeAtores/FormDadosTomador.vue'
import FormDadosCarga from './Forms/FormDadosCarga.vue'
import FormDadosDocumentos from './Forms/FormDadosDocumento.vue'
import RecapitulacaoDados from './Forms/RecapitulacaoDados.vue'
import { limparCamposVazios } from '@/helpers/limpaCamposVazio'
import { IndicadorTomadorEnumDescricao } from '@/Enums/Fiscal/IndicadorTomadorEnum'

export default {
  name: 'BtnEmiteCte',
  components: {
    FormDadosGeral,
    FormDadosRemetente,
    FormDadosDestinatario,
    FormDadosExpedidor,
    FormDadosRecebedor,
    FormDadosTomador,
    FormDadosCarga,
    FormDadosDocumentos,
    RecapitulacaoDados
  },
  watch: {
    'dadosFormGeral.local_inicio_prestacao.uf'(newValue, oldValue) {
      if(newValue != oldValue) {
        this.dadosFormGeral.local_inicio_prestacao.cidade = null
      }
    },
    'dadosFormGeral.local_termino_prestacao.uf'(newValue, oldValue) {
      if(newValue != oldValue) {
        this.dadosFormGeral.local_termino_prestacao.cidade = null
      }
    },
  },
  computed: {
    valorTotalCalculado() {
      const fretePeso = parseFloat(this.dadosFormGeral?.servico?.componentes?.FRETE_PESO)
      const advalorem = parseFloat(this.dadosFormGeral?.servico?.componentes?.advalorem)

      if(!fretePeso || !advalorem) {
        return null
      }

      const valorTotal = fretePeso + advalorem

      return valorTotal
    },
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
        2: '', //Nao uso esse valor aqui pois valido de outra forma
        3: 'formDadosCarga',
        4: 'formDadosDocumento',
        5: 'recapitulacaoDados',
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
        cfop: '5353',
        classificacao_tributaria: 'SN',
        natureza_operacao:  null,
        rntrc: '57174199',
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
        destinatario: {
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
        tomador: {
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
        expedidor: {
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
        recebedor: {
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
      },
      dadosFormAtoresComplementar: {
        contribuicao_tomador: 1,
        sem_expedidor: true,
        sem_recebedor: true,
      },
      dadosFormCarga: {
        valor_total: null,
        valor_averbacao: null,
        produto_predominante: null,
        caracteristicas: null, //Exemplos: Fria, Granel ou Refrigerada
        quantidades: []
      },
      dadosFormDocumento: [],

      camposObrigatoriosDosAtores: [
        'nome_razao',
        'cnpj',
        'endereco',
        'numero',
        'bairro',
        'cep',
        'cidade',
        'uf',
      ],

      estadosESeusMunicipios: {},

      stepAtual: 1,
      formAtorAtual: 1,
      expedidorEhIgualRemetente: false,
      recebedorEhIgualDestinatario: false,

      tomadorEhIgualRemetente: true,
      tomadorEhIgualDestinatario: false,
      tomadorEhIgualRecebedor: false,
      tomadorEhIgualExpedidor: false,
      tomadorPreenchido: true,

      classeBaseDosCards: 'd-flex flex-column justify-center align-center ga-2 pa-2'
    }
  },
  methods: {

    async emiteCte() {
      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      const dadosParaEnvio = this.formataDadosParaEnvio();

      const url = endpoints.cte.emite;

      try {
        loading.show('Emitindo CT-e...')
        const resposta =  await ApiService({
          method: 'post',
          url: url,
          data: dadosParaEnvio
        });

        alertStore.addAlert(resposta?.data.message, 'success')

        // this.limpaCampos()
        // this.closeDialog()

      } catch (erro) {
        alertStore.addAlert(erro.response?.data?.message, 'error')
      } finally {
        loading.hide()
      }
    },

    formataDadosParaEnvio() {
      const textoNaturezaOperacao = this.limitarTamanhoTextoParaNaturezaOperacao(NaturezaOperacaoDescricao[this.dadosFormGeral.cfop])
      const fretePeso = parseFloat(this.dadosFormGeral?.servico?.componentes?.FRETE_PESO)
      const advalorem = parseFloat(this.dadosFormGeral?.servico?.componentes?.advalorem)

      let valorTotal = fretePeso + advalorem

      if(!fretePeso || !advalorem) {
        valorTotal = 0
      }

      const dados = {
        ambiente: 2,
        natureza_operacao: textoNaturezaOperacao,
        modalidade: Number(this.dadosFormGeral?.modalidade.value),
        modelo: "cte",
        finalidade: this.dadosFormGeral?.finalidade?.value,
        local_inicio_prestacao: {...this.dadosFormGeral?.local_inicio_prestacao},
        local_termino_prestacao: {...this.dadosFormGeral?.local_termino_prestacao},
        contribuicao_tomador: this.dadosFormAtoresComplementar?.contribuicao_tomador,
        indicador_tomador: this.defineIndicadorTomador(),
        impostos: {
          cfop: this.dadosFormGeral.cfop,
          classificacao_tributaria: this.dadosFormGeral.classificacao_tributaria,
        },
        servico: {
          ...this.dadosFormGeral?.servico,
          valor_total: valorTotal,
          valor_recebido: valorTotal
        },
        valores_servico: {
          valor_total: valorTotal,
          valor_recebido: valorTotal
        },
        carga: {
          ...this.dadosFormCarga,
        },
        documentos_fiscais:[...this.dadosFormDocumento],
        rodoviario: {
          rntrc: this.dadosFormGeral.rntrc
        },
        remetente: {...this.dadosFormAtores.remetente},
        destinatario: {...this.dadosFormAtores.destinatario},
        recebedor: {...this.dadosFormAtores.recebedor},
        expedidor: {...this.dadosFormAtores.expedidor},
        tomador: this.defineDadosTomador(),
      }



      const dadosTratados = limparCamposVazios(dados)
      console.log(dadosTratados);

      return dadosTratados
    },

    limpaCampos() {

      this.dadosFormGeral = {
        cfop: '5353',
        classificacao_tributaria: 'SN',
        natureza_operacao:  null,
        rntrc: '57174199',
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
      }
      // dadosFormAtores
      this.dadosFormAtores = {
        remetente: {
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
        destinatario: {
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
        tomador: {
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
        expedidor: {
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
        recebedor: {
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
        }
      }
      this.dadosFormAtoresComplementar = {
        contribuicao_tomador: 1,
        sem_expedidor: true,
        sem_recebedor: true,
      }
      this.dadosFormCarga = {
        valor_total: null,
        valor_averbacao: null,
        produto_predominante: null,
        caracteristicas: null, //Exemplos: Fria, Granel ou Refrigerada
        quantidades: []
      }
      this.dadosFormDocumento = []

      this.stepAtual = 1
      this.formAtorAtual = 1
      this.expedidorEhIgualRemetente = false
      this.recebedorEhIgualDestinatario = false

      this.tomadorEhIgualRemetente = true
      this.tomadorEhIgualDestinatario = false
      this.tomadorEhIgualRecebedor = false
      this.tomadorEhIgualExpedidor = false
      this.tomadorPreenchido = true
    },

    defineIndicadorTomador() {
      if(this.tomadorEhIgualRemetente) {
        return IndicadorTomadorEnumDescricao.REMETENTE
      }
      if(this.tomadorEhIgualDestinatario) {
        return IndicadorTomadorEnumDescricao.DESTINATARIO
      }
      if(this.tomadorEhIgualRecebedor) {
        return IndicadorTomadorEnumDescricao.RECEBEDOR
      }
      if(this.tomadorEhIgualExpedidor) {
        return IndicadorTomadorEnumDescricao.EXPEDIDOR
      }

      return IndicadorTomadorEnumDescricao.OUTROS
    },

    defineDadosTomador() {
      if(this.tomadorEhIgualRemetente) {
        return {...this.dadosFormAtores.remetente}
      }
      if(this.tomadorEhIgualDestinatario) {
        return {...this.dadosFormAtores.destinatario}
      }
      if(this.tomadorEhIgualRecebedor) {
        return {...this.dadosFormAtores.recebedor}
      }
      if(this.tomadorEhIgualExpedidor) {
        return {...this.dadosFormAtores.expedidor}
      }
      return  {...this.dadosFormAtores.tomador}
    },

    limitarTamanhoTextoParaNaturezaOperacao(texto) {
      if (!texto) return "";
      return texto.length > 60 ? texto.slice(0, 60) : texto;
    },

    progressoDoPreenchimentoDosAtores() {
      let numero = 0

      const {
        expedidorNaoDeveSerPreenchido,
        recebedorNaoDeveSerPreenchido
      } = this.verificaSeOExpedidorOuRecebedorNaoDeveSerPreenchido()

      for (const dadosForm in this.dadosFormAtores) {

        if(dadosForm == 'expedidor' && expedidorNaoDeveSerPreenchido) {
          numero += 1
          continue
        }

        if(dadosForm == 'recebedor' && recebedorNaoDeveSerPreenchido) {
          numero += 1
          continue
        }

        if(dadosForm == 'tomador' && this.tomadorPreenchido) {
          numero += 1
          continue
        }

        if(this.verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(this.dadosFormAtores[dadosForm])) {
          numero += 1
        }
      }
      return numero
    },

    verificaSeOExpedidorOuRecebedorNaoDeveSerPreenchido() {
      let expedidorNaoDeveSerPreenchido = false
      let recebedorNaoDeveSerPreenchido = false

      for (const dadoComplementar in this.dadosFormAtoresComplementar) {
        if(dadoComplementar == 'contibuicao_tomador') continue

        if(dadoComplementar == 'sem_expedidor' && this.dadosFormAtoresComplementar[dadoComplementar]) {
          expedidorNaoDeveSerPreenchido = true
        }
        if(dadoComplementar == 'sem_recebedor' && this.dadosFormAtoresComplementar[dadoComplementar]) {
          recebedorNaoDeveSerPreenchido = true
        }
      }

      return {
        expedidorNaoDeveSerPreenchido: expedidorNaoDeveSerPreenchido,
        recebedorNaoDeveSerPreenchido: recebedorNaoDeveSerPreenchido,
      }
    },

    verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(dadosAtor) {
      let atorTemTodosOsCamposObrigatoriosPreenchidos = true

      for (const campo in dadosAtor) {
        if(!this.camposObrigatoriosDosAtores.includes(campo)) {
          continue
        }

        if(dadosAtor[campo] == null || dadosAtor[campo] == undefined || dadosAtor[campo] == '') {
          atorTemTodosOsCamposObrigatoriosPreenchidos = false
        }
      }

      return atorTemTodosOsCamposObrigatoriosPreenchidos
    },

    async avancaOuVoltaStep(novoStep) {
      if (novoStep >= this.stepAtual + 1 || !this.stepsValidos[novoStep]) {
        this.avancaStepSeEstiverTudoOkay(novoStep)
        return
      }

      this.stepAtual = novoStep;
    },

    async avancaStepSeEstiverTudoOkay(novoStep) {
      const alertStore = useAlertStore()

      if (novoStep == 3) {
        const valid = await this.validaFormularioDeAtores()
        if (!valid) {
          alertStore.addAlert('Formulário possui campos incorretos', 'warning')
          return; // early return se o step atual não for válido
        }
      }

      if(novoStep != 3) {
        let formRefAtual = this.refsForms[this.stepAtual];
        let form = this.$refs[formRefAtual];
        if (!form) return;

        const { valid } = await form.validate();
        if (!valid) {
          alertStore.addAlert('Formulário possui campos incorretos', 'warning')
          return; // early return se o step atual não for válido
        }
      }

      const regrasDeEmissao = this.validaRegrasParaEmissao(alertStore)

      if(!regrasDeEmissao) return

      // Marca como válido o step atual
      this.stepsValidos[this.stepAtual] = true;

      this.stepAtual = novoStep;
    },

    validaRegrasParaEmissao(alertStore) {

      const UFlocalInicioEUFLocalTerminoSaoDiferentes = this.dadosFormGeral.local_inicio_prestacao.uf != this.dadosFormGeral.local_termino_prestacao.uf

      // FORM GERAL
      if(this.dadosFormGeral.cfop == '5353' && UFlocalInicioEUFLocalTerminoSaoDiferentes) {
        alertStore.addAlert('CFOP (5353) Não permite que A UF da Origem e UF do Destino sejam diferentes', 'warning')
        return false
      }

      // FORM CARGA
      if(this.dadosFormCarga.quantidades.length == 0 && this.stepAtual == 3) {
        alertStore.addAlert('Adicione pelo menos uma Quantidade para Carga', 'warning')
        return
      }

      // FORM DOCUMENTOS
      if(this.dadosFormDocumento.length == 0 && this.stepAtual == 4) {
        alertStore.addAlert('Vincule pelo menos uma Documento ao CT-e', 'warning')
        return
      }

      return true
    },

    async validaFormularioDeAtores() {

      const remetenteValid = this.verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(this.dadosFormAtores.remetente);
      const destinatarioValid = this.verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(this.dadosFormAtores.destinatario);
      const recebedorValid = this.verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(this.dadosFormAtores.recebedor) || this.dadosFormAtoresComplementar.sem_recebedor
      const expedidorValid = this.verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(this.dadosFormAtores.expedidor) || this.dadosFormAtoresComplementar.sem_expedidor
      const tomadorValid = this.verificaSeOsCamposObrigatoriosDoAtorEstaoPreenchidos(this.dadosFormAtores.tomador) || this.tomadorPreenchido;

      if(!remetenteValid
        || !destinatarioValid
        || !recebedorValid
        || !expedidorValid
        || !tomadorValid
      ) {
        return false;
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

      const alertStore = useAlertStore();
      const loadingStore = useLoadingStore();

      try {
        loadingStore.show('Buscando Municípios...');
        await this.buscaEstadosESeusMunicipios()
      } catch {
        alertStore.addAlert('Erro ao Carregar Municípios', 'error')
      } finally {
        this.dialogIsOpen = true
        loadingStore.hide();
      }
    },
  }
}
</script>
