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
        Todos os campos são obrigatórios
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
                <v-text-field
                  v-model="numero"
                  variant="outlined"
                  label="Número"
                  density="comfortable"
                  :rules="regraNumero"
                  clearable
                />
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
    name: 'BtnClienteCreate',
    components: {
      DialogCreateCadastro,
      InputText
    },
    data() {
      return {
        razao_social: null,
        cnpj: null,
        endereco: null,
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
        ],
        regraEndereco: [
          (v) => !!v || 'O Endereço é obrigatório',
        ],
        regraCEP: [
          (v) => !!v || 'O CEP é obrigatório',
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
          this.endereco = null,
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
            endereco: this.endereco,
            cep: this.cep,
            cidade: this.cidade,
            bairro: this.bairro,
            pais: this.pais,
            uf: this.uf,
            numero: this.numero,
            ativo: 1
          }
          return dadosParaEnvio
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

          console.log(dadosParaEnvio)

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
            console.log(resposta);

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
