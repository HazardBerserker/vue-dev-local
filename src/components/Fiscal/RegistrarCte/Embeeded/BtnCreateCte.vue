<template>
  <div>
    <v-btn
      color="light-green-darken-2"
      prepend-icon="mdi-file-import"
      variant="tonal"
      density="comfortable"
      class="text-white w-100"
      rounded="pill"
      @click="openDialog"
    >
      Registrar CTE
    </v-btn>

    <DialogCreateCadastro ref="dialogCreate" :max-width="900">
      <template #title>
        Registrar CTE
      </template>

      <template #subtitle>
        <span>Envie apenas arquivos XML para criação do(s) CTE(s)</span>
        <span class="text-body-2 text-grey"><em>Máximo de 200 XMLs por envio</em></span>
      </template>

      <v-form ref="form">
        <v-row>
          <v-col>
            <v-row class="mb-3">
              <v-col cols="12" class="py-0">
                <v-file-input
                  v-model="arquivosXml"
                  accept=".xml"
                  multiple
                  density="comfortable"
                  clearable
                  label="Selecione o(s) arquivo(s) XML(s)"
                  variant="outlined"
                  :show-size="1000"
                  color="redNeveah"
                  placeholder="Apenas imagens são válidas"
                  counter
                  :rules="regrasXml"
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
                        +{{ arquivosXml.length - 2 }} Arquivo(s)
                      </span>
                    </template>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>

      <template #action-button>
        <v-btn variant="flat" color="green" rounded="pill" @click="criaCte">Registrar</v-btn>
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

export default {
  name: 'BtnCreateCte',
  components: {
    DialogCreateCadastro,
  },
  data() {
    return {
      limite: 200,
      arquivosXml: null,
      regrasXml: [
        (files) => {
          if (Array.isArray(files) && files.length > this.limite) {
            const alertStore = useAlertStore()
            alertStore.addAlert(`Você só pode selecionar até ${this.limite} arquivos.`, 'warning')
            return `Você só pode selecionar até ${this.limite} arquivos.`
          }
          return true
        },
        (v) => v?.length > 0 || 'Você deve selecionar pelo menos um arquivo XML',
        (v) =>
          v?.every(file => file.name.endsWith('.xml')) ||
          'Todos os arquivos devem ter extensão .xml',
      ]
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
      this.arquivosXml = null
    },
    formataDadosParaEnvio() {

      const formData = new FormData();

      // Adiciona os arquivos, se existirem
      if (this.arquivosXml.length > 0) {
        this.arquivosXml.forEach((arquivo) => {
          formData.append('arquivos_xml[]', arquivo)
        })
      }

      return formData;
    },

    async criaCte() {

      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      const formValidado = await this.validateForm();

      if(!formValidado.valid) {
        return;
      }

      const dadosParaEnvio = this.formataDadosParaEnvio();
      const url = endpoints.cte.novo;

      try {
        loading.show('Criando Cte...')
        const resposta =  await ApiService({
          method: 'post',
          url: url,
          data: dadosParaEnvio,
          headers: {
            'Content-Type': 'multipart/form-data', // importante!
          },
        });

        const arrayDeitens = resposta?.data?.data

        arrayDeitens.forEach((item) => {
          if(item.status == 'erro') {
            alertStore.addAlert(item?.mensagem, 'error')
            return
          }

          alertStore.addAlert(`CTE de ID ${item.cte.Id_CTe} Criado`, 'success')
          this.$emit('acrescentaODadoNoArrayLocalmente', item.cte)

        })
        this.limpaCampos()
        this.closeDialog()
      } finally {
        loading.hide()
      }
    }
  }
}
</script>
