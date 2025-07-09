<template>
  <v-dialog v-model="open" max-width="900" transition="dialog-bottom-transition">
    <v-card class="rounded-xl elevation-3" color="grey-lighten-4">
      <!-- Título -->
      <v-card-title class="d-flex justify-space-between align-center text-white rounded-t-2xl" style="background-color: #1565C0;">
        <span class="text-h6 font-weight-semibold">Detalhes do Frete - CTE <strong>#{{ frete.id_cte }}</strong></span>
        <v-btn icon="mdi-close" size="35" color="blue" @click="fechar" class="hover-scale">
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Campos de Texto -->
        <v-row dense>
          <v-col cols="6" v-for="(valor, campo) in camposTexto" :key="campo">
            <div class="mb-2">
              <div class="text-grey-darken-3">{{ formatLabel(campo) }}:</div>
              <div class="text-grey-darken-5"><strong>{{ valor }}</strong></div>
            </div>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { formataMoeda } from '@/utils/masks';

export default {
  name: 'MeuFreteDetalhesDialog',
  data() {
    return {
      frete: null,
      open: false,
    };
  },
  computed: {
    camposTexto() {
      if (!this.frete) return {};
      return {
        remetente: this.frete.meus_fretes_remetente,
        destinatario: this.frete.cte_destinatario,
        cidade_e_uf: `${this.frete.cte_cidade_destinatario} / ${this.frete.cte_uf_destinatario}`,
        notas_fiscais: this.formatarNotasFiscais(this.frete.nota_fiscal),
        valor_frete: formataMoeda(this.frete.frete),
        valor_nota: formataMoeda(this.frete.valor_nf),
        CTE_data_emissao: this.frete.data_emissao,
        previsao_de_entrega: this.calcularDataComPrazo(this.frete.data_emissao, this.frete.prazo),
        entrega_efetiva: this.frete.entrega_efetiva
      };
    },
    camposImagem() {
      if (!this.frete) return {};
      return {
        arquivo_cnh: this.frete.arquivo_cnh,
        arquivo_comprovante_residencia: this.frete.arquivo_comprovante_residencia,
        arquivo_documento_carro: this.frete.arquivo_documento_carro,
        arquivo_antt: this.frete.arquivo_antt,
        arquivo_foto_veiculo: this.frete.arquivo_foto_veiculo,
      };
    },
  },
  methods: {
    abrir(frete) {
      this.frete = frete;
      this.open = true;
    },
    fechar() {
      this.open = false;
    },
    formatLabel(campo) {
      return campo
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    },
    formatarNotasFiscais(notasString) {
      if (!notasString) return '';

      return notasString
        .split(',')
        .map(chave => {
          // Extrai substring igual ao PHP (pos 25, 9 chars)
          const parte = chave.substr(25, 9);

          // Converte para número inteiro (remove zeros à esquerda)
          return parseInt(parte, 10);
        })
        .filter(n => !isNaN(n)) // remove valores inválidos
        .join(',');
    },
    calcularDataComPrazo(dataEmissao, prazoEmDias) {
      if (!dataEmissao || isNaN(prazoEmDias)) return '';

      // Se prazo for 0, apenas retorna a data original
      if (prazoEmDias === 0) {
        return dataEmissao;
      }

      // Converte de "dd/mm/yyyy" para "yyyy-mm-dd"
      const [dia, mes, ano] = dataEmissao.split('/');
      const dataConvertida = `${ano}-${mes}-${dia}`;
      const data = new Date(dataConvertida);

      if (isNaN(data.getTime())) return '';

      data.setDate(data.getDate() + prazoEmDias);

      // Retorna no formato brasileiro
      return data.toLocaleDateString('pt-BR');
    },
  },
};
</script>

<style scoped>
.image-container {
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f5f5f5;
}

.hover-scale:hover {
  transform: scale(1.05);
  transition: 0.2s ease;
}

.v-card-text {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
