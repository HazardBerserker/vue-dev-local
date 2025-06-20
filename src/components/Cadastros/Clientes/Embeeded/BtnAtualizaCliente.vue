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

    <DialogCreateCadastro ref="dialogAtualiza" :max-width="900">
      <template #title>
        Atualizar Cliente
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
        <v-btn variant="flat" color="blue-darken-3" rounded="pill" @click="atualizaCliente">Atualizar</v-btn>
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
    name: 'BtnAtualizaCliente',
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
        razao_social: null,
        cnpj: null,
        endereco: null,
        cep: null,
        cidade: null,
        bairro: null,
        pais: null,
        uf: null,
        numero: null,
        ativo: null,
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
          this.$refs.dialogAtualiza.onCloseDialog();
        },
        openDialog() {
          this.$refs.dialogAtualiza.onOpenDialog();

          this.razao_social = this.item.razao_social
          this.cnpj = this.item.cnpj
          this.endereco = this.item.endereco
          this.cep = this.item.cep
          this.cidade = this.item.cidade
          this.bairro = this.item.bairro
          this.pais = this.item.pais
          this.uf = this.item.uf
          this.numero = this.item.numero
          this.ativo = this.item.ativo
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
            ativo: this.ativo
          }
          return dadosParaEnvio
        },
        async atualizaCliente() {

          const alertStore = useAlertStore()
          const loading = useLoadingStore()

          const formValidado = await this.validateForm();

          if(!formValidado.valid) {
            return;
          }

          const dadosParaEnvio = this.formataDadosParaEnvio();
          const url = `${endpoints.cliente.atualiza}/${this.item.id_cliente}`;

          try {
            loading.show('Atualizando Cliente...')
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
