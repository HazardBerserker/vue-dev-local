<template>
  <div>
    <v-btn
      color="blue-darken-3"
      prepend-icon="mdi-pencil"
      variant="tonal"
      density="comfortable"
      :disabled="loading"
      class="text-white"
      rounded="pill"
      @click="openDialog"
    >
      Editar
    </v-btn>

    <DialogCreateCadastro ref="dialogAtualiza" :max-width="1500">
      <template #title>
        Detalhes
      </template>

      <template #subtitle>
        Todos os campos são obrigatórios
      </template>

      <v-form ref="form">
        <v-row class="py-0" dense>
          <v-col cols="12" class="py-0 mb-6">
            <v-card class="rounded-lg" color="grey-lighten-3 elevation-1 border">
              <template #title>
                <div class="text-body-1 font-weight-bold">
                  Informações Gerais
                </div>
              </template>
              <div class="px-4 bg-white py-2 text-body-2">
                <div class="d-flex">
                  <div class="w-100"><strong>ID:</strong> {{id_frete}}</div>
                  <div class="w-100"><strong>Data:</strong> {{data_cotacao}}</div>
                </div>
                <div class="d-flex text-start">
                  <div class="w-100"><strong>Remetente:</strong> {{ remetente }}</div>
                  <div class="w-100"><strong>Destinatário:</strong> {{nome_destinatario}}</div>
                </div>
                <div class="d-flex text-start">
                  <div class="w-100"><strong>CNPJ:</strong> {{cnpj_remetente}}</div>
                  <div class="w-100"><strong>Cidade:</strong> {{`${cidade_destinatario} / ${uf_destinatario}`}}</div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" class="py-0 mb-6">
            <v-card class="rounded-lg" color="grey-lighten-3 elevation-1 border">
              <template #title>
                <div class="text-body-1 font-weight-bold">
                  Valores
                </div>
              </template>
              <div class="px-4 pt-6 bg-white py-2">
                <div class="d-flex ga-4 mb-2">
                  <!-- <v-text-field density="compact" variant="outlined" v-money3="money" label="Valor Motorista:" v-model="valor_motorista" class="w-100"></v-text-field> -->
                  <InputTextMoeda v-model="valor_motorista_efetivo" prefix="R$" label="Valor Motorista:" :rules="campoObrigatorio" :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()"/>
                  <InputTextMoeda v-model="valor_notafiscal" prefix="R$" label="Valor NF:" :rules="campoObrigatorio" :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()"/>
                </div>
                <div class="d-flex ga-4 text-start">
                  <InputTextMoeda v-model="valor_cobrado_efetivo" prefix="R$" label="Valor Cobrado:" :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()"/>
                  <v-text-field clearable density="compact" variant="outlined" label="Coeficiente:" v-model="coeficiente_margem" class="w-100" min="0" :rules="campoObrigatorio" :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()">
                    <template #append-inner>
                      %
                    </template>
                  </v-text-field>
                  <v-text-field clearable density="compact" variant="outlined" label="Prazo de Entrega (em dias):" v-model="prazo" class="w-100" min="0" :rules="campoObrigatorio" :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()"></v-text-field>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" class="py-0 mb-6">
            <v-card class="rounded-lg" color="grey-lighten-3 elevation-1 border">
              <template #title>
                <div class="text-body-1 font-weight-bold">
                  Outros Dados
                </div>
              </template>
              <div class="px-4 pt-6 bg-white py-2">
                <div class="d-flex ga-4 mb-2">
                  <v-combobox
                    :loading="comboBoxCteLoading"
                    @keyup="(event) => {
                      const tecla = event.key
                      const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                      if (teclaValida) buscaCte()
                    }"
                    v-model="cte"
                    density="compact"
                    variant="outlined"
                    label="CTE Vinculado:"
                    bg-color="white"
                    placeholder="Comece a digitar..."
                    :items="listaDeCtes"
                    item-title="Id_CTe"
                    class="w-100"
                    clearable
                    :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()"
                  >
                  </v-combobox>
                  <v-select density="compact" class="w-100" variant="outlined" label="Forma de Pagamento:" :items="opcoesFormaPagamento" v-model="forma_pagamento" itemTitle="descricao" itemValue="valor" :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()"></v-select>
                  <!-- <div class="w-100"><strong>Data:</strong> 18/06/2025</div> -->
                </div>
                <div class="d-flex ga-4 text-start">
                  <v-combobox
                    :loading="comboBoxMotoristaLoading"
                    @keyup="(event) => {
                      const tecla = event.key
                      const teclaValida = /^[a-zA-Z0-9áéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]$/.test(tecla)
                      if (teclaValida) buscaMotorista()
                    }"
                    v-model="motorista"
                    density="compact"
                    variant="outlined"
                    label="Escolha um Motorista:"
                    bg-color="white"
                    placeholder="Comece a digitar..."
                    :items="listaDeMotoristas"
                    item-title="nome_completo"
                    class="w-100"
                    clearable
                    :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()"
                  >
                  </v-combobox>
                  <v-select density="compact" class="w-100" variant="outlined" label="Status da Cotação:" :items="opcoesStatus" :rules="campoObrigatorio" v-model="status" itemTitle="descricao" itemValue="valor" :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento() || !this.cte || !this.motorista"></v-select>
                  <!-- <v-text-field density="compact" variant="outlined" label="Motivo da Rejeição:"></v-text-field> -->
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" class="py-0 mb-6">
            <v-card class="rounded-lg" color="grey-lighten-3 elevation-1 border">
              <template #title>
                <div class="text-body-1 font-weight-bold">
                  Observações
                </div>
              </template>
              <div class="px-4 pt-6 bg-white py-2">
                <div class="d-flex ga-4">
                  <v-textarea clearable v-model="observacoes" density="compact" variant="outlined" label="Observações Cotação:" rows="2" :disabled="!modoEdicao"></v-textarea>
                  <v-textarea clearable v-model="obs_financeiro" density="compact" variant="outlined" label="Observações Financeiro:" rows="2" :disabled="!modoEdicao"></v-textarea>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" class="py-0 mb-6">
            <v-card class="rounded-lg" color="grey-lighten-3 elevation-1 border">
              <template #title>
                <div class="text-body-1 font-weight-bold">
                  Financeiro
                </div>
              </template>
              <div class="px-4 pt-6 bg-white py-2">
                <div class="d-flex ga-4 text-start">
                  <v-select v-model="adiantamento" density="compact" variant="outlined" label="Adiantamento:" :items="opcoesSImENao" itemTitle="descricao" itemValue="valor" disabled></v-select>
                  <v-select v-model="saldo" density="compact" variant="outlined" label="Saldo:" :items="opcoesSImENao" itemTitle="descricao" itemValue="valor" disabled></v-select>
                  <v-select v-model="integral" density="compact" variant="outlined" label="Integral:" :items="opcoesSImENao" itemTitle="descricao" itemValue="valor" disabled></v-select>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" class="py-0 mb-6">
            <v-card class="rounded-lg" color="grey-lighten-3 elevation-1 border">
              <template #title>
                <div class="text-body-1 font-weight-bold">
                  Entrega
                </div>
              </template>
              <div class="px-4 pt-6 bg-white py-2">
                <div class="d-flex ga-4 text-start">
                  <v-row dense>
                    <v-col>
                      <v-date-input
                        v-model="entrega_efetiva"
                        label="Entrega Efetiva:"
                        prepend-icon=""
                        density="compact"
                        prepend-inner-icon="$calendar"
                        :display-format="format"
                        placeholder="dd/mm/yy"
                        clearable
                        variant="outlined"
                        :disabled="!modoEdicao"
                        :rules="arquivos_comprovante ? regraEntregaEfetiva : []"
                      ></v-date-input>
                    </v-col>
                    <v-col>
                      <v-date-input
                        v-model="coleta_efetiva"
                        label="Coleta Efetiva:"
                        prepend-icon=""
                        density="compact"
                        prepend-inner-icon="$calendar"
                        :display-format="format"
                        placeholder="dd/mm/yy"
                        clearable
                        variant="outlined"
                        :disabled="!modoEdicao || desabilitaCampoSeHouverPagamento()"
                      ></v-date-input>
                    </v-col>
                    <v-col>
                      <v-file-input
                        v-model="arquivos_comprovante"
                        accept="image/*"
                        multiple
                        density="compact"
                        clearable
                        prepend-icon="mdi-camera"
                        label="Selecione o(s) comprovantes(s)"
                        variant="outlined"
                        :show-size="1000"
                        color="redNeveah"
                        placeholder="Apenas imagens são válidas"
                        counter
                        :disabled="!modoEdicao"
                        :rules="entrega_efetiva && !imagem_que_sera_exibida ? regrasImagens : []"
                      >
                        <template v-slot:selection="{ fileNames }">
                          <template v-for="(fileName, index) in fileNames" :key="fileName">
                            <v-chip
                              v-if="index < 2"
                              class="me-2"
                              color="redNeveah"
                              size="small"
                              label
                            >
                              {{ fileName }}
                            </v-chip>

                            <span
                              v-else-if="index === 2"
                              class="text-overline text-grey-darken-3 mx-2"
                            >
                              +{{ arquivos_comprovante?.length - 2 }} Arquivo(s)
                            </span>
                          </template>
                        </template>
                      </v-file-input>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card>
          </v-col>

        </v-row>
      </v-form>

      <v-btn
        v-if="imagens.length"
        :color="imagemVisivel ? 'red-darken-1' : 'blue-darken-2'"
        class="rounded-lg hover-scale mb-2"
        variant="flat"
        block
        @click="toggleImagem"
        size="small"
      >
        {{ imagemVisivel ? 'Ocultar' : 'Exibir' }} {{ imagens.length > 1 ? 'Comprovantes' : 'Comprovante' }}
      </v-btn>

      <v-expand-transition>
        <div
          v-if="imagemVisivel"
          class="image-container d-flex flex-wrap justify-center ga-4 elevation-1 rounded-lg pa-2"
        >
          <v-img
            v-for="(img, index) in imagensVisiveis"
            :key="index"
            :src="img"
            class="rounded-lg"
            style="max-width: 300px; max-height: 300px;"
            contain
          />
        </div>
      </v-expand-transition>

      <template #action-button>
        <v-btn v-if="modoEdicao" variant="flat" color="yellow-darken-4" rounded="pill" @click="desativaModoEdicao">Descartar Edições</v-btn>
        <v-btn variant="flat" color="blue-darken-3" rounded="pill" @click="modoEdicao ? atualizaFreteCotacao() : modoEdicao = true">{{modoEdicao ? 'Atualizar' : 'Editar'}}</v-btn>
      </template>
    </DialogCreateCadastro>
  </div>
</template>

<script>

import DialogCreateCadastro from '@/components/Cadastros/Scaffold/DialogCreateCadastro.vue';
import ApiService from '@/services/ApiService';
import { useAlertStore } from '@/stores/alertStore';
import { endpoints } from '@/utils/apiEndpoints';
import { useLoadingStore } from '@/stores/loading';
import { formataDataBRParaPadraoBanco, formataDataISOParaPadraoBanco, formataDataSomenteData, formatarDataParaInputVuetify } from '@/utils/masks';
import { format as formatDate } from 'date-fns'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue';
import { SimENaoEnumDescricao } from '@/Enums/SimENaoEnum';
import { geraUrlTemporariaParaImagemS3, urlEDaS3 } from '@/helpers/funcoesParaS3';
import { appendIfValid } from '@/helpers/formHelpers';

export default {
    name: 'BtnAtualizaFreteCotacoes',
    components: {
      DialogCreateCadastro,
      InputTextMoeda
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      loading: {
        type: Boolean,
        required: true,
      }
    },

    data() {
      return {
        imagem_que_sera_exibida: null,
        imagemVisivel: false,
        imagensTemporarias: [],

        formataDataSomenteData,
        id_frete: null,
        data_cotacao: null,
        id_remetente: null,
        remetente: null,
        cnpj_remetente: null,
        nome_destinatario: null,
        cidade_destinatario: null,
        uf_destinatario: null,
        valor_motorista: 0,
        cnpj_destinatario: null,
        valor_motorista_efetivo: null,
        cep_destinatario: null,
        endereco_destinatario: null,
        numero_destinatario: null,
        observacoes: null,
        valor_notafiscal: null,
        coeficiente_margem: null,
        advalorem: null,
        status: null,
        forma_pagamento: null,
        valor_cobrado_efetivo: null,
        valor_cobrado: null,
        prazo: null,
        adiantamento: null,
        saldo: null,
        integral: null,
        obs_financeiro: null,
        imposto_considerado: null,

        coleta_efetiva: null,
        entrega_efetiva: null,
        arquivos_comprovante: null,

        motorista: null,
        cte: null,

        opcoesFormaPagamento:[
          { valor: 0, descricao: 'Adiantamento Saldo' },
          { valor: 1, descricao: 'Integral' }
        ],
        opcoesStatus:[
          { valor: 0, descricao: 'Rejeitada' },
          { valor: 1, descricao: 'Em Aberto' },
          { valor: 2, descricao: 'Aceita' }
        ],
        opcoesSImENao: [
          { valor: 0, descricao: 'Não' },
          { valor: 1, descricao: 'Sim' },
        ],

        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
        regraEntregaEfetiva: [
          (v) => v !== null && v !== undefined && v !== '' || 'A Data de Entrega é obrigatória quando comprovante é enviado'
        ],
        regraRazaoSocial: [
          (v) => !!v || 'A Razão social é obrigatória',
        ],
        regraCNPJ: [
          (v) => !!v || 'O CNPJ é obrigatório',
          (v) => (v && v.length === 18) || 'O CNPJ deve ter 18 caracteres (incluindo pontos e traço)',
        ],
        regraEndereco: [
          (v) => !!v || 'O Logradouro é obrigatório',
        ],
        regraCEP: [
          (v) => !!v || 'O CEP é obrigatório',
          (v) => (v && v.length === 9) || 'O CEP deve ter 9 caracteres (incluindo pontos e traço)',
        ],
        regraCidade: [
          (v) => !!v || 'A Cidade é obrigatória',
        ],
        regraBairro: [
          (v) => !!v || 'O Bairro é obrigatório',
        ],
        regraPais: [
          (v) => !!v || 'O País é obrigatório',
        ],
        regraUF: [
          (v) => !!v || 'O UF é obrigatório',
          (v) => (v && v.length === 2) || 'O UF deve ter 2 caracteres',
        ],
        regraNumero: [
          (v) => !!v || 'O Número é obrigatório',
        ],
        regraAtivo: [
          (v) => v !== null && v !== undefined || 'O Campo Ativo é obrigatório',
        ],

        regrasImagens: [
          (v) => v?.length > 0 || 'Você deve selecionar pelo menos uma imagem',
          (v) =>
            v?.every(file => file.type.startsWith('image/')) ||
            'Todos os arquivos devem ser imagens válidas',
        ],

        // Combobox do motorista
        comboBoxMotoristaLoading: false,
        listaDeMotoristas: [],

        // Combobox do motorista
        comboBoxCteLoading: false,
        listaDeCtes: [],

        money: {
          prefix: 'R$ ',
          thousands: '.',
          decimal: ',',
          precision: 2
        },

        modoEdicao: false
      }
    },
    computed: {
      imagens() {
        if (!this.imagem_que_sera_exibida) return []
        return this.imagem_que_sera_exibida
          .split(',')
          .map(i => i.trim())
          .filter(i => i.length > 0)
      },
      imagensVisiveis() {
        return this.imagensTemporarias.length
          ? this.imagensTemporarias.map(img => img.urlTemporaria)
          : this.imagens
      }
    },
    methods: {
      async toggleImagem() {
        if (this.imagemVisivel) {
          this.imagemVisivel = false
          return
        }

        const agora = new Date()
        const novaLista = []

        const loading = useLoadingStore()
        loading.show('Carregando imagem...')

        try {
            for (const imagem of this.imagens) {
            if (urlEDaS3(imagem)) {
              const existente = this.imagensTemporarias.find(i => i.original === imagem)

              const aindaValida = existente && new Date(existente.expiraEm) > agora

              if (aindaValida) {
                novaLista.push(existente)
                continue
              }
              const novaUrl = await geraUrlTemporariaParaImagemS3(imagem)
              const novaExpiracao = new Date(agora.getTime() + 10 * 60 * 1000) // +10min
              novaLista.push({
                original: imagem,
                urlTemporaria: novaUrl,
                expiraEm: novaExpiracao
              })
              continue
            }
            novaLista.push({
              original: imagem,
              urlTemporaria: imagem,
              expiraEm: null
            })
          }
        } finally {
          loading.hide()
        }

        this.imagensTemporarias = novaLista
        this.imagemVisivel = true
      },
      formatLabel(campo) {
        return campo
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      },

      limpaCampos() {
        const objetoMotorista = {
          cpf: this.item.cpf_motorista,
          nome_completo: this.item.nome_motorista
        }
        const objetoCte = {
          Id_CTe: this.item.cte_vinculado,
        }
        this.id_frete = this.item.id_frete
        this.data_cotacao = this.item.data_cotacao
        this.id_remetente = this.item.id_remetente
        this.remetente = this.item.remetente
        this.cnpj_remetente = this.item.cnpj_remetente
        this.nome_destinatario = this.item.nome_destinatario
        this.cidade_destinatario = this.item.cidade_destinatario
        this.uf_destinatario = this.item.uf_destinatario
        this.valor_motorista = Number(this.item.valor_motorista)
        this.cnpj_destinatario = this.item.cnpj_destinatario
        this.valor_motorista_efetivo = this.item.valor_motorista_efetivo
        this.cep_destinatario = this.item.cep_destinatario
        this.endereco_destinatario = this.item.endereco_destinatario
        this.numero_destinatario = this.item.numero_destinatario
        this.observacoes = this.item.observacoes
        this.valor_notafiscal = this.item.valor_notafiscal
        this.coeficiente_margem = this.item.coeficiente_margem
        this.advalorem = this.item.advalorem
        this.status = this.item.status
        this.forma_pagamento = this.item.forma_pagamento
        this.adiantamento = this.item.adiantamento
        this.saldo = this.item.saldo
        this.integral = this.item.integral
        this.imposto_considerado = this.item.imposto_considerado
        this.entrega_efetiva = this.item.entrega_efetiva ? formatarDataParaInputVuetify(this.item.entrega_efetiva) : null
        this.coleta_efetiva = this.item.coleta_efetiva ? formatarDataParaInputVuetify(this.item.coleta_efetiva) : null
        if(this.item.cte_vinculado) {
          this.cte = objetoCte
        }
        if(this.item.cpf_motorista && this.item.nome_motorista) {
          this.motorista = objetoMotorista
        }
        this.imagem_que_sera_exibida = this.item.arquivo_comprovante
        this.valor_cobrado_efetivo = this.item.valor_cobrado_efetivo
        this.valor_cobrado = this.item.valor_cobrado
        this.prazo = this.item.prazo
      },

      desativaModoEdicao() {
        this.limpaCampos();
        this.modoEdicao = false
      },

      closeDialog() {
        this.$refs.dialogAtualiza.onCloseDialog();
      },
      openDialog() {
        this.$refs.dialogAtualiza.onOpenDialog();

        const objetoMotorista = {
          cpf: this.item.cpf_motorista,
          nome_completo: this.item.nome_motorista
        }

        const objetoCte = {
          Id_CTe: this.item.cte_vinculado,
        }
        
        this.id_frete = this.item.id_frete
        this.data_cotacao = this.item.data_cotacao
        this.id_remetente = this.item.id_remetente
        this.remetente = this.item.remetente
        this.cnpj_remetente = this.item.cnpj_remetente
        this.nome_destinatario = this.item.nome_destinatario
        this.cidade_destinatario = this.item.cidade_destinatario
        this.uf_destinatario = this.item.uf_destinatario
        this.valor_motorista = Number(this.item.valor_motorista)
        this.cnpj_destinatario = this.item.cnpj_destinatario
        this.valor_motorista_efetivo = this.item.valor_motorista_efetivo
        this.cep_destinatario = this.item.cep_destinatario
        this.endereco_destinatario = this.item.endereco_destinatario
        this.numero_destinatario = this.item.numero_destinatario
        this.observacoes = this.item.observacoes
        this.valor_notafiscal = this.item.valor_notafiscal
        this.coeficiente_margem = this.item.coeficiente_margem
        this.advalorem = this.item.advalorem
        this.status = this.item.status
        this.forma_pagamento = this.item.forma_pagamento
        this.adiantamento = this.item.adiantamento
        this.saldo = this.item.saldo
        this.integral = this.item.integral
        this.imposto_considerado = this.item.imposto_considerado
        this.entrega_efetiva = this.item.entrega_efetiva ? formatarDataParaInputVuetify(this.item.entrega_efetiva) : null
        this.coleta_efetiva = this.item.coleta_efetiva ? formatarDataParaInputVuetify(this.item.coleta_efetiva) : null

        if(this.item.cte_vinculado) {
          this.cte = objetoCte
        }

        if(this.item.cpf_motorista && this.item.nome_motorista) {
          this.motorista = objetoMotorista
        }
        // this.arquivo_comprovante = this.item.arquivo_comprovante
        this.imagem_que_sera_exibida = this.item.arquivo_comprovante
        // this.imposto_considerado = null
        this.valor_cobrado_efetivo = this.item.valor_cobrado_efetivo
        this.valor_cobrado = this.item.valor_cobrado
        this.prazo = this.item.prazo
      },
      validateForm() {
        return this.$refs.form.validate();
      },
      formataDadosParaEnvio() {
        const formData = new FormData();

        appendIfValid(formData, 'id_frete', this.id_frete);
        appendIfValid(formData, 'data_cotacao', this.data_cotacao ? formataDataBRParaPadraoBanco(this.data_cotacao) : null);
        appendIfValid(formData, 'id_remetente', this.id_remetente);
        appendIfValid(formData, 'remetente', this.remetente);
        appendIfValid(formData, 'cnpj_remetente', this.cnpj_remetente);
        appendIfValid(formData, 'cnpj_destinatario', this.cnpj_destinatario);
        appendIfValid(formData, 'nome_destinatario', this.nome_destinatario);
        appendIfValid(formData, 'cidade_destinatario', this.cidade_destinatario);
        appendIfValid(formData, 'uf_destinatario', this.uf_destinatario?.toUpperCase());
        appendIfValid(formData, 'cep_destinatario', this.cep_destinatario);
        appendIfValid(formData, 'endereco_destinatario', this.endereco_destinatario);
        appendIfValid(formData, 'numero_destinatario', this.numero_destinatario);
        appendIfValid(formData, 'observacoes', this.observacoes);
        appendIfValid(formData, 'valor_notafiscal', this.valor_notafiscal);
        appendIfValid(formData, 'coeficiente_margem', this.coeficiente_margem);
        appendIfValid(formData, 'advalorem', this.advalorem);
        appendIfValid(formData, 'status', this.status);
        appendIfValid(formData, 'forma_pagamento', this.forma_pagamento);
        appendIfValid(formData, 'valor_motorista', this.valor_motorista);
        appendIfValid(formData, 'valor_motorista_efetivo', this.valor_motorista_efetivo);
        appendIfValid(formData, 'valor_cobrado', this.valor_cobrado);
        appendIfValid(formData, 'valor_cobrado_efetivo', this.valor_cobrado_efetivo);
        appendIfValid(formData, 'prazo', this.prazo);
        appendIfValid(formData, 'imposto_considerado', this.imposto_considerado);

        appendIfValid(formData, 'coleta_efetiva', this.coleta_efetiva ? this.formatarDataParaEnvio(this.coleta_efetiva) : null);
        appendIfValid(formData, 'adiantamento', this.adiantamento);
        appendIfValid(formData, 'saldo', this.saldo);
        appendIfValid(formData, 'integral', this.integral);
        appendIfValid(formData, 'obs_financeiro', this.obs_financeiro);
        appendIfValid(formData, 'cpf_motorista', this.motorista?.cpf);
        appendIfValid(formData, 'cte_vinculado', typeof this.cte === 'object' && this.cte?.Id_CTe ? this.cte.Id_CTe : this.cte);

        if (this.arquivos_comprovante?.length > 0) {
          this.arquivos_comprovante.forEach((arquivo) => {
            formData.append('arquivo_comprovante[]', arquivo)
          })
        }

        appendIfValid(formData, 'entrega_efetiva', this.entrega_efetiva ? this.formatarDataParaEnvio(this.entrega_efetiva) : null);

        // Método PUT, se necessário
        formData.append('_method', 'PUT');

        return formData;
      },

      formatarDataParaEnvio(data) {
        // Se já estiver no formato ISO (yyyy-MM-dd), retorna direto
        if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
          return data;
        }
        return formataDataISOParaPadraoBanco(data)
      },

      async atualizaFreteCotacao() {

        const alertStore = useAlertStore()
        const loading = useLoadingStore()

        const formValidado = await this.validateForm();

        if(!formValidado.valid) {
          return;
        }

        if (this.motorista && typeof this.motorista !== 'object') {
          alertStore.addAlert('Selecione um motorista da lista que aparece ao digitar', 'warning')
          return
        }

        const dadosParaEnvio = this.formataDadosParaEnvio();

        const url = `${endpoints.freteCotacao.atualiza}/${this.item.id_frete}`;

        try {
          loading.show('Atualizando...')
          const resposta =  await ApiService({
            method: 'post',
            url: url,
            data: dadosParaEnvio,
            headers: {
              'Content-Type': 'multipart/form-data' // NÃO precisa disso
            }
          });

          alertStore.addAlert(resposta?.data.message, 'success')



          let itemAtualizado = resposta?.data?.data
          itemAtualizado.nome_motorista = this.motorista?.nome_completo

          this.limpaCampos()
          this.closeDialog()


          this.$emit('atualizaODadoNoArrayLocalmente', itemAtualizado)
        } catch (erro) {
          alertStore.addAlert(erro.response?.data?.message, 'error')
        } finally {
          loading.hide()
        }
      },

      async buscaMotorista() {
        if(this.comboBoxMotoristaLoading) {
          return;
        }
        try {

          const endpoint = endpoints.motorista.listaPorRazaoSocial;
          const url =  `${endpoint}/${this.motorista}`

          this.comboBoxMotoristaLoading = true

          const resposta =  await ApiService({
            method: 'get',
            url: url,
          })

          this.listaDeMotoristas = resposta.data.data

        } catch (error) {
          const alertStore = useAlertStore()
          alertStore.addAlert(error?.response?.data?.message, 'error', 3000);
          return
        } finally {
          this.comboBoxMotoristaLoading = false
        }
      },

      async buscaCte() {
        if(this.comboBoxCteLoading) {
          return;
        }
        try {

          const endpoint = endpoints.cte.listaPorId;
          const url =  `${endpoint}/${this.cte}`

          this.comboBoxCteLoading = true

          const resposta =  await ApiService({
            method: 'get',
            url: url,
          })

          this.listaDeCtes = resposta.data.data

        } catch (error) {
          const alertStore = useAlertStore()
          alertStore.addAlert(error?.response?.data?.message, 'error', 3000);
          return
        } finally {
          this.comboBoxCteLoading = false
        }
      },

      format(date) {
        return formatDate(date, 'dd/MM/yyyy')
      },

      desabilitaCampoSeHouverPagamento() {
        const sim = SimENaoEnumDescricao.SIM

        if(this.integral == sim || this.saldo == sim || this.adiantamento == sim) {
          return true
        }

        return false
      }
    }
}
</script>

<style scoped>
.image-container {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f5f5f5;
}
</style>
