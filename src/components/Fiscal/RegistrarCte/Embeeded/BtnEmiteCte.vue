<template>
  <div>
    <v-btn
      color="cyan-darken-2"
      prepend-icon="mdi-file-plus"
      variant="tonal"
      density="compact"
      class="text-white"
      rounded="pill"
      @click="openDialog"
    >
      Emitir Cte
    </v-btn>

    <v-dialog v-model="dialogIsOpen" transition="dialog-bottom-transition" ref="dialogEmite" fullscreen>
      <v-card>
      <v-toolbar color="redNeveah">
        <v-btn
          icon="mdi-close"
          @click="dialogIsOpen = false"
        ></v-btn>

        <v-toolbar-title>Emitir CT-e</v-toolbar-title>

      </v-toolbar>

        <div class="d-flex justify-center ga-2 my-6">
          <v-btn prepend-icon="mdi-car" height="60" width="180">
            geral
          </v-btn>
          <v-btn prepend-icon="mdi-car" height="60" width="180">
            atores
          </v-btn>
          <v-btn prepend-icon="mdi-car" height="60" width="180">
            impostos
          </v-btn>
          <v-btn prepend-icon="mdi-car" height="60" width="180">
            documentos
          </v-btn>
          <v-btn prepend-icon="mdi-car" height="60" width="180">
            rodoviarios
          </v-btn>
        </div>

        <div class="d-flex">
          <v-container max-width="450">
            dados que irei preencher
          </v-container>
          <v-container class="bg-grey-lighten-4" >
            <v-form ref="formDados">
              <v-row class="my-3">
                <v-col cols="12" class="py-0">
                  <v-select
                    v-model="cfop"
                    bg-color="white"
                    :items="NaturezaOperacaoEnum"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="CFOP"
                    density="compact"
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row class="my-3">
                <v-col cols="4" class="py-0">
                  <v-select
                    v-model="finalidade"
                    bg-color="white"
                    :items="FinalidadeCteEnum"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="Finalidade CTE"
                    density="compact"
                    clearable
                  />
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-select
                    v-model="finalidade"
                    bg-color="white"
                    :items="TipoDeEmissaoCteEnum"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="Tipo de Emissão"
                    density="compact"
                    clearable
                  />
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-select
                    v-model="modalidade"
                    bg-color="white"
                    :items="ModalidadeEntregaEnum"
                    item-value="value"
                    item-title="text"
                    variant="outlined"
                    label="Modalidade"
                    density="compact"
                    clearable
                  />
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
                  <v-text-field bg-color="white" variant="outlined" label="Chave Pix" density="compact" v-model="pix" :rules="regraPix" clearable/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-select
                    bg-color="white"
                    v-model="uf_residencia"
                    variant="outlined"
                    density="compact"
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
                  <v-text-field bg-color="white" variant="outlined" label="Cidade Residência" density="compact" v-model="cidade_residencia" :rules="regraCidade" clearable/>
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
                    density="compact"
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
                    density="compact"
                    variant="outlined"
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <v-container max-width="450">
            Outros dados
          </v-container>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

// import ApiService from '@/services/ApiService';
// import { useAlertStore } from '@/stores/alertStore';
// import { endpoints } from '@/utils/apiEndpoints';
// import { useLoadingStore } from '@/stores/loading';
import { FinalidadeCteEnum } from '@/Enums/Fiscal/FinalidadeCteEnum'
import { ModalidadeEntregaEnum } from '@/Enums/Fiscal/ModalidadeEntregaEnum'
import { NaturezaOperacaoEnum } from '@/Enums/Fiscal/NaturezaOperacaoEnum'
import { TipoDeEmissaoCteEnum } from '@/Enums/Fiscal/TipoDeEmissaoCteEnum'

export default {
  name: 'BtnEmiteCte',
  data() {
    return {

      // enums
      TipoDeEmissaoCteEnum,
      FinalidadeCteEnum,
      NaturezaOperacaoEnum,
      ModalidadeEntregaEnum,

      dialogIsOpen: false,

      // dadosform
      cfop: null,
      natureza_operacao:  {

      },
      finalidade: { value: '0', text: '0 - Normal' },
      tipo: { value: '0', text: '0 - Normal' },
      modalidade: { value: '1', text: '1 - Rodoviário' },
    }
  },
  methods: {
    closeDialog() {
      this.dialogIsOpen = false
    },
    openDialog() {
      this.dialogIsOpen = true
    },
    // async criaCte() {

    //   const alertStore = useAlertStore()
    //   const loading = useLoadingStore()

    //   const formValidado = await this.validateForm();

    //   if(!formValidado.valid) {
    //     return;
    //   }

    //   const dadosParaEnvio = this.formataDadosParaEnvio();
    //   const url = endpoints.cte.novo;

    //   try {
    //     loading.show('Criando Cte...')
    //     const resposta =  await ApiService({
    //       method: 'post',
    //       url: url,
    //       data: dadosParaEnvio,
    //       headers: {
    //         'Content-Type': 'multipart/form-data', // importante!
    //       },
    //     });

    //     const arrayDeitens = resposta?.data?.data

    //     arrayDeitens.forEach((item) => {
    //       if(item.status == 'erro') {
    //         alertStore.addAlert(item?.mensagem, 'error')
    //         return
    //       }

    //       alertStore.addAlert(`CTE de ID ${item.cte.Id_CTe} Criado`, 'success')
    //       this.$emit('acrescentaODadoNoArrayLocalmente', item.cte)

    //     })
    //     this.limpaCampos()
    //     this.closeDialog()
    //   } finally {
    //     loading.hide()
    //   }
    // }
  }
}
</script>
