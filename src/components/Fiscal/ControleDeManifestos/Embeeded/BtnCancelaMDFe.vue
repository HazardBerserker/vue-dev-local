<template>
  <div>
    <v-btn
      color="red-darken-3"
      prepend-icon="mdi-file-plus"
      variant="tonal"
      density="compact"
      class="text-white w-100"
      rounded="pill"
      :disabled="disabled"
      @click="openDialog"
    >
      Cancelar MDFE
    </v-btn>

    <v-dialog v-model="dialogIsOpen" transition="dialog-bottom-transition" ref="dialogEmite" max-width="600">
      <v-card >
        <v-toolbar color="redNeveah">
          <v-btn
            icon="mdi-close"
            @click="dialogIsOpen = false"
          ></v-btn>
          <v-toolbar-title>Cancelar MDF-e</v-toolbar-title>
        </v-toolbar>

        <div class="d-flex justify-center align-center ga-2 pt-4 mx-auto px-2 w-100 bg-grey-lighten-4">
          <v-textarea
            bg-color="white"
            v-model="justificativa"
            label="Justificativa do Cancelamento"
            variant="outlined"
          />
        </div>

        <v-card-actions>
          <v-btn variant="flat" color="red-darken-3" @click="cancela">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>

import { StatusManifestoEnumDescricao } from '@/Enums/Fiscal/StatusManifestoEnum';
import ApiService from '@/services/ApiService';
import { useAlertStore } from '@/stores/alertStore';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import { inject } from 'vue';

export default {
  name: 'BtnCancelaMDFe',
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    mdfe: {
      type: Object,
      required: true
    },
    mdfes_autorizados: {
      type: Number,
      required: true
    },
    mdfes_cancelados: {
      type: Number,
      required: true
    },
    mdfes_finalizados: {
      type: Number,
      required: true
    },
    itensSelecionados: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      StatusManifestoEnumDescricao,

      dialogIsOpen: false,
      justificativa: null
    }
  },
  created() {
    this.dialog = inject('dialog')
  },
  computed: {
    mdfes_autorizadosLocal: {
      get() {
        return this.mdfes_autorizados
      },
      set(novoDado) {
        this.$emit('update:mdfes_autorizados', novoDado)
      }
    },
    mdfes_canceladosLocal: {
      get() {
        return this.mdfes_cancelados
      },
      set(novoDado) {
        this.$emit('update:mdfes_cancelados', novoDado)
      }
    },
    mdfes_finalizadosLocal: {
      get() {
        return this.mdfes_finalizados
      },
      set(novoDado) {
        this.$emit('update:mdfes_finalizados', novoDado)
      }
    },
    mdfeLocal: {
      get() {
        return this.mdfe
      },
      set(novoDado) {
        this.$emit('update:mdfeLocal', novoDado)
      }
    },
    itensSelecionadosLocal: {
      get() {
        return this.itensSelecionados
      },
      set(novoDado) {
        this.$emit('update:itensSelecionados', novoDado)
      }
    },

  },
  methods: {
    async openDialog() {
      this.dialogIsOpen = true
    },

    formataDadosParaEnvio() {
      const dadosParaEnvio = {
        Id_MDFE: this.mdfe.Id_MDFE,
        justificativa: this.justificativa,
        chave: this.mdfe.chaveMDFe
      }
      return dadosParaEnvio
    },

    async cancela() {

      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      if(!this.justificativa) {
        alertStore.addAlert('A Justificativa deve ser preenchida e ter no mínimo 15 caracteres', 'warning');
        return
      }

      const mensagem = `
        Deseja realmente Cancelar o MDF-e de ID <strong>${this.mdfe?.Id_MDFE}</strong> ? <br>
        Essa Ação não pode ser desfeita.
      `

      const confirmado = await this.dialog.value.open({
        title: `Cancelar MDF-e`,
        message: mensagem,
        titleColor: 'error'
      })

      if(!confirmado) return



      const dadosParaEnvio = this.formataDadosParaEnvio()

      console.log(dadosParaEnvio);

      loading.show('Cancelando MDF-e...')
      const url = `${endpoints.mdfe.cancela}`;

      try {
        const resposta =  await ApiService({
          method: 'post',
          url: `${url}`,
          data: dadosParaEnvio
        })

        alertStore.addAlert(
          `${resposta?.data?.message}`,
          'success'
        );

        if(this.mdfe.status == StatusManifestoEnumDescricao.AUTORIZADO) {
          this.mdfes_autorizadosLocal -= 1
        }

        if(this.mdfe.status == StatusManifestoEnumDescricao.FINALIZADO) {
          this.mdfes_finalizadosLocal -= 1
        }

        this.mdfeLocal.status = StatusManifestoEnumDescricao.CANCELADO
        this.mdfes_canceladosLocal += 1

        this.itensSelecionadosLocal = [];
        this.mdfeLocal = {};

      } catch (error) {
        alertStore.addAlert(`Erro ao Cancelar MDF-e: ${error?.response?.data?.message}`, 'error');
      } finally {
        loading.hide()
      }
    },
  }
}
</script>
