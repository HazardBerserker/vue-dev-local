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
                  <InputText density="compact" label="Valor Motorista:" v-model="valor_motorista" prepend-inner-icon="R$" class="w-100" :rules="[s]"/>
                  <InputText density="compact" label="Valor NF:" v-model="valor_notafiscal" prepend-inner-icon="R$" class="w-100"/>
                </div>
                <div class="d-flex ga-4 text-start">
                  <InputText density="compact" label="Valor Cobrado:" v-model="valor_cobrado_efetivo" prepend-inner-icon="R$" class="w-100"/>
                  <v-text-field density="compact" variant="outlined" label="Coeficiente:" v-model="coeficiente_margem" class="w-100"></v-text-field>
                  <v-text-field density="compact" variant="outlined" label="Prazo de Entrega:" v-model="prazo" class="w-100"></v-text-field>
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
                  <v-text-field density="compact" variant="outlined" label="CTE Vinculado:"></v-text-field>
                  <v-select density="compact" variant="outlined" label="Forma de Pagamento:" :items="opcoesFormaPagamento" v-model="forma_pagamento" itemTitle="descricao" itemValue="valor"></v-select>
                  <!-- <div class="w-100"><strong>Data:</strong> 18/06/2025</div> -->
                </div>
                <div class="d-flex ga-4 text-start">
                  <v-text-field density="compact" variant="outlined" label="Escolha um Motorista:"></v-text-field>
                  <v-select density="compact" variant="outlined" label="Status da Cotação:" :items="opcoesStatus" v-model="status" itemTitle="descricao" itemValue="valor"></v-select>
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
                  <v-textarea density="compact" variant="outlined" label="Observações Cotação:" rows="2"></v-textarea>
                  <v-textarea density="compact" variant="outlined" label="Observações Financeiro:" rows="2"></v-textarea>
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
                  <v-select v-model="adiantamento" density="compact" variant="outlined" label="Adiantamento:" :items="opcoesSImENao" itemTitle="descricao" itemValue="valor"></v-select>
                  <v-select v-model="saldo" density="compact" variant="outlined" label="Saldo:" :items="opcoesSImENao" itemTitle="descricao" itemValue="valor"></v-select>
                  <v-select v-model="integral" density="compact" variant="outlined" label="Integral:" :items="opcoesSImENao" itemTitle="descricao" itemValue="valor"></v-select>
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
                  <v-text-field density="compact" variant="outlined" label="Entrega Efetiva:"></v-text-field>
                  <v-text-field density="compact" variant="outlined" label="Selecionar Comprovantes:"></v-text-field>
                </div>
              </div>
            </v-card>
          </v-col>

        </v-row>
        <!-- <v-row>
          <v-col>
            <v-row class="mb-3">
              <v-col cols="6" class="py-0">
                <v-text-field  variant="outlined" label="Razão Social" density="comfortable" v-model="razao_social" :rules="regraRazaoSocial" clearable/>
              </v-col>
              <v-col cols="6" class="py-0">
                <InputText label="CNPJ" v-model="cnpj" mask="##.###.###/####-##" :rules="regraCNPJ" counter="18"/>
              </v-col>
            </v-row>
            <v-row class="mb-3">
              <v-col cols="6" class="py-0">
                <v-text-field  variant="outlined" label="Endereço" density="comfortable" v-model="endereco" :rules="regraEndereco" clearable/>
              </v-col>
              <v-col cols="6" class="py-0">
                <InputText label="CEP" v-model="cep" mask="#####-###" :rules="regraCEP" counter="9"/>
              </v-col>
            </v-row>
            <v-row class="mb-3">
              <v-col cols="6" class="py-0">
                <v-text-field  variant="outlined" label="Cidade" density="comfortable" v-model="cidade" :rules="regraCidade" clearable/>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field variant="outlined" label="Bairro" density="comfortable" v-model="bairro" :rules="regraBairro" clearable/>
              </v-col>
            </v-row>
            <v-row class="mb-3">
              <v-col cols="6" class="py-0">
                <v-text-field  variant="outlined" label="País" density="comfortable" v-model="pais" :rules="regraPais" clearable/>
              </v-col>
              <v-col cols="6" class="py-0">
                <InputText label="UF" v-model="uf" :rules="regraUF" counter="2"/>
              </v-col>
            </v-row>
            <v-row class="mb-3">
              <v-col cols="6" class="py-0">
                <InputText label="Número" v-model="numero" :rules="regraNumero" type="number"/>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-select
                  v-model="ativo"
                  variant="outlined"
                  density="comfortable"
                  :items="opcaoAtivo"
                  label="Ativo"
                  item-value="valor"
                  item-title="descricao"
                  :rules="regraAtivo"
                  clearable>
                </v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row> -->
      </v-form>

      <template #action-button>
        <v-btn variant="flat" color="blue-darken-3" rounded="pill" @click="atualizaFreteCotacao">Atualizar</v-btn>
      </template>
    </DialogCreateCadastro>
  </div>
</template>

<script>

import DialogCreateCadastro from '@/components/Cadastros/Scaffold/DialogCreateCadastro.vue';
import ApiService from '@/services/ApiService';
import { useAlertStore } from '@/stores/alertStore';
import { endpoints } from '@/utils/apiEndpoints';
import InputText from '@/components/Form/InputText.vue';
import { useLoadingStore } from '@/stores/loading';
import { formataDataSomenteData } from '@/utils/masks';
// import { useAlertStore } from '@/stores/alertStore'
// import ApiService from '@/services/ApiService.js';

export default {
    name: 'BtnAtualizaFreteCotacoes',
    components: {
      DialogCreateCadastro,
      InputText
    },
    props: {
      item: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        formataDataSomenteData,
        id_frete: null,
        data_cotacao: null,
        id_remetente: null,
        remetente: null,
        cnpj_remetente: null,
        nome_destinatario: null,
        cidade_destinatario: null,
        uf_destinatario: null,
        valor_motorista: null,
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
      }
    },
    methods: {
        closeDialog() {
          this.$refs.dialogAtualiza.onCloseDialog();
        },
        openDialog() {
          this.$refs.dialogAtualiza.onOpenDialog();

          this.id_frete = this.item.id_frete
          this.data_cotacao = this.item.data_cotacao
          this.id_remetente = this.item.id_remetente
          this.remetente = this.item.remetente
          this.cnpj_remetente = this.item.cnpj_remetente
          this.nome_destinatario = this.item.nome_destinatario
          this.cidade_destinatario = this.item.cidade_destinatario
          this.uf_destinatario = this.item.uf_destinatario
          this.valor_motorista = this.item.valor_motorista
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
          // this.imposto_considerado = null
          this.valor_cobrado_efetivo = this.item.valor_cobrado_efetivo
          this.valor_cobrado = this.item.valor_cobrado
          this.prazo = this.item.prazo
        },
        validateForm() {
          return this.$refs.form.validate();
        },
        formataDadosParaEnvio() {
          const dadosParaEnvio = {
            razao_social: this.razao_social,
            cnpj: this.cnpj,
            endereco: this.endereco,
            cep: this.cep,
            cidade: this.cidade,
            bairro: this.bairro,
            pais: this.pais,
            uf: this.uf,
            numero: this.numero,
            ativo: this.ativo
          }
          return dadosParaEnvio
        },
        async atualizaFreteCotacao() {

          const alertStore = useAlertStore()
          const loading = useLoadingStore()

          const formValidado = await this.validateForm();

          if(!formValidado.valid) {
            return;
          }

          const dadosParaEnvio = this.formataDadosParaEnvio();
          const url = `${endpoints.frete.atualiza}/${this.item.id_frete}`;

          try {
            loading.show('Atualizando Frete/Cotação...')
            const resposta =  await ApiService({
              method: 'put',
              url: url,
              data: dadosParaEnvio
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
        }

    }
}
</script>
