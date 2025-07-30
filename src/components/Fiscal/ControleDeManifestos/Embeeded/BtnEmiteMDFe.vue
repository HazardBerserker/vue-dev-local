<template>
  <div>
    <v-btn
      color="purple-darken-3"
      prepend-icon="mdi-file-plus"
      variant="tonal"
      density="compact"
      class="text-white w-100"
      rounded="pill"
      @click="openDialog"
    >
      Emitir MDFe
    </v-btn>

    <v-dialog v-model="dialogIsOpen" transition="dialog-bottom-transition" ref="dialogEmite" fullscreen>
      <v-card>
      <v-toolbar color="redNeveah">
        <v-btn
          icon="mdi-close"
          @click="dialogIsOpen = false"
        ></v-btn>

        <v-toolbar-title>Emitir MDF-e</v-toolbar-title>

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
                    CARGA
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
                    RODOVIÁRIO
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
              <div class="w-100 my-6 mx-3">
                <v-fade-transition mode="out-in">
                  <template v-if="stepAtual == 1">
                    <FormDadosCarga
                      ref="formDadosCarga"
                      :dadosFormCarga="dadosFormCarga"
                      v-model:totalDeCtesVinculados="dadosFormCargaAuxiliar.totalDeCtesVinculados"
                      :estadosESeusMunicipios="estadosESeusMunicipios"
                    />
                  </template>
                  <template v-if="stepAtual == 2">
                     <FormDadosRodoviario
                      ref="formDadosRodoviario"
                      :tipoTransportador="dadosFormCarga.transportador"
                      :dadosFormRodoviario="dadosFormCarga.rodoviario"
                      :estadosESeusMunicipios="estadosESeusMunicipios"
                      v-model:totalDeCtesVinculados="dadosFormCargaAuxiliar.totalDeCtesVinculados"
                    />
                  </template>
                  <template v-if="stepAtual == 3">
                    <RecapitulacaoDados
                      :dadosFormCarga="dadosFormCarga"
                    />
                  </template>
                </v-fade-transition>
                <!-- <v-btn @click="formataDadosParaEnvio">
                  teste
                </v-btn> -->
                <div class="d-flex justify-end mt-2">
                  <!-- <v-btn @click="stepAtual = 1">
                    step 1
                  </v-btn>
                  <v-btn @click="stepAtual = 2">
                    step 2
                  </v-btn>
                  <v-btn @click="stepAtual = 3">
                    step 3
                  </v-btn> -->
                  <v-btn v-if="stepAtual != 3" variant="text" append-icon="mdi-chevron-right"  @click="avancaOuVoltaStep(stepAtual + 1)" color="grey-darken-2">
                    Avançar
                  </v-btn>
                  <v-btn v-if="stepAtual == 3" variant="flat" @click="emiteMdfe" color="grey-darken-3" size="large">
                    EMITIR
                  </v-btn>
                </div>
                <!-- {{ limparCamposVazios(dadosFormCarga) }} -->
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
import ApiService from '@/services/ApiService'
import { useAlertStore } from '@/stores/alertStore'
import { useLoadingStore } from '@/stores/loading'
import { endpoints } from '@/utils/apiEndpoints'
import { limparCamposVazios } from '@/helpers/limpaCamposVazio'
import FormDadosCarga from './Forms/FormDadosCarga.vue'
import FormDadosRodoviario from './Forms/FormDadosRodoviario.vue'
import RecapitulacaoDados from './Forms/RecapitulacaoDados.vue'
import { FormaPagamentoMdfeEnumValorDescricao } from '@/Enums/Fiscal/FormaPagamentoMdfeEnum'
import { formataDataISOParaPadraoBanco } from '@/utils/masks'

export default {
  name: 'BtnEmiteMDFe',
  components: {
    FormDadosCarga,
    FormDadosRodoviario,
    RecapitulacaoDados
  },
  data() {
    return {
      limparCamposVazios,

      stepsValidos: {
        1: false,
        2: false,
      },

      refsForms: {
        1: 'formDadosCarga',
        2: 'formDadosRodoviario',
      },
      // enums
      estadosBrasileiros,

      dialogIsOpen: false,

      dadosFormCarga: {
        emitente: 1,
        modalidade: '1',
        transportador: 2,
        uf_carregamento: null,
        uf_descarregamento: null,
        percurso: [],
        valor_carga: null,
        unidade: '01',
        peso_bruto: null,
        carregamento: [],
        descarregamento: [],
        produto_predominante: {
          tipo_carga: '05',
          nome: null,
          ncm: null,
          lotacao: {
            carregamento: {},
            descarregamento: {}
          },
        },
        seguro: [
          {
            responsavel: {
              tipo_responsavel: 1,
              cnpj: null
            },
            seguradora: {
              nome_seguradora: 'Porto Seguro',
              cnpj: 61198164000160
            },
            numero_apolice: '4250126501',
            numero_averbacao: ['0']
          },
        ],
        rodoviario: {
          rntrc: '57174199',
          veiculo_tracao: {
            placa: null,
            tara: null,
            uf_licenciamento: null,
            tipo_rodado: null,
            tipo_carroceria: null,
            proprietario: {}
          },
          condutor: [],
          contratante: [
            {
              cnpj: "55963693000100"
            }
          ],
          pagamento_frete: [
            {
              cpf: null,
              nome: null,
              valor_contrato: null,
              forma_pagamento: null,
              valor_adiantamento: null,
              componentes_pagamento_frete: [],
              informacoes_bancarias: {
                tipo_informacao_bancaria: null,
                numero_banco: null,
                numero_agencia:null
              },
              informacoes_pagamento_prazo: [
                {
                  data_vencimento_parcela: null,
                  valor_parcela: null
                }
              ]
            }
          ]
        }
      },

      dadosFormCargaAuxiliar: {
        totalDeCtesVinculados: 0
      },

      estadosESeusMunicipios: {},
      stepAtual: 1,

      classeBaseDosCards: 'd-flex flex-column justify-center align-center ga-2 pa-2'
    }
  },
  methods: {

    async emiteMdfe() {
      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      const valido = this.regrasDeValidacaoExtrasParaEmissao()

      if(!valido.value) {
        alertStore.addAlert(valido.message, 'warning')
        return
      }

      const dadosParaEnvio = this.formataDadosParaEnvio();

      const url = endpoints.mdfe.emite;

      try {
        loading.show('Emitindo MDF-e...')
        const resposta =  await ApiService({
          method: 'post',
          url: url,
          data: dadosParaEnvio
        });

        alertStore.addAlert(resposta?.data.message, 'success')

        this.limpaCampos()
        this.closeDialog()

      } catch (erro) {
        alertStore.addAlert(erro.response?.data?.message, 'error')
      } finally {
        loading.hide()
      }
    },

    regrasDeValidacaoExtrasParaEmissao() {
      let valido = {
        value: true,
        message: ''
      }

      const valorParcela = this.dadosFormCarga.rodoviario.pagamento_frete[0].informacoes_pagamento_prazo[0].valor_parcela
      const valorContrato = this.dadosFormCarga.rodoviario.pagamento_frete[0].valor_contrato
      const valorAdiantamento = this.dadosFormCarga.rodoviario.pagamento_frete[0].valor_adiantamento
      const formaPagamento = this.dadosFormCarga.rodoviario.pagamento_frete[0].forma_pagamento

      if( formaPagamento == FormaPagamentoMdfeEnumValorDescricao.A_PRAZO && valorParcela + valorAdiantamento != valorContrato) {
        valido.value = false
        valido.message = 'O Valor do Adiantamento e Saldo somados deve ser igual ao Valor do Contrato'
        return valido
      }

      return valido

    },

    formataDadosParaEnvio() {

      const carregamentoFormatado = this.dadosFormCarga.carregamento.map(item => ({
        codigo_municipio: item.codigo_municipio,
        nome_municipio: item.description
      }))

      const descarregamentoFormatado = this.dadosFormCarga.descarregamento.map(item => ({
        codigo_municipio: item.codigo_municipio,
        nome_municipio: item.nome_municipio,
        documentos_fiscais: this.formataDocumentosFiscaisParaEnvio(item.documentos_fiscais)
      }))

      const dataVencimentoParcela = this.dadosFormCarga.rodoviario.pagamento_frete[0].informacoes_pagamento_prazo[0].data_vencimento_parcela

      if(dataVencimentoParcela) {
        formataDataISOParaPadraoBanco(dataVencimentoParcela)
      }

      const dados = {
        ambiente: 2,
        emitente: this.dadosFormCarga.emitente,
        transportador: this.dadosFormCarga.transportador,
        modalidade: this.dadosFormCarga.modalidade,
        uf_carregamento: this.dadosFormCarga.uf_carregamento,
        uf_descarregamento: this.dadosFormCarga.uf_descarregamento,
        valor_carga: this.dadosFormCarga.valor_carga,
        unidade: this.dadosFormCarga.unidade,
        peso_bruto: this.dadosFormCarga.peso_bruto,
        carregamento: carregamentoFormatado,
        descarregamento: descarregamentoFormatado,
        percurso: this.dadosFormCarga.percurso,
        produto_predominante: {...this.dadosFormCarga.produto_predominante},
        seguro: this.dadosFormCarga.seguro,
        rodoviario: {...this.dadosFormCarga.rodoviario}
      }

      dados.rodoviario.pagamento_frete[0].informacoes_pagamento_prazo[0].data_vencimento_parcela = dataVencimentoParcela

      const dadosTratados = limparCamposVazios(dados)

      return dadosTratados
    },

    limpaCampos() {
      this.stepsValidos = {
        1: false,
        2: false,
      }

      this.dadosFormCarga = {
        emitente: 1,
        modalidade: '1',
        transportador: 2,
        uf_carregamento: null,
        uf_descarregamento: null,
        percurso: [],
        valor_carga: null,
        unidade: '01',
        peso_bruto: null,
        carregamento: [],
        descarregamento: [],
        produto_predominante: {
          tipo_carga: '05',
          nome: null,
          ncm: null,
          lotacao: {
            carregamento: {},
            descarregamento: {}
          },
        },
        seguro: [
          {
            responsavel: {
              tipo_responsavel: 1,
              cnpj: null
            },
            seguradora: {
              nome_seguradora: 'Porto Seguro',
              cnpj: 61198164000160
            },
            numero_apolice: '4250126501',
            numero_averbacao: ['0']
          },
        ],
        rodoviario: {
          rntrc: '57174199',
          veiculo_tracao: {
            placa: null,
            tara: null,
            uf_licenciamento: null,
            tipo_rodado: null,
            tipo_carroceria: null,
            proprietario: {}
          },
          condutor: [],
          contratante: [
            {
              cnpj: "55963693000100"
            }
          ],
          pagamento_frete: [
            {
              cpf: null,
              nome: null,
              valor_contrato: null,
              forma_pagamento: null,
              valor_adiantamento: null,
              componentes_pagamento_frete: [],
              informacoes_bancarias: {
                tipo_informacao_bancaria: null,
                numero_banco: null,
                numero_agencia:null
              },
              informacoes_pagamento_prazo: [
                {
                  data_vencimento_parcela: null,
                  valor_parcela: null
                }
              ]
            }
          ]
        }
      }

      this.dadosFormCargaAuxiliar = {
        totalDeCtesVinculados: 0
      }

      this.estadosESeusMunicipios ={}
      this.stepAtual = 1
    },

    formataDocumentosFiscaisParaEnvio(documentos_fiscais) {
      const documentosFormatados = documentos_fiscais.map(item => ({
        chave: item.chCTe
      }))
      return documentosFormatados
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

      let formRefAtual = this.refsForms[this.stepAtual];
      let form = this.$refs[formRefAtual];
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

      this.stepAtual = novoStep;
    },

    validaRegrasParaEmissao(alertStore) {

      // FORM GERAL
      if(this.totalDeCtesVinculados == 0) {
        alertStore.addAlert('Nenhum CT-e encontrado, vincule pelo menos um', 'warning')
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
