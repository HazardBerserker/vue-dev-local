<template>
  <v-card
    class="bg-grey-ligthen-4 elevation-1 border mt-4"
    title="CT-es vinculados"
    subtitle="Este(s) Ct-e(s) popularão o Manifesto"
  >
    <template #prepend>
      <v-icon class="px-4 pe-6">
        mdi-note
      </v-icon>
    </template>

    <div class="text-center ps-2 pe-6 mb-6">
      <v-btn block color="redNeveah" class="ma-2 rounded-pill" @click="abreDialog">
        Vincular
      </v-btn>

      <v-dialog
        v-model="dialogVinculaCte"
        width="auto"
        persistent
      >
        <v-card
          color="redNeveah"
          width="600"
          prepend-icon="mdi-sync"
          text="Complete os passos para vincular o(s) CT-e(s)."
          title="Vincular CT-e(s)"
        >

          <v-stepper v-model="stepAtual" hide-actions>

            <v-stepper-header>
              <template v-for="step, index in steps" :key="`${index}-step`">
                <v-stepper-item
                  :complete="index + 1 < stepAtual"
                  :step="step"
                  :value="index + 1"
                >
                  {{ step }}
                </v-stepper-item>

                <v-divider
                  v-if="index + 1 !== steps.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-window>
              <v-stepper-window-item
                :value="1"
              >
                <v-card flat>
                  <div class="d-flex justify-space-between align-center text-caption mb-8">
                    <div>Escolha os CT-es que serão vinculados</div>
                    <div class="text-end text-grey-lighten" v-if="listaDeCtesAdicionados.length == 0"><em>Nenhum vinculado</em></div>
                    <div class="d-flex ga-1 text-end text-grey-lighten" v-else>
                      <small>
                        <v-chip size="x-small" color="redNeveah">
                          {{listaDeCtesAdicionados.length}}
                        </v-chip>
                      </small>
                      <div>CT-e(s) adicionados</div>
                    </div>
                  </div>

                  <v-combobox
                    :loading="comboBoxCteLoading"
                    @keyup="(event) => {
                      const tecla = event.key
                      const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                      if (teclaValida) buscaCtes()
                    }"
                    v-model="cteSelecionadoNoInput"
                    density="compact"
                    variant="outlined"
                    bg-color="white"
                    label="ID do CT-e:"
                    placeholder="Comece a digitar..."
                    :items="listaDeCtesDoCombobox"
                    item-title="Id_CTe"
                    class="w-100"
                    hide-selected
                    hide-details
                    clearable
                  />

                  <v-btn class="d-flex mt-2 mb-6 ms-auto" variant="flat" @click="adicionarNovoCteALista">
                    Adicionar
                  </v-btn>

                  <v-card variant="flat" max-height="110" class="overflow-y-auto">
                    <TransitionGroup name="list" tag="div">
                      <v-row dense>
                        <v-col
                          cols="12"
                          class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
                          v-for="cte, index in listaDeCtesAdicionados" :key="`cte-${index}`"
                        >
                          <v-card class="px-2 bg-red-lighten-4 text-redNeveah pa-2" style="border: 1px solid #ba1614;">
                            <div class="d-flex align-center text-body-2">
                              <div class="d-flex flex-column w-100 ga-2">
                                <small class="w-100 text-body-2">ID: <strong>{{ cte.Id_CTe}}</strong></small>
                                <small class="w-100">Chave: <strong>{{cte.chCTe}}</strong></small>
                              </div>
                              <v-btn icon="mdi-close" size="x-small" variant="tonal" @click="removeCteDaLista(index)"/>
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </TransitionGroup>
                  </v-card>
                </v-card>
              </v-stepper-window-item>

              <v-stepper-window-item
                :value="2"
              >
                <v-card flat>
                  <div class="text-caption mb-8">Selecione o CT-e que será carregado <strong>PRIMEIRO</strong></div>

                  <v-card variant="flat" max-height="200" class="overflow-y-auto">
                    <v-row dense>
                      <v-col
                        cols="12"
                        class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
                        v-for="cte, index in listaDeCtesAdicionados" :key="`cte-${index}`"
                      >
                        <v-card
                          :class="
                            cte.Id_CTe == idDoPrimeiroCteASerCarregado
                            ? 'px-2 bg-green-lighten-4 text-green-darken-3 pa-2'
                            : 'px-2 bg-red-lighten-4 text-redNeveah pa-2'

                          "
                          :style="
                            cte.Id_CTe == idDoPrimeiroCteASerCarregado
                            ? `border: 1px solid green;`
                            : `border: 1px solid #ba1614;`
                          "
                          @click="selecionaidDoPrimeiroCteASerCarregado(cte.Id_CTe)"
                        >
                          <div class="d-flex align-center text-body-2">
                            <div class="d-flex flex-column w-100 ga-2">
                              <small class="w-100 text-body-2">ID: <strong>{{ cte.Id_CTe}}</strong></small>
                              <small class="w-100">Chave: <strong>{{cte.chCTe}}</strong></small>
                            </div>
                            <v-btn
                              v-if="cte.Id_CTe == idDoPrimeiroCteASerCarregado"
                              icon="mdi-check"
                              size="x-small"
                              variant="tonal"
                              readonly
                            />
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>

                </v-card>
              </v-stepper-window-item>

              <v-stepper-window-item
                :value="3"
              >
                <v-card flat>
                  <div class="text-caption mb-8">Selecione o CT-e que será entregue por <strong>ÚLTIMO</strong></div>

                  <v-card variant="flat" max-height="200" class="overflow-y-auto">
                    <v-row dense>
                      <v-col
                        cols="12"
                        class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
                        v-for="cte, index in listaDeCtesAdicionados" :key="`cte-${index}`"
                      >
                        <v-card

                          :class="
                            cte.Id_CTe == idDoUltimoCteASerEntregue
                            ? 'px-2 bg-green-lighten-4 text-green-darken-3 pa-2 '
                            : 'px-2 bg-red-lighten-4 text-redNeveah pa-2'
                          "
                          :style="
                            cte.Id_CTe == idDoUltimoCteASerEntregue
                            ? `border: 1px solid green;`
                            : `border: 1px solid #ba1614;`
                          "
                          @click="selecionaIdDoUltimoCteASerEntregue(cte.Id_CTe)"
                        >
                          <div class="d-flex align-center text-body-2">
                            <div class="d-flex flex-column w-100 ga-2">
                              <small class="w-100 text-body-2">ID: <strong>{{ cte.Id_CTe}}</strong></small>
                              <small class="w-100">Chave: <strong>{{cte.chCTe}}</strong></small>
                            </div>
                            <v-btn
                              v-if="cte.Id_CTe == idDoUltimoCteASerEntregue"
                              icon="mdi-check"
                              size="x-small"
                              variant="tonal"
                              readonly
                            />
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>

                </v-card>
              </v-stepper-window-item>

              <v-stepper-window-item
                :value="4"
              >
                <v-card flat>
                  <div class="text-caption mb-8">Estes são os CT-es que popularão automaticamente os campos do Manifesto</div>

                  <v-card variant="flat" max-height="200" class="overflow-y-auto">
                    <v-row dense>
                      <v-col
                        cols="12"
                        class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
                        v-for="cte, index in listaDeCtesAdicionados" :key="`cte-${index}`"
                      >
                        <v-card
                          :class="
                            cte.Id_CTe == idDoUltimoCteASerEntregue || cte.Id_CTe == idDoPrimeiroCteASerCarregado
                            ? 'px-2 bg-blue-lighten-4 text-blue-darken-3 pa-2'
                            : 'px-2 bg-red-lighten-4 text-redNeveah pa-2'
                          "
                          :style="
                            cte.Id_CTe == idDoUltimoCteASerEntregue || cte.Id_CTe == idDoPrimeiroCteASerCarregado
                            ? `border: 1px solid blue;`
                            : `border: 1px solid #ba1614;`
                          "
                        >
                          <div class="d-flex align-center text-body-2">
                            <div class="d-flex flex-column w-100 ga-2">
                              <small class="w-100 text-body-2">ID: <strong>{{ cte.Id_CTe}}</strong></small>
                              <small class="w-100">Chave: <strong>{{cte.chCTe}}</strong></small>

                              <div
                                v-if="cte.Id_CTe == idDoPrimeiroCteASerCarregado || cte.Id_CTe == idDoUltimoCteASerEntregue"
                                class="d-flex ga-2 align-start justify-content-start"
                              >
                                <small class="mt-2" v-if="cte.Id_CTe == idDoPrimeiroCteASerCarregado">
                                  <v-chip color="blue-darken-3" variant="flat">Primeiro a ser carregado</v-chip>
                                </small>
                                <small class="mt-2" v-if="cte.Id_CTe == idDoUltimoCteASerEntregue">
                                  <v-chip color="blue-darken-3" variant="flat">Último a ser entregue</v-chip>
                                </small>
                              </div>
                            </div>
                            <v-btn
                              v-if="cte.Id_CTe == idDoUltimoCteASerEntregue"
                              icon="mdi-check"
                              size="x-small"
                              variant="tonal"
                              readonly
                            />
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>

                </v-card>
              </v-stepper-window-item>
            </v-stepper-window>

            <div class="d-flex w-100 pa-3">
              <v-btn @click="voltaStep" variant="text" :disabled="stepAtual == 1">
                Voltar
              </v-btn>
              <v-btn
                v-if="stepAtual != 4"
                class="ms-auto"
                color="grey-darken-3"
                @click="avancaStep"
                append-icon="mdi-chevron-right"
              >
                Avançar
              </v-btn>
              <v-btn
                v-if="stepAtual == 4"
                class="ms-auto"
                color="grey-darken-3"
                append-icon="mdi-chevron-right"
                @click="vinculaCtesAoManifsto"
              >
                Finalizar
              </v-btn>
            </div>
          </v-stepper>

          <template #append>
            <v-btn
              variant="text"
              class="me-auto"
              @click="fechaDialog"
              icon="mdi-close"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>

    <v-divider :thickness="2"></v-divider>

    <v-card class="pa-4 rounded-md d-flex flex-column ga-3 overflow-y-auto" variant="flat" max-height="420">
      <div v-for="item, indexDescarregamento in dadosFormCargaLocal?.descarregamento" :key="`item-descarregamento-${indexDescarregamento}`" class="mt-4 mb-2">
        <div class="mb-4 flex-column md-flex-row align-center ga-2">
          <span class="text-body-1 text-grey-darken-3 w-100">
            <strong>{{item.nome_municipio}}: </strong>
          </span>
          <v-chip label color="grey-darken-3" variant="flat" class="w-100">
            <div>Código do Município: <strong>{{item.codigo_municipio}}</strong></div>
          </v-chip>
        </div>

        <v-row class="mb-4">
          <v-col
            cols="12"
            class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
            v-for="cte, index in item.documentos_fiscais" :key="`cte-${index}`"
          >
            <v-card class="px-2 bg-grey-darken-2 pa-2 mx-2" style="border: 1px solid rgb(80, 80, 80);">
              <div class="d-flex align-center text-body-2 w-100 justify-between">
                <div class="d-flex flex-column w-100 ga-2">
                  <div class="w-100">ID: <strong>{{ cte.Id_CTe}}</strong></div>
                  <div class="w-100">Chave: <strong>{{cte.chCTe}}</strong></div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-divider :thickness="2"></v-divider>
      </div>
    </v-card>
  </v-card>
</template>

<script>

import { buscaListaDeCtesHelper } from '@/helpers/buscaListaDeCtes';
import ApiService from '@/services/ApiService';
import { useAlertStore } from '@/stores/alertStore';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import { inject } from 'vue';

export default {
  name: 'CardVinculaCte',
  props: {
    dadosFormCarga: {
      type: Object,
      required: true
    },
    totalDeCtesVinculados: {
      type: Number,
      required: true
    },
  },
  computed: {
    dadosFormCargaLocal: {
      get() {
        return this.dadosFormCarga
      },
      set(novosDados) {
        this.$emit('update:dadosFormCarga', novosDados)
      }
    },
    totalDeCtesVinculadosLocal: {
      get() {
        return this.totalDeCtesVinculados
      },
      set(novosDados) {
        this.$emit('update:totalDeCtesVinculados', novosDados)
      }
    }
  },
  created() {
    this.dialog = inject('dialog')
  },
  data () {
    return {
      dialogVinculaCte: false,
      stepAtual: 1,
      steps: [
        'Passo 1',
        'Passo 2',
        'Passo 3',
        'Passo 4',
      ],

      primeiroCteASerCarregado: null,
      ultimoCteQueSeraEntregue: null,
      idDoUltimoCteASerEntregue: null,
      idDoPrimeiroCteASerCarregado: null,
      listaDeCtesAdicionados: [],
      cteSelecionadoNoInput: null,
      listaDeCtesDoCombobox: [],
      comboBoxCteLoading: false
    }
  },
  methods: {

    limpaCamposDoDialog() {
      this.primeiroCteASerCarregado = null
      this.ultimoCteQueSeraEntregue = null
      this.idDoUltimoCteASerEntregue = null
      this.idDoPrimeiroCteASerCarregado = null
      this.listaDeCtesAdicionados = []
      this.cteSelecionadoNoInput = null
      this.listaDeCtesDoCombobox = []
      this.stepAtual = 1
    },

    limpaCamposDoFormulario() {
      this.dadosFormCargaLocal = {
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
      this.totalDeCtesVinculadosLocal = 0
    },

    preencheCamposDoManifesto(ctesVinculados) {

      this.totalDeCtesVinculadosLocal = ctesVinculados.length

      for (const index in ctesVinculados) {
        const cte = ctesVinculados[index];

        // Adicionando o Ultimo Cte que será entregue a uma variavel do escopo global
        if(cte.Id_CTe == this.idDoPrimeiroCteASerCarregado) {
          this.primeiroCteASerCarregado = cte;
        }
        if(cte.Id_CTe == this.idDoUltimoCteASerEntregue) {
          this.ultimoCteQueSeraEntregue = cte;
        }

        this.dadosFormCargaLocal.peso_bruto  += parseFloat(cte.infQ_qCarga)
        this.dadosFormCargaLocal.valor_carga  += parseFloat(cte.vCarga)
      }


      for(const index in ctesVinculados) {
        const cte = ctesVinculados[index];
        if(cte.Id_CTe == this.ultimoCteQueSeraEntregue.Id_CTe) {
          continue
        }
        this.adicionaComponenteCte(cte);
      }
       // O ultimo cte deve ser o ultimo a ser adicionado no array
      this.adicionaComponenteCte(this.ultimoCteQueSeraEntregue)

      this.dadosFormCargaLocal.uf_carregamento    = this.primeiroCteASerCarregado.UFIni
      this.dadosFormCargaLocal.uf_descarregamento = this.ultimoCteQueSeraEntregue.UFFim

      const objetoCarregamento = {
        codigo_municipio: this.primeiroCteASerCarregado.rem_cMun,
        nome_municipio: this.primeiroCteASerCarregado.rem_xMun,
      }

      this.dadosFormCargaLocal.carregamento[0] = objetoCarregamento

      if(ctesVinculados.length == 1) {
        this.dadosFormCargaLocal.produto_predominante.nome = this.primeiroCteASerCarregado.proPred
        this.dadosFormCargaLocal.produto_predominante.lotacao.descarregamento.cep = this.primeiroCteASerCarregado.frete.cep_destinatario
      }

      const objetoCondutor = {
        cpf:  this.ultimoCteQueSeraEntregue.frete.motorista.cpf,
        nome:  this.ultimoCteQueSeraEntregue.frete.motorista.nome_completo,
      }

      this.dadosFormCargaLocal.rodoviario.condutor[0] = objetoCondutor
    },

    adicionaComponenteCte(cte) {

      if(this.dadosFormCargaLocal.descarregamento.length == 0) {
        this.criaNovoItemNoArrayDeDescarregamento(cte)
        return
      }

      const componenteCte = this.descobreSeJaHaOMunicipioDoCteNoArray(cte)

      if(!componenteCte) {
        this.criaNovoItemNoArrayDeDescarregamento(cte)
        return
      }

      const objetoCte = {
        Id_CTe: cte.Id_CTe,
        chCTe: cte.chCTe
      }

      componenteCte.documentos_fiscais.push(objetoCte)
    },

    criaNovoItemNoArrayDeDescarregamento(cte) {
      const objetoCte = {
        Id_CTe: cte.Id_CTe,
        chCTe: cte.chCTe
      }

      const componenteCte = {
        codigo_municipio: cte.dest_cMun,
        nome_municipio: cte.dest_xMun,
        documentos_fiscais: [
          {...objetoCte}
        ]
      }

      this.dadosFormCargaLocal.descarregamento.push(componenteCte)
    },

    descobreSeJaHaOMunicipioDoCteNoArray(cte) {
      const componenteCte = this.dadosFormCargaLocal.descarregamento.find(item => {
        return item.codigo_municipio == cte.dest_cMun
      })

      return componenteCte
    },

    verificaSeExisteCteNoArrayDeDocumentos(documentos_fiscais) {
      for(const index in documentos_fiscais) {
        if(documentos_fiscais[index].chCTe == this.cteSelecionado.chCTe) {
          return true
        }
      }

      return false
    },

    async vinculaCtesAoManifsto() {
      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      loading.show('Vinculando CT-e(s)...')
      this.limpaCamposDoFormulario()

      const endpoint = `${endpoints.cte.buscaListaDeCtesParaOManifesto}`;
      try {
        const resposta = await ApiService({
          method: 'get',
          url: endpoint,
          params: {
            chaves: this.listaDeCtesAdicionados.map(cte => cte.chCTe)
          },
          paramsSerializer: {
            indexes: false
          }
        })

        const ctesVinculados = resposta?.data?.data;

        this.preencheCamposDoManifesto(ctesVinculados)
        this.fechaDialog(false)

        alertStore.addAlert(
          'CT-es vinculados com sucesso!',
          'success'
        );

      } catch (error) {
        alertStore.addAlert(`Erro ao Vincular o(s) CT-e(s): ${error?.response?.data?.message}`, 'error');
      } finally {
        loading.hide()
      }
    },

    selecionaIdDoUltimoCteASerEntregue(idCte) {
      this.idDoUltimoCteASerEntregue = idCte
    },

    selecionaidDoPrimeiroCteASerCarregado(idCte) {
      this.idDoPrimeiroCteASerCarregado = idCte
    },

    abreDialog() {
      this.dialogVinculaCte = true
    },

    async fechaDialog(exibirMensagemDeConfirmacao = true) {

      let confirmado = true
      const mensagem = 'Você realmente deseja sair? Seus dados serão perdidos.'

      if(exibirMensagemDeConfirmacao) {
        confirmado = await this.dialog.value.open({
          title: `Sair`,
          message: mensagem,
          titleColor: 'error'
        })
      }

      if(!confirmado) return

      this.limpaCamposDoDialog()
      this.dialogVinculaCte = false
    },

    async buscaCtes() {
      await buscaListaDeCtesHelper(
        this.cteSelecionadoNoInput,
        (ctes) => {
          this.listaDeCtesDoCombobox = ctes;
        },
        (loading) => {
          this.comboBoxCteLoading = loading;
        }
      );
    },

    adicionarNovoCteALista() {
      const alert = useAlertStore()

      const existe = this.verificaSeJaExisteCteNaLista()

      if(typeof this.cteSelecionadoNoInput != 'object' || !this.cteSelecionadoNoInput) {
        alert.addAlert('Você deve selecionar o CT-e, não apenas digitar', 'warning');
        return
      }

      if(existe) {
        alert.addAlert('Este CT-e já foi adicionado, tente outro', 'warning');
        return
      }

      this.listaDeCtesAdicionados.push(this.cteSelecionadoNoInput)
    },

    removeCteDaLista(index) {
      const cte = this.listaDeCtesAdicionados[index]

      if(cte.Id_CTe == this.idDoPrimeiroCteASerCarregado) {
        this.idDoPrimeiroCteASerCarregado = null
      }
      if(cte.Id_CTe == this.idDoUltimoCteASerEntregue) {
        this.idDoUltimoCteASerEntregue = null
      }

      this.listaDeCtesAdicionados.splice(index, 1)
    },

    verificaSeJaExisteCteNaLista() {
      if(this.listaDeCtesAdicionados.length == 0) {
        return false
      }

      for (const index in this.listaDeCtesAdicionados) {
        if(this.listaDeCtesAdicionados[index].Id_CTe == this.cteSelecionadoNoInput.Id_CTe) return true
      }

      return false;
    },

    validaStep() {
      const alert = useAlertStore()
      let validado = true

      if(this.stepAtual == 1) {

        if(this.listaDeCtesAdicionados.length == 0) validado = false;

        if(!validado) alert.addAlert('Adicione pelo menos um CT-e para avançar', 'warning');

        if( this.listaDeCtesAdicionados.length == 1) {
          this.idDoPrimeiroCteASerCarregado = this.listaDeCtesAdicionados[0].Id_CTe
        }
        if( this.listaDeCtesAdicionados.length == 1) {
          this.idDoUltimoCteASerEntregue = this.listaDeCtesAdicionados[0].Id_CTe
        }

        return validado
      }

      if(this.stepAtual == 2) {
        if(this.idDoPrimeiroCteASerCarregado == null) validado = false;
        if(!validado) alert.addAlert('Selecione um CT-e para avançar', 'warning');
        return validado
      }

      if(this.stepAtual == 3) {
        if(this.idDoUltimoCteASerEntregue == null) validado = false;
        if(!validado) alert.addAlert('Selecione um CT-e para avançar', 'warning');
        return validado
      }

      return validado
    },

    avancaStep() {
      if(this.stepAtual == 4) return

      const valido = this.validaStep()
      if(!valido) return

      this.stepAtual += 1
    },

    voltaStep() {
      if(this.stepAtual == 1) return
      this.stepAtual -= 1
    }
  }

}
</script>

<style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.25s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  .list-move {
    transition: transform 0.25s ease; /* For animating reordering */
  }
</style>
