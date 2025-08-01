<template>
  <v-form class="bg-grey-lighten-4 border elevation-2 pa-6" ref="formDadosGeral">
    <v-row class="my-3">
      <v-col cols="8" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.cfop"
          bg-color="white"
          :items="NaturezaOperacaoEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="CFOP *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="4" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.classificacao_tributaria"
          bg-color="white"
          :items="ClassificacaoTributariaEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Classificação Tributária *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
    </v-row>
    <v-row class="my-3">
      <v-col cols="12" md="4" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.finalidade"
          bg-color="white"
          :items="FinalidadeCteEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Finalidade CTE *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.tipo"
          bg-color="white"
          :items="TipoDeEmissaoCteEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Tipo de Emissão *"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.modalidade"
          bg-color="white"
          :items="ModalidadeEntregaEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Modalidade *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
    </v-row>
    <v-row class="my-3">
      <v-col cols="12" md="2" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.local_inicio_prestacao.uf"
          bg-color="white"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF Origem *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.local_inicio_prestacao.cidade"
          no-data-text="Primeiro selecione uma UF..."
          bg-color="white"
          :items="municipiosDoEstadoSelecionado(dadosFormGeral.local_inicio_prestacao.uf)"
          item-value="value"
          item-title="description"
          variant="outlined"
          label="Município Origem *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.local_termino_prestacao.uf"
          bg-color="white"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF Destino *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4" class="py-2">
        <v-select
          v-model="dadosFormGeralLocal.local_termino_prestacao.cidade"
          no-data-text="Primeiro selecione uma UF..."
          bg-color="white"
          :items="municipiosDoEstadoSelecionado(dadosFormGeral.local_termino_prestacao.uf)"
          item-value="value"
          item-title="description"
          variant="outlined"
          label="Município Destino *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" class="py-2">
        <v-text-field
          v-model="dadosFormGeralLocal.rntrc"
          label="RNTRC *"
          density="compact"
          variant="outlined"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          clearable
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          Serviço
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row class="my-3">
      <v-col cols="12" md="2" class="py-2">
        <InputTextMoeda
          prefix="R$"
          v-model="dadosFormGeralLocal.servico.componentes.FRETE_PESO"
          label="Frete Peso *"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          @update:modelValue="verificaSeLimpouCampo()"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2" class="py-2">
        <InputTextMoeda
          v-model="dadosFormGeralLocal.servico.componentes.PESO_CUBADO"
          label="Peso Cubado *"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          @update:modelValue="verificaSeLimpouCampo()"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2" class="pt-2">
        <InputTextMoeda
          prefix="R$"
          v-model="dadosFormGeralLocal.servico.componentes.advalorem"
          label="Advalorem *"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          @update:modelValue="verificaSeLimpouCampo()"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <v-badge
          class="w-100"
          v-tooltip="'(Gerado automaticamente) Frete peso + Advalorem'"
          content="?"
        >
          <InputTextMoeda
            v-model="valorTotalCalculadoLocal"
            prefix="R$"
            label="Valor Total do Serviço: *"
            bg-color="white"
            readonly
            :rules="rules.campoObrigatorio"
          />
        </v-badge>
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <v-badge
          class="w-100"
          v-tooltip="'(Gerado automaticamente) Frete peso + Advalorem'"
          content="?"
        >
          <InputTextMoeda
            v-model="valorTotalCalculadoLocal"
            prefix="R$"
            label="Valor Recebido do Serviço: *"
            bg-color="white"
            readonly
            :rules="rules.campoObrigatorio"
          />
        </v-badge>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          Serviços Personalizados
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

     <v-row class="my-3 bg-grey-lighten-2 mx-1 pt-4">
        <v-col cols="12" md="3" class="py-2">
          <v-text-field
            v-model="nomeServicoPersonalizado"
            label="Nome do Serviço *"
            placeholder="Ex: AJUDANTE"
            density="compact"
            variant="outlined"
            bg-color="white"
            clearable
          />
        </v-col>
        <v-col cols="12" md="9" class="py-2">
          <InputTextMoeda
            v-model="valorServicoPersonalizado"
            prefix="R$"
            label="Valor do Serviço *"
            bg-color="white"
            clearable
          />
        </v-col>
        <v-col class="mb-4">
          <v-btn prepend-icon="mdi-plus" variant="flat" color="red-darken-4" @click="adicionarServicoPersonalizado">
            Adicionar
          </v-btn>
        </v-col>
     </v-row>


       <v-row class="mx-1 bg-white mb-6" v-if="Object.keys(dadosFormGeralLocal.servico.componentes).length !== 0">
          <v-col>
            <TransitionGroup class="d-flex flex-wrap ga-2" name="list" tag="div">
              <div v-for="valorServico, campo in dadosFormGeralLocal.servico.componentes" :key="campo">
                <v-card class="pa-2 pe-4 d-flex rounded-pill align-center ga-2 justify-space-between" color="grey-darken-3" v-if="campo">
                  <div class="d-flex ga-2">
                    <v-btn icon="mdi-close" size="x-small" color="grey-darken-4" @click="removeServico(campo)">
                    </v-btn>
                    <v-chip variant="flat" color="grey-darken-4">
                      {{campo}}
                    </v-chip>
                  </div>
                  <div class="d-flex ga-1">
                   <div v-if="campo != 'PESO_CUBADO'">R$</div>{{formataNumeroBR(valorServico)}}
                  </div>
                </v-card>
              </div>
            </TransitionGroup>
          </v-col>
       </v-row>

    <v-row>
        <v-col md="12" class="py-2">
          <v-textarea
            v-model="dadosFormGeralLocal.observacoes_gerais"
            bg-color="white"
            variant="outlined"
            label="Observações Gerais"
            density="compact"
            clearable
          >
          </v-textarea>
      </v-col>
    </v-row>

    <v-card class="border pa-4 text-body-2 mt-2" variant="tonal" color="redNeveah">
      (*) Campos com esta estrela são obrigatórios
    </v-card>
  </v-form>
</template>

<script>

import { estadosBrasileiros } from '@/Enums/estadosEnum'
import { FinalidadeCteEnum } from '@/Enums/Fiscal/FinalidadeCteEnum'
import { ModalidadeEntregaEnum } from '@/Enums/Fiscal/ModalidadeEntregaEnum'
import { NaturezaOperacaoEnum } from '@/Enums/Fiscal/NaturezaOperacaoEnum'
import { TipoDeEmissaoCteEnum } from '@/Enums/Fiscal/TipoDeEmissaoCteEnum'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue'
import { ClassificacaoTributariaEnum } from '@/Enums/Fiscal/ClassificacaoTributariaEnum'
import { useAlertStore } from '@/stores/alertStore'
import { formataNumeroBR } from '@/utils/masks';

export default {
  name: 'FormDadosGeral',
  components: {
    InputTextMoeda
  },
  props: {
    dadosFormGeral: {
      type: Object,
      required: true
    },
    estadosESeusMunicipios: {
      type: Object,
      required: true
    },
    valorTotalCalculado: {
      type: Number
    },
  },
  data() {
    return {
      formataNumeroBR,

      estadosBrasileiros,
      FinalidadeCteEnum,
      ModalidadeEntregaEnum,
      TipoDeEmissaoCteEnum,
      NaturezaOperacaoEnum,
      ClassificacaoTributariaEnum,

      nomeServicoPersonalizado: null,
      valorServicoPersonalizado: null,

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },
    }
  },
  computed: {
    dadosFormGeralLocal: {
      get() {
        return this.dadosFormGeral
      },
      set(novosDados) {
        this.$emit('update:dadosFormGeral', novosDados)
      }
    },

    valorTotalCalculadoLocal: {
      get() {
        return this.valorTotalCalculado
      },
      set(novosDados) {
        this.$emit('update:valorTotalCalculado', novosDados)
      }
    },
  },
  methods: {

    // remove o item do array de componentes
    verificaSeLimpouCampo() {
      const novoObjeto = Object.fromEntries(
        Object.entries(this.dadosFormGeralLocal.servico.componentes).filter(([, valor]) => valor != null)
      )
      this.dadosFormGeralLocal.servico.componentes = novoObjeto
    },

    municipiosDoEstadoSelecionado(uf) {
      if(!uf) {
        return []
      }
      return this.estadosESeusMunicipios[uf]
    },

    validate() {
      return this.$refs?.formDadosGeral.validate()
    },

    adicionarServicoPersonalizado() {

      const alertStore = useAlertStore();

      if(this.nomeServicoPersonalizado == null
        || this.valorServicoPersonalizado == null
      ) {
        alertStore.addAlert('Preencha todos os campos do Serviço corretamente para adiciona-lo', 'warning')
        return
      }

      const campo = this.dadosFormGeralLocal?.servico?.componentes[this.nomeServicoPersonalizado]

      if(campo) {
        alertStore.addAlert('Já existe um Serviço com este Nome', 'warning')
        return
      }

      this.dadosFormGeralLocal.servico.componentes[this.nomeServicoPersonalizado] = this.valorServicoPersonalizado;
    },

    removeServico(chave) {
      delete this.dadosFormGeralLocal.servico.componentes[chave]
    },
  }
}
</script>

<style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.25s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  .list-move {
    transition: transform 0.25s ease; /* For animating reordering */
  }
</style>
