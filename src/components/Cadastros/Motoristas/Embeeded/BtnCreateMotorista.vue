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
      :disabled="loading"
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
          <v-container fluid class="bg-grey-lighten-4">
            <v-form ref="formDados">
              <v-row class="my-3">
                <v-col cols="6" class="py-0">
                  <v-text-field bg-color="white" variant="outlined" label="Nome Completo" density="comfortable" v-model="nome_completo" :rules="regraNomeCompleto" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText bg-color="white" label="CPF" v-model="cpf" mask="###.###.###-##" :rules="regraCPF" counter="14"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <InputText bg-color="white" label="Telefone" v-model="telefone" mask="(##) #####.####" :rules="regraTelefone" counter="15"/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText bg-color="white" label="Placa Carro" v-model="placa_carro"  :rules="regraPlaca" counter="7"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <InputText bg-color="white" label="Placa Carreta" v-model="placa_carreta" counter="7"/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText bg-color="white" label="Tipo Veículo" v-model="tipo_veiculo"  :rules="regraTipoVeiculo"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <v-text-field bg-color="white" variant="outlined" label="Chave Pix" density="comfortable" v-model="pix" :rules="regraPix" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-select
                    bg-color="white"
                    v-model="uf_residencia"
                    variant="outlined"
                    density="comfortable"
                    :items="estadosBrasileiros"
                    label="UF"
                    item-value="value"
                    item-title="text"
                    :rules="regraUF"
                    clearable>
                  </v-select>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="6" class="py-0">
                  <v-text-field bg-color="white" variant="outlined" label="Cidade Residência" density="comfortable" v-model="cidade_residencia" :rules="regraCidade" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <InputText bg-color="white" label="CEP" v-model="cep_residencia" mask="#####-###" :rules="regraCEP" counter="9"/>
                </v-col>
              </v-row>
              <v-row class="mb-3">
                <v-col cols="12" class="py-0">
                  <v-select
                    bg-color="white"
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
                    bg-color="white"
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
          <v-container fluid class="bg-grey-lighten-4">
            <v-form ref="formArquivos">
              <v-row class="my-1">
                <v-col>
                  <v-file-input
                    bg-color="white"
                    v-model="arquivo_cnh"
                    accept="image/*"
                    density="comfortable"
                    clearable
                    prepend-icon="mdi-camera"
                    label="Selecionar CNH"
                    variant="outlined"
                    :show-size="1000"
                    color="redNeveah"
                    placeholder="Apenas imagens são válidas"
                    counter
                    :rules="regraArquivo"
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
                          +{{ arquivo_cnh.length - 2 }} Arquivo(s)
                        </span>
                      </template>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col>
                  <v-file-input
                    bg-color="white"
                    v-model="arquivo_comprovante_residencia"
                    accept="image/*"
                    density="comfortable"
                    clearable
                    prepend-icon="mdi-camera"
                    label="Selecionar Comprovante de Residência"
                    variant="outlined"
                    :show-size="1000"
                    color="redNeveah"
                    placeholder="Apenas imagens são válidas"
                    counter
                    :rules="regraArquivo"
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
                          +{{ arquivo_comprovante_residencia.length - 2 }} Arquivo(s)
                        </span>
                      </template>
                    </template>
                  </v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-file-input
                    bg-color="white"
                    v-model="arquivo_documento_carro"
                    accept="image/*"
                    density="comfortable"
                    clearable
                    prepend-icon="mdi-camera"
                    label="Selecionar Documento do Carro"
                    variant="outlined"
                    :show-size="1000"
                    color="redNeveah"
                    placeholder="Apenas imagens são válidas"
                    counter
                    :rules="regraArquivo"
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
                          +{{ arquivo_documento_carro.length - 2 }} Arquivo(s)
                        </span>
                      </template>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col>
                  <v-file-input
                    bg-color="white"
                    v-model="arquivo_antt"
                    accept="image/*"
                    density="comfortable"
                    clearable
                    prepend-icon="mdi-camera"
                    label="Selecionar ANTT"
                    variant="outlined"
                    :show-size="1000"
                    color="redNeveah"
                    placeholder="Apenas imagens são válidas"
                    counter
                    :rules="regraArquivo"
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
                          +{{ arquivo_antt.length - 2 }} Arquivo(s)
                        </span>
                      </template>
                    </template>
                  </v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-file-input
                    bg-color="white"
                    v-model="arquivo_foto_veiculo"
                    accept="image/*"
                    density="comfortable"
                    clearable
                    prepend-icon="mdi-camera"
                    label="Selecionar Foto do Veículo"
                    variant="outlined"
                    :show-size="1000"
                    color="redNeveah"
                    placeholder="Apenas imagens são válidas"
                    counter
                    :rules="regraArquivo"
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
                          +{{ arquivo_foto_veiculo.length - 2 }} Arquivo(s)
                        </span>
                      </template>
                    </template>
                  </v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-tabs-window-item>

      </v-tabs-window>

      <template #action-button>
        <v-btn variant="flat" color="green" rounded="pill" @click="criaMotorista">Criar</v-btn>
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
import { estadosBrasileiros } from '@/helpers/estadosHelper'
import { useLoadingStore } from '@/stores/loading';
import { appendIfValid } from '@/helpers/formHelpers';
// import { useAlertStore } from '@/stores/alertStore'
// import ApiService from '@/services/ApiService.js';

export default {
  name: 'BtnCreateMotorista',
  components: {
    DialogCreateCadastro,
    InputText
  },
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      estadosBrasileiros,
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
      regraPlaca: [
        (v) => !!v || 'A Placa é obrigatória',
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
      this.$refs.dialogCreate.onCloseDialog();
    },
    openDialog() {
      this.$refs.dialogCreate.onOpenDialog();
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

      appendIfValid(formData, 'nome_completo', this.nome_completo);
      appendIfValid(formData, 'cpf', this.cpf);
      appendIfValid(formData, 'telefone', this.telefone);
      appendIfValid(formData, 'placa_carro', this.placa_carro);
      appendIfValid(formData, 'placa_carreta', this.placa_carreta);
      appendIfValid(formData, 'tipo_veiculo', this.tipo_veiculo);
      appendIfValid(formData, 'pix', this.pix);
      appendIfValid(formData, 'uf_residencia', this.uf_residencia.toUpperCase());
      appendIfValid(formData, 'cidade_residencia', this.cidade_residencia);
      appendIfValid(formData, 'cep_residencia', this.cep_residencia);
      appendIfValid(formData, 'ativo', this.ativo);
      appendIfValid(formData, 'observacoes', this.observacoes);

      // Adiciona os arquivos, se existirem
      if (this.arquivo_cnh) {
        appendIfValid(formData, 'arquivo_cnh', this.arquivo_cnh);
      }
      if (this.arquivo_comprovante_residencia) {
        appendIfValid(formData, 'arquivo_comprovante_residencia', this.arquivo_comprovante_residencia);
      }
      if (this.arquivo_documento_carro) {
        appendIfValid(formData, 'arquivo_documento_carro', this.arquivo_documento_carro);
      }
      if (this.arquivo_antt) {
        appendIfValid(formData, 'arquivo_antt', this.arquivo_antt);
      }
      if (this.arquivo_foto_veiculo) {
        appendIfValid(formData, 'arquivo_foto_veiculo', this.arquivo_foto_veiculo);
      }

      return formData;
    },

    async criaMotorista() {

      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      const formValidado = await this.validarTudo();

      if(!formValidado) {
        alertStore.addAlert('Preencha os campos em Vermelho', 'warning')
        return;
      }

      const dadosParaEnvio = this.formataDadosParaEnvio();
      const url = endpoints.motorista.novo;

      try {
        loading.show('Criando Motorista...')
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
