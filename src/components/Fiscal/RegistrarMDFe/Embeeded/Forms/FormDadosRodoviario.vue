<template>
  <v-form class="bg-grey-lighten-4 border elevation-2 pa-6" ref="formDadosCarga">
    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <v-icon size="large">
               mdi-note-text
            </v-icon>
            <span>Detalhes do Transporte</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row class="my-3">
      <v-col cols="12" md="4" class="py-2">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-badge
              class="w-100 px-0"
              v-bind="props"
              content="?"
            >
              <InputText
                v-model="dadosFormRodoviarioLocal.rntrc"
                label="RNTRC *"
                density="compact"
                variant="outlined"
                bg-color="white"
                counter="8"
                clearable
              />
            </v-badge>
          </template>
          <span v-html="mensagemTooltipRodoviario"></span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" md="4" class="py-2">
        <InputText
          label="CNPJ do Contratante *"
          v-model="dadosFormRodoviarioLocal.contratante[0].cnpj"
          mask="##.###.###/####-##"
          disabled
          counter="18"
          density="compact"
          variant="outlined"
          bg-color="white"
          clearable
        />
      </v-col>
    </v-row>

    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <v-icon size="large">
              mdi-truck
            </v-icon>
            <span>Veículo Tração</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3" class="py-2">
        <InputText
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.placa"
          label="Placa do Veículo*"
          density="compact"
          variant="outlined"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          counter="7"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <InputTextMoeda
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.tara"
          label="Tara do Veículo *"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.uf_licenciamento"
          bg-color="white"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF de Licenciamento *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.tipo_rodado"
          bg-color="white"
          :items="TipoRodadoEnumEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Tipo de Rodado *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.tipo_carroceria"
          bg-color="white"
          :items="TipoCarroceriaEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Tipo de Carroceria *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
    </v-row>

    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <span >
              <v-badge
                class="w-100"
                v-tooltip:top="'Só é obrigatório se o campo do Tipo do Transportador estiver preenchido'"
                content="?"
                offset-x="-14"
              >
                Dados Proprietário do Veículo
              </v-badge>
            </span>

          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-radio-group
          v-model="valorDoRadio"
          :disabled="tipoTransportador ? false : true"
          inline
        >
          <v-radio
            label="Proprietário é PJ"
            :value="1"
          ></v-radio>
          <v-radio
            label="Proprietário é PF"
            :value="2"
          ></v-radio>
        </v-radio-group>

      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-if="valorDoRadio == 1">
        <InputText
          label="CNPJ do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.cnpj"
          mask="##.###.###/####-##"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          counter="18"
          density="compact"
          variant="outlined"
          bg-color="white"
        />
      </v-col>
      <v-col cols="12" md="4" v-else>
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="CPF do Proprietário *"
          dadosFormRodoviarioLocal.veiculo_tracao.proprietario.cpf
          mask="###.###.###-##"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          counter="14"
        />
      </v-col>
      <v-col cols="12" md="4" v-if="valorDoRadio == 1">
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Razão Social do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.razao_social"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
        />
      </v-col>
      <v-col cols="12" md="4" v-else>
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Nome do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.nome"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
        />
      </v-col>
      <v-col cols="12" md="4" v-if="valorDoRadio == 1">
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="IE do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.ie"
          mask="##############"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          counter="14"
        />
      </v-col>
    </v-row>
    <v-row>
       <v-col cols="12" md="4">
        <InputText
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.rntrc"
          label="RNTRC do Proprietário *"
          density="compact"
          variant="outlined"
          bg-color="white"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          counter="8"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.uf"
          bg-color="white"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF do Proprietário *"
          density="compact"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.tipo_proprietario"
          bg-color="white"
          :items="TipoProprietarioEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Tipo de Proprietário *"
          density="compact"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          clearable
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="bg-red-lighten-5 mx-1 px-2 text-grey-darken-2 text-body-2" style="border: 1px solid #ffbdb7;">
          <v-row dense class="bg-red-lighten-4 mt-4 pa-2">
            <v-col cols="12" md="4" class="d-flex ga-2 align-center">
              <div>
                <v-icon color="redNeveah">
                  mdi-card-account-details
                </v-icon>
              </div>
              <v-text-field
                v-model="cpfCondutor"
                bg-color="white"
                variant="outlined"
                label="CPF do condutor"
                density="compact"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="3" class="d-flex ga-2 align-center">
              <v-text-field
                v-model="nomeCondutor"
                density="compact"
                variant="outlined"
                label="Nome do condutor"
                bg-color="white"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex ga-2 align-center">
              <v-btn variant="flat" color="redNeveah" @click="vincularCte">
              Adicionar
              </v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 align-center pt-2 text-redNeveah justify-end text-body-1">
                <div>
                  <em>Condutores vinculados</em>
                </div>
                <div>
                  <v-chip>{{dadosFormRodoviarioLocal.condutor.length}}</v-chip>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">

              <div v-if="dadosFormRodoviarioLocal.condutor.length == 0" class="d-flex pt-2 text-grey text-body-2">
                <div class="mt-2">
                  <em>Nenhum Condutor vinculado</em>
                </div>
              </div>

              <v-card class="pa-4 mb-2 rounded-md bg-red-lighten-5 d-flex flex-column ga-3 overflow-y-auto" variant="flat" max-height="450" v-else>
                <v-row class="mb-4">
                  <v-col
                    cols="12"
                    md="4"
                    class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
                    v-for="condutor, index in dadosFormRodoviarioLocal.condutor" :key="`condutor-${index}`"
                  >
                    <v-card class="px-2 bg-red-lighten-4 text-redNeveah pa-2" style="border: 1px solid #ba1614;">
                      <div class="d-flex align-center text-body-2">
                        <div class="d-flex flex-column w-100 ga-2">
                          <div class="w-100">
                            Nome: <strong>{{ condutor.nome}}</strong>
                          </div>
                          <div class="w-100">CPF: <strong>{{ condutor.cpf}}</strong></div>
                        </div>
                        <v-btn icon="mdi-close" size="x-small" variant="tonal" @click="removeCondutor(index)"/>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <v-icon size="large">
              mdi-truck-minus
            </v-icon>
            <span>Descarregamento</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-card class="border pa-4 text-body-2 mt-2" variant="tonal" color="redNeveah">
      (*) Campos com esta estrela são obrigatórios
    </v-card>
  </v-form>
</template>

<script>

import { estadosBrasileiros } from '@/Enums/estadosEnum'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue'
import { useAlertStore } from '@/stores/alertStore'
import { formataMoeda } from '@/utils/masks';
import { TipoDoTransportadorEnum } from '@/Enums/Fiscal/TipoDoTransportadorEnum.js.js'
import { TipoCargaEnum } from '@/Enums/Fiscal/TipoCargaEnum'
import InputText from '@/components/Form/InputText.vue'
import { TipoRodadoEnumEnum } from '@/Enums/Fiscal/TipoRodadoEnum'
import { TipoCarroceriaEnum } from '@/Enums/Fiscal/TipoCarroceriaEnum'
import { TipoProprietarioEnum } from '@/Enums/Fiscal/TipoProprietarioEnum';

export default {
  name: 'FormDadosGeral',
  components: {
    InputTextMoeda,
    InputText
  },
  props: {
    dadosFormRodoviario: {
      type: Object,
      required: true
    },
    estadosESeusMunicipios: {
      type: Object,
      required: true
    },
    totalDeCtesVinculados: {
      type: Number,
      default: 0,
    },
    tipoTransportador: {
      required: true
    },
  },
  watch: {
    valorDoRadio(newValue, oldValue) {
      if(newValue != oldValue) {
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.razao_social = null
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.nome = null
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.cnpj = null
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.cpf = null
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.ie = null
      }
    },
  },
  data() {
    return {
      formataMoeda,

      TipoDoTransportadorEnum,
      estadosBrasileiros,
      TipoCargaEnum,
      TipoRodadoEnumEnum,
      TipoCarroceriaEnum,
      TipoProprietarioEnum,

      // ClassificacaoTributariaEnum,

      mensagemTooltipRodoviario: `
        Registro obrigatório do emitente do MDF-e <br>
        junto à ANTT para exercer a atividade de <br>
        transportador rodoviário de cargas por <br>
        conta de terceiros e mediante remuneração
      `,

      valorDoRadio: 2,

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },

      nomeCondutor: null,
      cpfCondutor: null,
    }
  },
  computed: {
    dadosFormRodoviarioLocal: {
      get() {
        return this.dadosFormRodoviario
      },
      set(novosDados) {
        this.$emit('update:dadosFormRodoviario', novosDados)
      }
    },
    totalDeCtesVinculadosLocal: {
      get() {
        return this.totalDeCtesVinculados
      },
      set(novosDados) {
        this.$emit('update:totalDeCtesVinculados', novosDados)
      }
    },
  },
  methods: {
    calculaQuantidadeDeCtesVinculados() {
      let total = 0

      for(const item in this.dadosFormRodoviarioLocal.descarregamento) {
        const quantidadeDeDocumentos = this.dadosFormRodoviarioLocal.descarregamento[item]?.documentos_fiscais?.length
        total += quantidadeDeDocumentos
      }

      return total
    },

    vincularCte() {

      const alertStore = useAlertStore();

      if(!this.nomeCondutor) {
        alertStore.addAlert('Preencha o Nome do Condutor corretamente', 'warning')
        return
      }

      if(!this.cpfCondutor) {
        alertStore.addAlert('Preencha o CPF do Condutor corretamente', 'warning')
        return
      }

      if(this.dadosFormRodoviarioLocal.condutor.length == 0) {
        this.criaNovoCondutor()
        return
      }

      const item = this.buscaCondutorPeloCPF()

      if(item) {
        alertStore.addAlert('Já existe um condutor com esse CPF adicionado', 'warning')
        return
      }

      this.criaNovoCondutor()
    },

    criaNovoCondutor() {
      const item = {
        cpf: this.cpfCondutor,
        nome: this.nomeCondutor,
      }
      this.dadosFormRodoviarioLocal.condutor.push(item)
    },

    buscaCondutorPeloCPF() {
      for(const index in this.dadosFormRodoviarioLocal.condutor) {
        if(this.dadosFormRodoviarioLocal.condutor[index].cpf == this.cpfCondutor.cpf) {
          return true
        }
      }
      return false
    },

    validate() {
      return this.$refs?.formDadosCarga.validate()
    },

    adicionarServicoPersonalizado() {

      const alertStore = useAlertStore();

      if(this.nomeServicoPersonalizado == null
        || this.valorServicoPersonalizado == null
      ) {
        alertStore.addAlert('Preencha todos os campos do Serviço corretamente para adiciona-lo', 'warning')
        return
      }

      const campo = this.dadosFormRodoviarioLocal?.servico?.componentes[this.nomeServicoPersonalizado]

      if(campo) {
        alertStore.addAlert('Já existe um Serviço com este Nome', 'warning')
        return
      }

      this.dadosFormRodoviarioLocal.servico.componentes[this.nomeServicoPersonalizado] = this.valorServicoPersonalizado;
    },

    removeCondutor(index) {
     this.dadosFormRodoviarioLocal.condutor.splice(index, 1);
    },
  }
}
</script>
