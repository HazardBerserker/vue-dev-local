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

          <div class="w-100 ma-6">

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
                  ref="formDadosGeral"
                  :tipoTransportador="dadosFormCarga.transportador"
                  :dadosFormRodoviario="dadosFormCarga.rodoviario"
                  :estadosESeusMunicipios="estadosESeusMunicipios"
                  v-model:totalDeCtesVinculados="dadosFormCargaAuxiliar.totalDeCtesVinculados"
                />
              </template>

              <!-- <template v-if="stepAtual == 3">
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
              </template> -->
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
import { limparCamposVazios } from '@/helpers/limpaCamposVazio'
import FormDadosCarga from './Forms/FormDadosCarga.vue'
import FormDadosRodoviario from './Forms/FormDadosRodoviario.vue'

export default {
  name: 'BtnEmiteMDFe',
  components: {
    FormDadosCarga,
    FormDadosRodoviario
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

    // municipiosDoPercurso() {

    //   const uf_carregamento = this.dadosFormCarga?.uf_carregamento
    //   const uf_descarregamento = this.dadosFormCarga?.uf_descarregamento

    //   const municipiosDaUfDeCarregamento = this.municipiosDoEstadoSelecionado(uf_carregamento)
    //   const municipiosDaUfDeDescarregamento = this.municipiosDoEstadoSelecionado(uf_descarregamento)

    //   if (!uf_carregamento && !uf_descarregamento) {
    //     return []
    //   }

    //   const listaMunicipios = []

    //   if (uf_carregamento) {
    //     listaMunicipios.push(...municipiosDaUfDeCarregamento)
    //   }

    //   if (uf_descarregamento) {
    //     listaMunicipios.push(...municipiosDaUfDeDescarregamento)
    //   }

    //   return listaMunicipios
    // },
  },
  data() {
    return {

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
      TipoDeEmissaoCteEnum,
      FinalidadeCteEnum,
      NaturezaOperacaoEnum,
      ModalidadeEntregaEnum,

      dialogIsOpen: false,

      dadosFormCarga: {
        emitente: 1,
        modalidade: '1',
        transportador: null,
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
            numero_apolice: 4250126501,
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
              forma_pagamento: 0,
              valor_adiantamento: null,
              componentes_pagamento_frete: [],
              informacoes_bancarias: {
                tipo_informacao_bancaria: '3',
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

        console.log(resposta);

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

      return dadosTratados
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
