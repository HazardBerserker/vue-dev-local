<template>
  <div>
    <v-btn
      color="light-green-darken-2"
      prepend-icon="mdi-plus"
      variant="tonal"
      density="comfortable"
      class="text-white"
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
        <span>Envie o Arquivo XML para Registrar o CTE</span>
      </template>

      <v-form ref="form">
        <v-row>
          <v-col>
            <v-row class="mb-3">
              <v-col cols="12" class="py-0">
                <v-file-input
                  v-model="arquivosXml"
                  label="Selecione imagens"
                  :rules="regrasXml"
                  accept=".xml"
                  multiple
                  show-size
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>

      <template #action-button>
        <v-btn variant="flat" color="green" rounded="pill" @click="criaCte">Criar Cte</v-btn>
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
      arquivosXml: null,
      regrasXml: [
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
      this.xml = null
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

        console.log(resposta);
        const arrayDeitens = resposta?.data?.data


        arrayDeitens.forEach((item) => {
          if(item.status == 'erro') {
            alertStore.addAlert(item?.mensagem, 'error')
            return
          }

          alertStore.addAlert(`CTE de ID ${item.cte.Id_CTe} Criado`, 'success')
          this.$emit('acrescentaODadoNoArrayLocalmente', item.cte)

        })
        console.log(arrayDeitens);




        this.limpaCampos()
        this.closeDialog()
      } finally {
        loading.hide()
      }
    }
  }
}
</script>
