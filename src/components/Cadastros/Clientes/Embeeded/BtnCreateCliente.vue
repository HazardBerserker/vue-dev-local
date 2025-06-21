<template>
  <div>
    <v-btn
      color="green-darken-2"
      prepend-icon="mdi-plus"
      variant="tonal"
      density="comfortable"
      class="text-white"
      rounded="pill"
      @click="openDialog"
    >
      Criar cliente
    </v-btn>

    <DialogCreateCadastro ref="dialogCreate" :max-width="900">
      <template #title>
        Criar Cliente
      </template>

      <template #subtitle>
          <span>Todos os campos são obrigatórios</span>
          <div class="d-flex flex-column ga-2">
            <v-btn
              variant="flat"
              color="blue-darken-3"
              rounded="pill"
              prepend-icon="mdi-sync"
              :disabled="cnpj?.length != 14 ? true : false"
              @click="preencheDadosDoClienteAutomaticamente">Preenchimento automatico
            </v-btn>
            <span class="text-caption text-center">
              Preencha o CNPJ para ativar essa funcionalidade
            </span>
          </div>
      </template>

      <v-form ref="form">
        <v-row>
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
                <v-text-field  variant="outlined" label="Logradouro" density="comfortable" v-model="logradouro" :rules="regraEndereco" clearable/>
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
        </v-row>
      </v-form>

      <template #action-button>
        <v-btn variant="flat" color="green" rounded="pill" @click="criaCliente">Criar Cliente</v-btn>
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
// import { useAlertStore } from '@/stores/alertStore'
// import ApiService from '@/services/ApiService.js';

export default {
    name: 'BtnCreateCliente',
    components: {
      DialogCreateCadastro,
      InputText
    },
    data() {
      return {
        razao_social: null,
        cnpj: null,
        logradouro: null,
        cep: null,
        cidade: null,
        bairro: null,
        pais: null,
        uf: null,
        numero: null,
        ativo: 1,
        opcaoAtivo:[
          { valor: 1, descricao: 'Sim' },
          { valor: 0, descricao: 'Não' }
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
          (v) => typeof v === 'string' || 'O UF deve ser um texto',
          (v) => /^[A-Za-z]{2}$/.test(v) || 'O UF deve conter exatamente 2 letras (sem números ou símbolos)',
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
          this.$refs.dialogCreate.onCloseDialog();
        },
        openDialog() {
          this.$refs.dialogCreate.onOpenDialog();
        },
        validateForm() {
          return this.$refs.form.validate();
        },
        limpaCampos() {
          this.razao_social = null,
          this.cnpj = null,
          this.logradouro = null,
          this.cep = null,
          this.cidade = null,
          this.bairro = null,
          this.pais = null,
          this.uf = null,
          this.numero = null,
          this.ativo = 1
        },
        formataDadosParaEnvio() {
          const dadosParaEnvio = {
            razao_social: this.razao_social,
            cnpj: this.cnpj,
            endereco: this.logradouro,
            cep: this.cep,
            cidade: this.cidade,
            bairro: this.bairro,
            pais: this.pais,
            uf: this.uf.toUpperCase(),
            numero: this.numero,
            ativo: this.ativo
          }
          return dadosParaEnvio
        },

        async preencheDadosDoClienteAutomaticamente() {

          const loading = useLoadingStore()
          const alertStore = useAlertStore()

          const url = `${endpoints.cliente.buscaClienteNaApiDoGoverno}/${this.cnpj}`;

          try {
            loading.show('Buscando dados...')
            const resposta =  await ApiService({
              method: 'post',
              url: url,
            });

            this.preencheDadosEncontrados(resposta?.data?.data)
            alertStore.addAlert('Dados preenchidos automaticamente', 'info')


          } catch (erro) {
            alertStore.addAlert(erro.response?.data?.message, 'error')
          } finally {
            loading.hide()
          }

        },
        preencheDadosEncontrados(clienteEncontrado) {
          this.bairro = clienteEncontrado.bairro
          this.cep = clienteEncontrado.cep
          this.logradouro = clienteEncontrado.logradouro
          this.razao_social = clienteEncontrado.nome
          this.numero = clienteEncontrado.numero
          this.uf = clienteEncontrado.uf
          this.cidade = clienteEncontrado.municipio
          this.pais = 'Brasil'
        },

        async criaCliente() {

          const alertStore = useAlertStore()
          const loading = useLoadingStore()

          const formValidado = await this.validateForm();

          if(!formValidado.valid) {
              return;
          }

          const dadosParaEnvio = this.formataDadosParaEnvio();
          const url = endpoints.cliente.novo;

          try {
            loading.show('Criando Cliente...')
            const resposta =  await ApiService({
              method: 'post',
              url: url,
              data: dadosParaEnvio
            });

            alertStore.addAlert(resposta?.data.message, 'success')

            this.limpaCampos()
            this.closeDialog()

            const itemCriado = resposta?.data?.data
            this.$emit('acrescentaODadoNoArrayLocalmente', itemCriado)
          } catch (erro) {
            alertStore.addAlert(erro.response?.data?.message, 'error')
          } finally {
            loading.hide()
          }
        }

    }
}
</script>
