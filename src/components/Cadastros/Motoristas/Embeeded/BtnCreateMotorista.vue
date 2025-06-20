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
      Criar motorista
    </v-btn>

    <DialogCreateCadastro ref="dialogCreate" :max-width="900">
      <template #title>
        Criar Motorista
      </template>

      <template #subtitle>
          <div class="w-100">
            <v-tabs
              v-model="tab"
              align-tabs="center"
              color="redNeveah"
            >
              <v-tab :value="1">Dados do Motorista</v-tab>
              <v-tab :value="2">Arquivos</v-tab>
            </v-tabs>
          </div>
      </template>

      <v-tabs-window v-model="tab">

        <v-tabs-window-item :value="1">
          <v-container fluid>
            <v-form ref="formDados">
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <v-text-field  variant="outlined" label="Nome Completo" density="comfortable" v-model="nome_completo" :rules="regraNomeCompleto" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText label="CPF" v-model="cpf" mask="###.###.###-##" :rules="regraCPF" counter="14"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <InputText label="Telefone" v-model="telefone" mask="(##) #####.####" :rules="regraTelefone" counter="15"/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText label="Placa Carro" v-model="placa_carro"  :rules="regraPlaca" counter="7"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <InputText label="Placa Carreta" v-model="placa_carreta"  :rules="regraPlaca" counter="7"/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText label="Tipo Veículo" v-model="tipo_veiculo"  :rules="regraTipoVeiculo"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <v-text-field  variant="outlined" label="Chave Pix" density="comfortable" v-model="pix" :rules="regraPix" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field variant="outlined" label="UF Residência" density="comfortable" v-model="uf_residencia" :rules="regraUF" clearable/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <v-text-field  variant="outlined" label="Cidade Residência" density="comfortable" v-model="cidade_residencia" :rules="regraCidade" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field  variant="outlined" label="CEP Residência" density="comfortable" v-model="cep_residencia" :rules="regraCEP" clearable/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="12" class="py-0">
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
            </v-form>
          </v-container>
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <v-container fluid>
            <v-form ref="formArquivos">
              <v-row>
                <v-col>
                  <v-file-input density="comfortable" clearable prepend-icon="mdi-camera" label="Selecionar CNH" variant="outlined"></v-file-input>
                </v-col>
                <v-col>
                  <v-file-input density="comfortable" clearable  prepend-icon="mdi-camera" label="Selecionar Comprovante de Residência" variant="outlined"></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-file-input density="comfortable" clearable prepend-icon="mdi-camera" label="Selecionar Documento do Carro" variant="outlined"></v-file-input>
                </v-col>
                <v-col>
                  <v-file-input density="comfortable" clearable  prepend-icon="mdi-camera" label="Selecionar ANTT" variant="outlined"></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-file-input density="comfortable" clearable prepend-icon="mdi-camera" label="Selecionar Foto do Veículo" variant="outlined"></v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-tabs-window-item>

      </v-tabs-window>

      <template #action-button>
        <v-btn variant="flat" color="green" rounded="pill" @click="criaMotorista">Criar Motorista</v-btn>
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
    name: 'BtnCreateMotorista',
    components: {
      DialogCreateCadastro,
      InputText
    },
    data() {
      return {
        tab: null,
        nome_completo: null,
        cpf: null,
        telefone: null,
        placa_carro: null,
        placa_carreta: null,
        tipo_veiculo: null,
        pix: null,
        uf_residencia: null,
        cidade_residencia: null,
        cep_residencia: null,
        ativo: 1,
        opcaoAtivo:[
          { valor: 1, descricao: 'Sim' },
          { valor: 0, descricao: 'Não' }
        ],
        regraNomeCompleto: [
          (v) => !!v || 'O Nome é obrigatório',
        ],
        regraTelefone: [
          (v) => !!v || 'O Telefone é obrigatório',
        ],
        regraCPF: [
          (v) => !!v || 'O CPF é obrigatório',
        ],
        regraPlaca: [
          (v) => !!v || 'A Placa é obrigatória',
        ],
        regraCEP: [
          (v) => !!v || 'O CEP é obrigatório',
        ],
        regraCidade: [
          (v) => !!v || 'A Cidade é obrigatória',
        ],
        regraTipoVeiculo: [
          (v) => !!v || 'O Tipo do Veículo é obrigatório',
        ],
        regraPix: [
          (v) => !!v || 'A Chave Pix é obrigatória',
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
          this.nome_completo = null
          this.cpf = null
          this.telefone = null
          this.placa_carro = null
          this.placa_carreta = null
          this.tipo_veiculo = null
          this.pix = null
          this.uf_residencia = null
          this.cidade_residencia = null
          this.cep_residencia = null
          this.ativo = 1
        },
        formataDadosParaEnvio() {
          const dadosParaEnvio = {
            nome_completo: this.nome_completo,
            cpf: this.cpf,
            telefone: this.telefone,
            placa_carro: this.placa_carro,
            placa_carreta: this.placa_carreta,
            tipo_veiculo: this.tipo_veiculo,
            pix: this.pix,
            uf_residencia: this.uf_residencia,
            cidade_residencia: this.cidade_residencia,
            cep_residencia: this.cep_residencia,
            ativo: this.ativo
          }
          return dadosParaEnvio
        },

        async criaMotorista() {

          const alertStore = useAlertStore()
          const loading = useLoadingStore()

          const formValidado = await this.validateForm();

          if(!formValidado.valid) {
              return;
          }

          const dadosParaEnvio = this.formataDadosParaEnvio();
          const url = endpoints.motorista.novo;

          try {
            loading.show('Criando Motorista...')
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
