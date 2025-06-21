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
        Atualizar Motorista
      </template>

      <template #subtitle>
          <div class="w-100">
            <v-tabs
              v-model="tab"
              align-tabs="center"
              color="redNeveah"
            >
              <v-tab :value="1">
                <div>
                  <v-badge v-if="numeroDeErrosFormDados" :content="numeroDeErrosFormDados" color="red" floating>
                    Dados
                  </v-badge>
                  <span v-else>Dados</span>
                </div>
              </v-tab>
              <v-tab :value="2">
                <div>
                  <v-badge v-if="numeroDeErrosFormArquivos" :content="numeroDeErrosFormArquivos" color="red" floating>
                    Arquivos
                  </v-badge>
                  <span v-else>Arquivos</span>
                </div>
              </v-tab>
            </v-tabs>
          </div>
      </template>

      <v-tabs-window v-model="tab">

        <v-tabs-window-item :value="1" eager>
          <v-container fluid>
            <v-form ref="formDados">
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <v-text-field variant="outlined" label="Nome Completo" density="comfortable" v-model="nome_completo" :rules="regraNomeCompleto" clearable/>
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
                  <v-text-field variant="outlined" label="Chave Pix" density="comfortable" v-model="pix" :rules="regraPix" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText label="UF" v-model="uf_residencia" :rules="regraUF" counter="2"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <v-text-field variant="outlined" label="Cidade Residência" density="comfortable" v-model="cidade_residencia" :rules="regraCidade" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText label="CEP" v-model="cep_residencia" mask="#####-###" :rules="regraCEP" counter="9"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="12" class="py-0">
                  <v-select
                    ref="ativo"
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
              <v-row class="mb-3">
                <v-col cols="12" class="py-0">
                  <v-textarea
                    v-model="observacoes"
                    label="Observações"
                    density="comfortable"
                    variant="outlined"
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-tabs-window-item>

        <v-tabs-window-item :value="2" eager>
          <v-container fluid>
            <v-form ref="formArquivos">
              <v-row>
                <v-col>
                  <v-file-input v-model="arquivo_cnh"  density="comfortable" clearable prepend-icon="mdi-camera" label="Selecionar CNH" variant="outlined"></v-file-input>
                </v-col>
                <v-col>
                  <v-file-input v-model="arquivo_comprovante_residencia"  density="comfortable" clearable  prepend-icon="mdi-camera" label="Selecionar Comprovante de Residência" variant="outlined"></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-file-input v-model="arquivo_documento_carro" density="comfortable" clearable prepend-icon="mdi-camera" label="Selecionar Documento do Carro" variant="outlined"></v-file-input>
                </v-col>
                <v-col>
                  <v-file-input v-model="arquivo_antt" density="comfortable" clearable  prepend-icon="mdi-camera" label="Selecionar ANTT" variant="outlined"></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-file-input v-model="arquivo_foto_veiculo"  density="comfortable" clearable prepend-icon="mdi-camera" label="Selecionar Foto do Veículo" variant="outlined"></v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-tabs-window-item>

      </v-tabs-window>

      <template #action-button>
        <v-btn variant="flat" color="blue-darken-3" rounded="pill" @click="atualizaMotorista">Atualizar</v-btn>
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
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      numeroDeErrosFormDados: 0,
      numeroDeErrosFormArquivos: 0,
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
      arquivo_cnh: null,
      arquivo_comprovante_residencia: null,
      arquivo_documento_carro: null,
      arquivo_antt: null,
      arquivo_foto_veiculo: null,
      observacoes: null,
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
        (v) => (v && v.length === 14) || 'O CPF deve ter 14 caracteres (incluindo pontos e traço)',
      ],
      regraPlaca: [
        (v) => !!v || 'A Placa é obrigatória',
      ],
      regraCEP: [
        (v) => !!v || 'O CEP é obrigatório',
        (v) => (v && v.length === 9) || 'O CEP deve ter 9 caracteres (incluindo pontos e traço)',
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
        (v) => typeof v === 'string' || 'O UF deve ser um texto',
        (v) => /^[A-Za-z]{2}$/.test(v) || 'O UF deve conter exatamente 2 letras (sem números ou símbolos)',
      ],
      regraNumero: [
        (v) => !!v || 'O Número é obrigatório',
      ],
      regraAtivo: [
        (v) => v !== null && v !== undefined || 'O Campo Ativo é obrigatório',
      ],
      regraArquivo: [
        (v) => v !== null && v !== undefined || 'O Arquivo é obrigatório',
      ],
    }
  },
  methods: {
    closeDialog() {
      this.$refs.dialogAtualiza.onCloseDialog();
    },
    openDialog() {
      this.$refs.dialogAtualiza.onOpenDialog();

      console.log(this.item);
      this.nome_completo = this.item.nome_completo
      this.cpf = this.item.cpf
      this.telefone = this.item.telefone
      this.placa_carro = this.item.placa_carro
      this.placa_carreta = this.item.placa_carreta
      this.tipo_veiculo = this.item.tipo_veiculo
      this.pix = this.item.pix
      this.uf_residencia = this.item.uf_residencia
      this.cidade_residencia = this.item.cidade_residencia
      this.cep_residencia = this.item.cep_residencia
      this.observacoes = this.item.observacoes
      this.ativo = this.item.ativo
    },

    async validarTudo() {
      const formDados = await this.$refs.formDados?.validate() ?? false;
      this.numeroDeErrosFormDados = formDados?.errors.length

      const formArquivos = await this.$refs.formArquivos?.validate();

      this.numeroDeErrosFormArquivos = formArquivos?.errors.length

      if (formDados.valid && formArquivos.valid ) {
        return true;
      }

      return false;
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
      this.arquivo_cnh = null,
      this.arquivo_comprovante_residencia = null,
      this.arquivo_documento_carro = null,
      this.arquivo_antt = null,
      this.arquivo_foto_veiculo = null,
      this.observacoes = null,
      this.ativo = 1
    },
    formataDadosParaEnvio() {
      const formData = new FormData();

      formData.append('nome_completo', this.nome_completo);
      formData.append('cpf', this.cpf);
      formData.append('telefone', this.telefone);
      formData.append('placa_carro', this.placa_carro);
      formData.append('placa_carreta', this.placa_carreta);
      formData.append('tipo_veiculo', this.tipo_veiculo);
      formData.append('pix', this.pix);
      formData.append('uf_residencia', this.uf_residencia);
      formData.append('cidade_residencia', this.cidade_residencia);
      formData.append('cep_residencia', this.cep_residencia);
      formData.append('ativo', this.ativo);
      formData.append('observacoes', this.observacoes);

      // Adiciona os arquivos, se existirem
      if (this.arquivo_cnh) {
        formData.append('arquivo_cnh', this.arquivo_cnh);
      }
      if (this.arquivo_comprovante_residencia) {
        formData.append('arquivo_comprovante_residencia', this.arquivo_comprovante_residencia);
      }
      if (this.arquivo_documento_carro) {
        formData.append('arquivo_documento_carro', this.arquivo_documento_carro);
      }
      if (this.arquivo_antt) {
        formData.append('arquivo_antt', this.arquivo_antt);
      }
      if (this.arquivo_foto_veiculo) {
        formData.append('arquivo_foto_veiculo', this.arquivo_foto_veiculo);
      }
      formData.append('_method', 'PUT');

      return formData;
    },

    async atualizaMotorista() {

      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      const formValidado = await this.validarTudo();

      if(!formValidado) {
          return;
      }

      const dadosParaEnvio = this.formataDadosParaEnvio();
      const url = `${endpoints.motorista.atualiza}/${this.item.id_motorista}`

      try {
        loading.show('Atualizando Motorista...')
        const resposta =  await ApiService({
          method: 'post',
          url: url,
          data: dadosParaEnvio,
          headers: {
            'Content-Type': 'multipart/form-data', // importante!
          },
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
