<template>
  <div class="pb-8 bg-white">
    <v-breadcrumbs :items="['Cotação', 'Nova Cotação']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <v-card class="px-6 pb-6 elevation-3 mx-auto" max-width="1100">

      <template #title>
        <span class="font-weight-bold justify-center d-flex">Cotação de Frete</span>
      </template>
      <v-divider></v-divider>

      <v-row class="mt-4">
        <!-- <v-col>
          <v-text-field v-model="id_cotacao" density="compact" variant="outlined" label="ID Cotação" readonly
            bg-color="grey-lighten-4"></v-text-field>
        </v-col> -->
        <v-col>
          <v-date-input
            v-model="data_cotacao"
            label="Data da Cotação"
            prepend-icon=""
            density="compact"
            prepend-inner-icon="$calendar"
            :display-format="format"
            variant="outlined"
            readonly
            bg-color="grey-lighten-4"
          ></v-date-input>
        </v-col>
      </v-row>

      <v-card class="pa-4 rounded-lg elevation-0" color="grey-lighten-4">
        <template #prepend>
          <v-icon color="grey-darken-1" class="pe-4">
            mdi-truck-plus
          </v-icon>
        </template>

        <template #title>
          <span class="text-h6 text-grey-darken-1">Coleta</span>
        </template>

        <v-row class="mt-2">
          <v-col>
            <v-combobox
              :loading="comboBoxRemetenteLoading"
              @keyup="buscarRemetente"
              v-model="coleta_remetente"
              density="compact"
              variant="outlined"
              label="Remetente"
              bg-color="white"
              placeholder="Buscar remetente"
              :items="listaDeClientes"
              item-title="razao_social"
              item-value="id_cliente"
            ></v-combobox>
          </v-col>
          <v-col>
            <InputText label="CNPJ" v-model="coleta_cnpj" mask="##.###.###/####-##" density="compact" class="bg-white" readonly :clearable="false"/>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <InputText label="CEP" v-model="coleta_cep" mask="#####-###" density="compact" class="bg-white" readonly :clearable="false"/>
          </v-col>
          <v-col cols="8">
            <v-text-field v-model="coleta_endereco" density="compact" variant="outlined" label="Endereço" readonly bg-color="white" placeholder="Digite o Endereço"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3">
            <v-text-field v-model="coleta_numero" density="compact" variant="outlined" label="Número" readonly bg-color="white" placeholder="Digite o Número"></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field v-model="coleta_cidade" density="compact" variant="outlined" label="Cidade" readonly bg-color="white" placeholder="Digite a cidade"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="coleta_uf" density="compact" variant="outlined" label="UF" readonly bg-color="white" placeholder="Digite o UF"></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <v-card class="pa-4 mt-6 rounded-lg elevation-0" color="grey-lighten-4">
        <template #prepend>
          <v-icon color="grey-darken-1" class="pe-4">
            mdi-truck-fast
          </v-icon>
        </template>
        <template #title>
          <span class="text-h6 text-grey-darken-1">Entrega</span>
        </template>

        <v-row class="mt-2">
          <v-col>
            <InputText label="CNPJ" v-model="cnpj_destinatario" mask="##.###.###/####-##" density="compact" class="bg-white" counter="18"/>
          </v-col>

          <v-col>
            <v-text-field v-model="nome_destinatario" density="compact" variant="outlined" label="Destinatário" bg-color="white" placeholder="Digite o nome do destinatário"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <InputText label="CEP" v-model="cep_destinatario" mask="#####-###"  counter="9" density="compact" class="bg-white"/>
          </v-col>
          <v-col cols="8">
            <v-text-field v-model="endereco_destinatario" density="compact" variant="outlined" label="Endereço" bg-color="white" placeholder="Digite o endereço"></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="3">
            <v-text-field v-model="numero_destinatario" density="compact" variant="outlined" label="Número" bg-color="white" placeholder="Digite o Número"></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field v-model="cidade_destinatario" density="compact" variant="outlined" label="Cidade"  bg-color="white" placeholder="Digite a cidade"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="uf_destinatario" density="compact" variant="outlined" label="UF" bg-color="white" placeholder="Digite o UF"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field v-model="prazo" type="number" density="compact" variant="outlined" label="Prazo de Entrega" bg-color="white" placeholder="Digite o prazo em dias"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-textarea v-model="observacoes" type="number" density="compact" variant="outlined" label="Observações" bg-color="white" placeholder="Observações adicionais"></v-textarea>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="4">
            <v-text-field v-model="valor_motorista" type="number" density="compact" variant="outlined" label="Valor do Motorista (R$)" bg-color="white" placeholder="Digite o valor"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="valor_notafiscal" type="number" density="compact" variant="outlined" label="Valor da NF (R$)" bg-color="white" placeholder="Digite o valor"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="coeficiente_margem" type="number" density="compact" variant="outlined" label="Coeficiente de Margem (%)" bg-color="white" placeholder="Gerado automaticamente" readonly></v-text-field>
          </v-col>
        </v-row>

        <div class="d-flex justify-space-between mt-4 ga-2">
          <v-card class="fill-height pa-2 w-100" title="Valor do frete" color="blue-darken-4" variant="tonal">
            <template #text>
              <div class="text-h6">
                R$ 2300.38
              </div>
            </template>
          </v-card>
          <v-card class="fill-height pa-2 w-100" title="Motorista" color="red-darken-4" variant="tonal">
            <template #text>
              <div class="text-h6">
                R$ 2300.38
              </div>
            </template>
          </v-card>
          <v-card class="fill-height pa-2 w-100" title="Ad-Valorem" color="purple-darken-4" variant="tonal">
            <template #text>
              <div class="text-h6">
                R$ 2300.38
              </div>
            </template>
          </v-card>
          <v-card class="fill-height pa-2 w-100" title="Lucro Bruto" color="green-darken-4" variant="tonal">
            <template #text>
              <div class="text-h6">
                R$ 2300.38
              </div>
            </template>
          </v-card>
        </div>
      </v-card>
    </v-card>

    <v-card class="mx-auto mt-6 pa-6 elevation-3" max-width="1100">
      <div ref="conteudoPdf" style="padding: 20px">
        <v-row>
          <v-col>
            <v-img
              width="250"
              src="/logo/neveah_logo_transp.png"
              alt="Logo Neveah"
              class="me-3">
            </v-img>
          </v-col>
        </v-row>
        <div class="d-flex justify-space-between mt-10">
          <div style="line-height: 1.8;">
            Av. Ernesto de Moraes - Centro, nº 40 <br>
            Jarinu - SP, 13240-005 <br>
            https://www.neveah.com.br <br>
            Fone: +55 (19)99243-0662 <br>
            Sales Person: Leticia Fabiana <br>
          </div>
          <v-card class="elevation-0 border">
            <v-table>
              <tbody>
                <tr>
                  <td class="bg-grey-lighten-3 font-weight-bold text-body-1">Data:</td>
                  <td class="text-body-1">{{ format(data_cotacao, 'dd/mm/yy') }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-lighten-3 font-weight-bold text-body-1">Validade:</td>
                  <td class="text-body-1">{{ format(data_cotacao, 'dd/mm/yy') }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-lighten-3 font-weight-bold text-body-1">Quote</td>
                  <td class="text-body-1">Null</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>
        <div class="mt-4">
          <v-card class="bg-grey-lighten-3 elevation-0 border">
            <template #title>
              <span class="text-body-1 font-weight-bold">Coleta</span>
            </template>
            <div class="bg-grey-lighten-5 ps-4 py-2">{{coleta_remetente?.razao_social}}</div>
            <v-divider></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2">{{formataCNPJ(coleta_cnpj)}}</div>
            <v-divider></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2">{{coleta_endereco}}</div>
            <v-divider></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2">
              <v-row>
                <v-col cols="3">{{formataCEP(coleta_cep)}}</v-col>
                <v-divider vertical inset></v-divider>
                <v-col cols="7">{{coleta_cidade}}</v-col>
                <v-divider vertical inset></v-divider>
                <v-col cols="2">{{coleta_uf}}</v-col>
              </v-row>
            </div>
          </v-card>
        </div>
        <div class="mt-4">
          <v-card class="bg-grey-lighten-3 elevation-0 border">
            <template #title>
              <span class="text-body-1 font-weight-bold">Destinatário</span>
            </template>
            <div class="bg-grey-lighten-5 ps-4 py-2">{{nome_destinatario}}</div>
            <v-divider></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2">{{formataCNPJ(cnpj_destinatario)}}</div>
            <v-divider></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2">{{endereco_destinatario}}</div>
            <v-divider></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2">
              <v-row>
                <v-col cols="3">{{formataCEP(cep_destinatario)}}</v-col>
                <v-divider vertical inset></v-divider>
                <v-col cols="7">{{cidade_destinatario}}</v-col>
                <v-divider vertical inset></v-divider>
                <v-col cols="2">{{uf_destinatario}}</v-col>
              </v-row>
            </div>
          </v-card>
        </div>
        <div class="mt-4">
          <v-card class="bg-grey-lighten-3 elevation-0 border">
            <div class="bg-grey-lighten-3 ps-4 py-4 font-weight-bold">
              <v-row>
                <v-col>Descrição Serviço</v-col>
                <v-col>Total</v-col>
              </v-row>
            </div>
            <div class="bg-grey-lighten-5 ps-4 py-2">
              <v-row>
                <v-col>awd</v-col>
                <v-divider vertical inset></v-divider>
                <v-col>awd</v-col>
              </v-row>
            </div>
            <v-divider></v-divider>
             <div class="bg-grey-lighten-5 ps-4 py-2">
              <v-row>
                <v-col>awd</v-col>
                <v-divider vertical inset></v-divider>
                <v-col>awd</v-col>
              </v-row>
            </div>
          </v-card>
        </div>
        <div class="mt-6 w-100 text-end font-weight-bold text-green-darken-4">Total do Frete: R$2.000,08</div>
        <div class="mt-6 w-100 text-center text-body-2 text-grey-darken-1">Este orçamento é válido por 7 dias a partir da data de emissão</div>
      </div>

      <v-btn class="mt-6" block variant="flat" color="blue-darken-3" @click="gerarPDF">
        Gerar PDF
      </v-btn>
    </v-card>
  </div>
</template>

<script>

import { format as formatDate } from 'date-fns'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/Global/GlobalAlertFixed.vue';
import { endpoints } from '@/utils/apiEndpoints';
import ApiService from '@/services/ApiService';
import { useAlertStore } from '@/stores/alertStore';
import InputText from '@/components/Form/InputText.vue';
import { useLoadingStore } from '@/stores/loading';
import { formataCNPJ, formataCEP } from '@/utils/masks';
// import { endpoints } from '@/utils/apiEndpoints';

export default {
  components: {
    GlobalAlertFixed,
    InputText
  },
  data() {
    return {
      formataCNPJ,
      formataCEP,
      comboBoxRemetenteLoading: false,
      listaDeClientes: [],
      // Cabeçalho
      id_cotacao: '',

      // Data da cotação
      data_cotacao: new Date(),

      // Coleta
      coleta_remetente: null,
      coleta_cnpj: '',
      coleta_numero: '',
      coleta_cidade: '',
      coleta_uf: '',
      coleta_cep: '',
      coleta_endereco: '',

      // Entrega
      cnpj_destinatario: '',
      nome_destinatario: '',
      cep_destinatario: '',
      endereco_destinatario: '',
      numero_destinatario: '',
      cidade_destinatario: '',
      uf_destinatario: '',
      prazo_entrega: '',
      observacoes: '',

      // Valores
      valor_motorista: '',
      valor_notafiscal: '',
      coeficiente_margem: ''
    }
  },
  watch: {
    coleta_remetente(newValue) {
      if (typeof newValue === 'object') {
        this.preencheValoresDoRemetente(newValue)
      }
    },
    cnpj_destinatario(newValue) {
      if(newValue.length == 14) {
        this.buscarDestinatario();
      }
    }
  },
  methods: {
    format(date) {
      return formatDate(date, 'dd/MM/yy')
    },

    async gerarPDF() {
      const element = this.$refs.conteudoPdf
      if (!element) {
        console.error('Elemento não encontrado!')
        return
      }

      try {
        const canvas = await html2canvas(element, {
          scale: 3,         // Alta qualidade
          useCORS: true
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')

        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight)
        pdf.save('cotacao.pdf')
      } catch (error) {
        console.error('Erro ao gerar PDF:', error)
      }
    },

    async buscarRemetente() {
      if(this.comboBoxRemetenteLoading) {
        return;
      }
      try {

        const endpoint = endpoints.cliente.buscaPorRazaoSocial;
        const url =  `${endpoint}/${this.coleta_remetente}`

        this.comboBoxRemetenteLoading = true

        const resposta =  await ApiService({
          method: 'get',
          url: url,
        })

        this.listaDeClientes = resposta.data.data

      } catch (error) {
        const alertStore = useAlertStore()
        alertStore.addAlert(error?.response?.data?.message, 'error', 3000);
        return
      } finally {
        this.comboBoxRemetenteLoading = false
      }
    },

    async buscarDestinatario() {
      const loading = useLoadingStore()
      const alertStore = useAlertStore()
      try {
        const endpoint = endpoints.cliente.buscaClienteNaApiDoGoverno;
        const url =  `${endpoint}/${this.cnpj_destinatario}`

        loading.show('Buscando Dados...')
        const resposta =  await ApiService({
          method: 'post',
          url: url,
        })

        console.log(resposta.data.data);


        this.preencheValoresDoDestinatario(resposta?.data?.data)

        alertStore.addAlert('Dados preenchidos automaticamente', 'info')

      } catch (error) {
        alertStore.addAlert(error?.response?.data?.message, 'error', 3000);
        return
      } finally {
        loading.hide()
      }
    },

    preencheValoresDoRemetente(cliente) {
      this.coleta_cnpj = cliente.cnpj
      this.coleta_numero = cliente.numero
      this.coleta_cidade = cliente.cidade
      this.coleta_uf = cliente.uf
      this.coleta_cep = cliente.cep
      this.coleta_endereco = cliente.endereco
    },

    preencheValoresDoDestinatario(cliente) {
      this.endereco_destinatario = cliente.logradouro
      this.nome_destinatario = cliente.nome
      this.cep_destinatario = cliente.cep
      this.numero_destinatario = cliente.numero
      this.cidade_destinatario = cliente.municipio
      this.uf_destinatario = cliente.uf
    }
  },
}
</script>
