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
      Cancelar CTE
    </v-btn>

    <v-dialog v-model="dialogIsOpen" transition="dialog-bottom-transition" ref="dialogEmite" max-width="600">
      <v-card >
        <v-toolbar color="redNeveah">
          <v-btn
            icon="mdi-close"
            @click="dialogIsOpen = false"
          ></v-btn>
          <v-toolbar-title>Cancelar CT-e</v-toolbar-title>
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

import { StatusCteEnumDescricao } from '@/Enums/Fiscal/StatusCteEnum';
import ApiService from '@/services/ApiService';
import { useAlertStore } from '@/stores/alertStore';
import { useLoadingStore } from '@/stores/loading';
import { endpoints } from '@/utils/apiEndpoints';
import { inject } from 'vue';

export default {
  name: 'BtnCancelaCte',
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    cte: {
      type: Object,
      required: true
    },
    ctes_finalizados: {
      type: Number,
      required: true
    },
    ctes_autorizados: {
      type: Number,
      required: true
    },
    ctes_cancelados: {
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
      dialogIsOpen: false,
      justificativa: null
    }
  },
  created() {
    this.dialog = inject('dialog')
  },
  computed: {
    ctes_finalizadosLocal: {
      get() {
        return this.ctes_finalizados
      },
      set(novoDado) {
        this.$emit('update:ctes_finalizados', novoDado)
      }
    },
    ctes_autorizadosLocal: {
      get() {
        return this.ctes_autorizados
      },
      set(novoDado) {
        this.$emit('update:ctes_autorizados', novoDado)
      }
    },
    ctes_canceladosLocal: {
      get() {
        return this.ctes_cancelados
      },
      set(novoDado) {
        this.$emit('update:ctes_cancelados', novoDado)
      }
    },
    cteLocal: {
      get() {
        return this.cte
      },
      set(novoDado) {
        this.$emit('update:cteLocal', novoDado)
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
        Id_CTe: this.cte.Id_CTe,
        justificativa: this.justificativa,
        chave: this.cte.chCTe
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
        Deseja realmente Cancelar o CT-e de ID <strong>${this.cte?.Id_CTe}</strong> ? <br>
        Essa Ação não pode ser desfeita.
      `

      const confirmado = await this.dialog.value.open({
        title: `Cancelar CT-e`,
        message: mensagem,
        titleColor: 'error'
      })

      if(!confirmado) return

      const dadosParaEnvio = this.formataDadosParaEnvio()

      loading.show('Cancelando CT-e...')
      const url = `${endpoints.cte.cancela}`;

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

        if(this.mdfe.status == StatusCteEnumDescricao.AUTORIZADO) {
          this.ctes_autorizadosLocal -= 1
        }

        if(this.mdfe.status == StatusCteEnumDescricao.FINALIZADO) {
          this.ctes_finalizadosLocal -= 1
        }

        this.mdfeLocal.status = StatusCteEnumDescricao.CANCELADO
        this.ctes_canceladosLocal += 1

        this.itensSelecionadosLocal = [];
        this.cteLocal = {};

      } catch (error) {
        alertStore.addAlert(`Erro ao Cancelar CT-e: ${error?.response?.data?.message}`, 'error');
      } finally {
        loading.hide()
      }
    },
  }
}
</script>
