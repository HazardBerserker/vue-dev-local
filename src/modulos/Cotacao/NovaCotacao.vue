<template>
  <div class="pb-8 bg-white">
    <v-breadcrumbs :items="['Comercial', 'Nova Cotação']" class="mb-6"></v-breadcrumbs>

    <GlobalAlertFixed :propriedadesDoAlerta="propriedadesDoAlertaFixo" v-show="propriedadesDoAlertaFixo"/>

    <v-form ref="formCotacao">
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
                :rules="regraGeralCampoObrigatorio"
              ></v-combobox>
            </v-col>
            <v-col>
              <InputText label="CNPJ" v-model="coleta_cnpj" :rules="regraGeralCampoObrigatorio" mask="##.###.###/####-##" density="compact" bg-color="white" readonly :clearable="false"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <InputText label="CEP" v-model="coleta_cep" :rules="regraGeralCampoObrigatorio" mask="#####-###" density="compact" bg-color="white" readonly :clearable="false"/>
            </v-col>
            <v-col cols="8">
              <v-text-field v-model="coleta_endereco" :rules="regraGeralCampoObrigatorio" density="compact" variant="outlined" label="Endereço" readonly bg-color="white" placeholder="Digite o Endereço"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field v-model="coleta_numero" :rules="regraGeralCampoObrigatorio" density="compact" variant="outlined" label="Número" readonly bg-color="white" placeholder="Digite o Número"></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field v-model="coleta_cidade" :rules="regraGeralCampoObrigatorio" density="compact" variant="outlined" label="Cidade" readonly bg-color="white" placeholder="Digite a cidade"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="coleta_uf" :rules="regraGeralCampoObrigatorio" density="compact" variant="outlined" label="UF" readonly bg-color="white" placeholder="Digite o UF"></v-text-field>
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
              <InputText label="CNPJ" v-model="cnpj_destinatario" mask="##.###.###/####-##" :clearable="false" density="compact" class="bg-white" counter="18"/>
            </v-col>
            <v-col>
              <v-text-field v-model="nome_destinatario" density="compact" variant="outlined" label="Destinatário" bg-color="white" placeholder="Digite o nome do destinatário"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <InputText label="CEP" v-model="cep_destinatario" mask="#####-###" :clearable="false"  counter="9" density="compact" class="bg-white"/>
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
              <v-text-field v-model="cidade_destinatario" :rules="regraGeralCampoObrigatorio" density="compact" variant="outlined" label="Cidade"  bg-color="white" placeholder="Digite a cidade"></v-text-field>
            </v-col>
            <v-col cols="4">
              <InputText label="UF" v-model="uf_destinatario" :rules="regraUFDestinatario" :clearable="false"  counter="2" density="compact" bg-color="white"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field v-model="prazo_entrega" :rules="regraGeralCampoObrigatorio" type="number" density="compact" variant="outlined" label="Prazo de Entrega" bg-color="white" placeholder="Digite o prazo em dias"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea v-model="observacoes" type="number" density="compact" variant="outlined" label="Observações" bg-color="white" placeholder="Observações adicionais"></v-textarea>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="4">
              <v-text-field v-model="valor_motorista" :rules="regraGeralCampoObrigatorio" type="number" density="compact" variant="outlined" label="Valor do Motorista (R$)" bg-color="white" placeholder="Digite o valor"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="valor_notafiscal" :rules="regraGeralCampoObrigatorio" type="number" density="compact" variant="outlined" label="Valor da NF (R$)" bg-color="white" placeholder="Digite o valor"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="coeficiente_margem" :rules="regraGeralCampoObrigatorio" type="number" density="compact" variant="outlined" label="Coeficiente de Margem (%)" bg-color="white" placeholder="Gerado automaticamente" ></v-text-field>
            </v-col>
          </v-row>
          <v-btn block class="mb-10" variant="flat" color="blue" :disabled="!coeficiente_margem || !valor_notafiscal || !valor_motorista" @click="calculaFrete">
            Calcular Frete
          </v-btn>
          <div class="d-flex justify-space-between mt-4 ga-2">
            <v-card class="fill-height pa-2 w-100" color="blue-darken-4" variant="tonal">
              <template #title>
                <div class="text-center">
                  Valor do frete
                </div>
              </template>
              <template #text>
                <div class="text-h6 text-center">
                  {{ valor_cobrado_efetivo ? `R$ ${valor_cobrado_efetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null }}
                </div>
              </template>
            </v-card>
            <v-card class="fill-height pa-2 w-100" color="red-darken-4" variant="tonal">
              <template #title>
                <div class="text-center">
                  Motorista
                </div>
              </template>
              <template #text>
                <div class="text-h6 text-center">
                  {{ valor_motorista_efetivo ? `-R$ ${valor_motorista_efetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null }}
                </div>
              </template>
            </v-card>
            <v-card class="fill-height pa-2 w-100" color="purple-darken-4" variant="tonal">
              <template #title>
                <div class="text-center">
                  Ad-Valorem
                </div>
              </template>
              <template #text>
                <div class="text-h6 text-center">
                  {{  advalorem ? `-R$ ${advalorem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null }}
                </div>
              </template>
            </v-card>
            <v-card class="fill-height pa-2 w-100" color="green-darken-4" variant="tonal">
              <template #title>
                <div class="text-center">
                  Lucro Bruto
                </div>
              </template>
              <template #text>
                <div class="text-h6 text-center">
                    {{ lucro_bruto ? `R$ ${lucro_bruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null}}
                </div>
              </template>
            </v-card>
          </div>
        </v-card>
      </v-card>
    </v-form>

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
                  <td class="text-body-1">{{ id_frete ? id_frete : `"Gerado ao Salvar"`}}</td>
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
            <div class="bg-grey-lighten-5 ps-4 py-2" v-if="nome_destinatario">{{nome_destinatario}}</div>
            <v-divider v-if="nome_destinatario"></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2" v-if="cnpj_destinatario">{{formataCNPJ(cnpj_destinatario)}}</div>
            <v-divider v-if="cnpj_destinatario"></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2">{{endereco_destinatario && numero_destinatario ? `${endereco_destinatario}, ${numero_destinatario}` : null}}</div>
            <v-divider></v-divider>
            <div class="bg-grey-lighten-5 ps-4 py-2">
              <v-row>
                <v-col cols="3" v-if="cidade_destinatario">{{formataCEP(cep_destinatario)}}</v-col>
                <v-divider vertical inset v-if="cidade_destinatario"></v-divider>
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
                <v-col>Frete</v-col>
                <v-divider vertical inset></v-divider>
                <v-col>{{ valor_cobrado_efetivo ? `R$ ${valor_cobrado_efetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null }}</v-col>
              </v-row>
            </div>
            <v-divider></v-divider>
             <div class="bg-grey-lighten-5 ps-4 py-2">
              <v-row>
                <v-col>Prazo de Entrega</v-col>
                <v-divider vertical inset></v-divider>
                <v-col>{{ prazo_entrega ? `${prazo_entrega} Dias` : null }}</v-col>
              </v-row>
            </div>
          </v-card>
        </div>
        <div class="mt-6 w-100 text-end font-weight-bold text-green-darken-3 text-h5">Total do Frete {{ valor_cobrado_efetivo ? `R$ ${valor_cobrado_efetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null }}</div>
        <div class="mt-6 w-100 text-center text-body-2 text-grey-darken-1">Este orçamento é válido por 7 dias a partir da data de emissão</div>
      </div>

      <v-btn class="mt-6" block variant="flat" color="blue-darken-3" @click="salvaCotacao">
        Salvar Cotação
      </v-btn>
    </v-card>
  </div>
</template>

<script>

import { format as formatDate } from 'date-fns'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// import { useAlertStore } from '@/stores/alertStore'
import GlobalAlertFixed from '@/components/GlobalComponents/GlobalAlertFixed.vue';
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
  async mounted() {
    await this.buscaCotacaoCriterios()
  },
  data() {
    return {
      formataCNPJ,
      formataCEP,
      propriedadesDoAlertaFixo: null,
      comboBoxRemetenteLoading: false,
      listaDeClientes: [],
      cotacaoCriterios: [],
      // Cabeçalho
      id_frete: null,

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
      valor_motorista: null,
      valor_motorista_efetivo: null,
      valor_notafiscal: null,
      valor_cobrado: null,
      valor_cobrado_efetivo: null,
      coeficiente_margem: null,
      lucro_bruto: null,
      advalorem: null,

      // regras
      opcaoAtivo:[
          { valor: 1, descricao: 'Sim' },
          { valor: 0, descricao: 'Não' }
        ],

      // regras destinatario
      regraEnderecoDestinatario: [
        (v) => !!v || 'O Endereço é obrigatório',
      ],
      regraUFDestinatario: [
        (v) => !!v || 'A UF do Destinatário é obrigatória',
        (v) => (v && v.length === 2) || 'O UF deve ter 2 caracteres',
      ],

      // regras coleta
      regraGeralCampoObrigatorio: [
        (v) => !!v || 'Este campo é obrigatório',
      ]
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
    },
    valor_motorista(newValue) {
      if(!newValue) {
        this.coeficiente_margem = null
        return
      }

      this.coeficiente_margem = this.obterCoeficienteValorMotorista(newValue, this.cotacaoCriterios)
    },
  },
  methods: {

    validateForm() {
      return this.$refs.formCotacao.validate();
    },
    limpaCampos() {
      this.razao_social = null,
      this.cnpj = null,
      this.logradouro = null,
      this.cep = null,
      this.cidade = null,
      this.bairro = null,
      this.pais = null,
      this.uf = null,
      this.numero = null,
      this.ativo = 1
    },
    formataDadosParaEnvio() {
      const dadosParaEnvio = {
        data_cotacao: formatDate(this.data_cotacao, 'yyyy-MM-dd'),
        id_remetente: this.coleta_remetente?.id_cliente, // ou this.coleta_remetente?.id_remetente
        cnpj_destinatario: this.cnpj_destinatario || null,
        nome_destinatario: this.nome_destinatario || null,
        cep_destinatario: this.cep_destinatario || null,
        endereco_destinatario: this.endereco_destinatario,
        numero_destinatario: this.numero_destinatario || null,
        cidade_destinatario: this.cidade_destinatario || null,
        uf_destinatario: this.uf_destinatario.toUpperCase(),
        observacoes: this.observacoes || null,
        valor_motorista: this.valor_motorista,
        valor_motorista_efetivo: this.valor_motorista_efetivo,
        valor_notafiscal: this.valor_notafiscal,
        coeficiente_margem: this.coeficiente_margem,
        advalorem: this.advalorem,
        imposto_considerado: this.imposto_considerado || null,
        valor_cobrado_efetivo: this.valor_cobrado_efetivo,
        valor_cobrado: this.valor_cobrado,
        prazo: this.prazo_entrega,
      }
      return dadosParaEnvio
    },

    async salvaCotacao() {
      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      const formValidado = await this.validateForm();

      if(!formValidado.valid) {
        const campoInvalido = document.querySelector('.v-input--error');
        if (campoInvalido) {
          campoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      if(!this.valor_cobrado_efetivo || !this.valor_motorista_efetivo || !this.lucro_bruto || !this.advalorem) {
        alertStore.addAlert('Calcule o Frete antes de Salvar a cotação', 'warning')
        return
      }

      const dadosParaEnvio = this.formataDadosParaEnvio();
      const url = endpoints.freteCotacao.novo;

      try {
        loading.show('Salvando Cotação...')
        const resposta =  await ApiService({
          method: 'post',
          url: url,
          data: dadosParaEnvio
        });

        alertStore.addAlert(resposta?.data.message, 'success')
        this.id_frete = resposta?.data?.data.id_frete
        await this.$nextTick();
        console.log(resposta.data.data);

        await this.gerarPDF()

      } catch (erro) {
        alertStore.addAlert(erro.response?.data?.message, 'error')
      } finally {
        loading.hide()
      }

    },

    async gerarPDF() {
      const element = this.$refs.conteudoPdf
      if (!element) {
        console.error('Elemento não encontrado!')
        return
      }

      const alertStore = useAlertStore()

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

        alertStore.addAlert('PDF Gerado com sucesso!', 'success')
        this.limpaCampos()
      } catch (error) {
        alertStore.addAlert(`Erro ao gerar PDF: ${error.message}`, 'error')
      }
    },

    async buscaCotacaoCriterios() {
      try {
        const endpoint = endpoints.cotacaoCriterios.lista

        const resposta = await ApiService({
          method: 'get',
          url: endpoint,
        })

        this.cotacaoCriterios = resposta.data.data

      } catch (error) {
        const alertStore = useAlertStore()
        alertStore.addAlert(error?.response?.data?.message, 'error', 3000);
        return
      }
    },

    obterCoeficienteValorMotorista(valorMotorista, criterios) {
      const criteriosMotorista = criterios
        .filter(c => c.criterio === 'valor_motorista')
        .sort((a, b) => a.valor - b.valor);

      if (criteriosMotorista.length === 0) {
        return null; // Se não houver nenhum critério, retorna null
      }

      let coeficienteAplicado = criteriosMotorista[0].coeficiente;

      for (const criterio of criteriosMotorista) {
        if (valorMotorista >= criterio.valor) {
          coeficienteAplicado = criterio.coeficiente;
        }
      }
      return coeficienteAplicado;
    },

    calculaFrete() {
      const margemMarkup = 1.0738;
      let coeficienteAdvalorem = null
      // let imposto = null
      this.cotacaoCriterios.map(cotacaoCriterio => {
        // if(cotacaoCriterio.criterio === 'imposto') {
        //   imposto = cotacaoCriterio.coeficiente
        // }
        if(cotacaoCriterio.criterio === 'advalorem') {
          coeficienteAdvalorem = cotacaoCriterio.coeficiente
        }
      })

     this.advalorem = Number((coeficienteAdvalorem * margemMarkup * this.valor_notafiscal).toFixed(2));

      // Calculo do valor cobrado
      this.valor_cobrado = Number(((this.valor_motorista * this.coeficiente_margem) + this.advalorem).toFixed(2));

      // Valor cobrado efetivo igual ao cobrado
      this.valor_cobrado_efetivo = this.valor_cobrado;

      // Valor motorista efetivo
      this.valor_motorista_efetivo = Number(parseFloat(this.valor_motorista).toFixed(2));

      // Lucro bruto
      this.lucro_bruto = Number((this.valor_cobrado_efetivo - this.advalorem - this.valor_motorista_efetivo).toFixed(2));
    },

    format(date) {
      return formatDate(date, 'dd/MM/yy')
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
