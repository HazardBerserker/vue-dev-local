<template>
  <div>
    <v-btn
      color="blue-darken-3"
      prepend-icon="mdi-pencil"
      variant="tonal"
      density="comfortable"
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
                    @keyup="buscaCte"
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
                    @keyup="buscaMotorista"
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
                  ></v-date-input>
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
                  <v-file-input v-model="arquivo_comprovante" accept="image/*" :rules="entrega_efetiva && !imagem_que_sera_exibida ? regraArquivo : []" density="compact" clearable prepend-icon="mdi-camera" label="Selecionar Comprovantes:" variant="outlined" :disabled="!modoEdicao"></v-file-input>
                </div>
              </div>
            </v-card>
          </v-col>

        </v-row>
      </v-form>

      <v-btn
        v-if="imagem_que_sera_exibida"
        :color="imagemVisivel ? 'red-darken-1' : 'blue-darken-2'"
        class="rounded-lg hover-scale mb-2"
        variant="flat"
        block
        @click="toggleImagem"
        size="small"
      >
        {{ imagemVisivel ? 'Ocultar' : 'Exibir' }} Arquivo do Comprovante
      </v-btn>

      <v-expand-transition>
        <div
          v-if="imagemVisivel"
          class="image-container elevation-1 rounded-lg pa-1 w-100 ma-auto"
        >
          <v-img
            :src="imagem_que_sera_exibida"
            class="rounded-lg w-50 ma-auto"
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
import { formataDataSomenteData } from '@/utils/masks';
import { format as formatDate } from 'date-fns'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue';
import { SimENaoEnumDescricao } from '@/Enums/SimENaoEnum';

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
    },


    data() {
      return {
        imagem_que_sera_exibida: false,
        imagemVisivel: false,
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
        arquivo_comprovante: null,

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
          (v) => !!v || 'Este campo é obrigatório',
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

        regraArquivo: [
          (v) => v !== null && v !== undefined || 'O Arquivo é obrigatório quando a Entrega Efetiva esta preenchida',
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
    methods: {
      toggleImagem() {
        this.imagemVisivel = !this.imagemVisivel;
      },

      formatLabel(campo) {
        return campo
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      },

      limpaCampos() {
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
        this.valor_cobrado_efetivo = this.item.valor_cobrado_efetivo
        this.valor_cobrado = this.item.valor_cobrado
        this.prazo = this.item.prazo
        this.coleta_efetiva = null
        this.adiantamento = null
        this.saldo = null
        this.integral = null
        this.obs_financeiro = null
        this.arquivo_comprovante = null
        this.entrega_efetiva = null
        this.motorista = null
        this.cte = null
        this.imposto_considerado = null
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
        this.cte = this.item.cte_vinculado

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

        const appendIfValid = (key, value) => {
          if (value !== undefined && value !== null && value !== 'undefined' && value !== 'null') {
            formData.append(key, value);
          }
        };

        appendIfValid('id_frete', this.id_frete);
        appendIfValid('data_cotacao', this.formatarParaISO(this.data_cotacao));
        appendIfValid('id_remetente', this.id_remetente);
        appendIfValid('remetente', this.remetente);
        appendIfValid('cnpj_remetente', this.cnpj_remetente);
        appendIfValid('nome_destinatario', this.nome_destinatario);
        appendIfValid('cidade_destinatario', this.cidade_destinatario);
        appendIfValid('uf_destinatario', this.uf_destinatario?.toUpperCase());
        appendIfValid('cep_destinatario', this.cep_destinatario);
        appendIfValid('endereco_destinatario', this.endereco_destinatario);
        appendIfValid('numero_destinatario', this.numero_destinatario);
        appendIfValid('observacoes', this.observacoes);
        appendIfValid('valor_notafiscal', this.valor_notafiscal);
        appendIfValid('coeficiente_margem', this.coeficiente_margem);
        appendIfValid('advalorem', this.advalorem);
        appendIfValid('status', this.status);
        appendIfValid('forma_pagamento', this.forma_pagamento);
        appendIfValid('valor_motorista', this.valor_motorista);
        appendIfValid('valor_motorista_efetivo', this.valor_motorista_efetivo);
        appendIfValid('valor_cobrado', this.valor_cobrado);
        appendIfValid('valor_cobrado_efetivo', this.valor_cobrado_efetivo);
        appendIfValid('prazo', this.prazo);
        appendIfValid('imposto_considerado', this.imposto_considerado);

        appendIfValid('coleta_efetiva', this.coleta_efetiva ? formatDate(this.coleta_efetiva, 'yyyy-MM-dd') : null);
        appendIfValid('adiantamento', this.adiantamento);
        appendIfValid('saldo', this.saldo);
        appendIfValid('integral', this.integral);
        appendIfValid('obs_financeiro', this.obs_financeiro);
        appendIfValid('cpf_motorista', this.motorista?.cpf);

        appendIfValid('cte_vinculado', this.cte?.Id_CTe);

        appendIfValid('arquivo_comprovante', this.arquivo_comprovante);

        appendIfValid('entrega_efetiva', this.entrega_efetiva ? formatDate(this.entrega_efetiva, 'yyyy-MM-dd') : null);

        // Método PUT, se necessário
        formData.append('_method', 'PUT');

        return formData;
      },

      async atualizaFreteCotacao() {

        const alertStore = useAlertStore()
        const loading = useLoadingStore()

        const formValidado = await this.validateForm();

        if(!formValidado.valid) {
          return;
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

          this.limpaCampos()
          this.closeDialog()

          const itemAtualizado = resposta?.data?.data
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
        return formatDate(date, 'dd/MM/yy')
      },

      formatarParaISO(dataBr) {
        const [dia, mes, ano] = dataBr.split('/');
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
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
