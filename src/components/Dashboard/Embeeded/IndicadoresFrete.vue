<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="text-h6 font-weight-bold">Indicadores Gerais</v-card-title>

    <v-row dense class="mt-2">
      <v-col cols="6" md="3" v-for="(indicador, index) in indicadores" :key="index">
        <v-sheet
          rounded="lg"
          class="pa-3 d-flex flex-column align-center justify-center"
          :color="indicador.cor + ' lighten-4'"
        >
          <v-icon :color="indicador.cor" size="30">{{ indicador.icone }}</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-medium text-center">{{ indicador.titulo }}</div>
          <div class="text-h6 font-weight-bold mt-1" :style="{ color: indicador.cor }">
            {{ indicador.valor }}
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'IndicadoresFrete',
  props: {
    dados: {
      type: Object,
      required: true
    }
  },
  computed: {
    indicadores() {
      return [
        {
          titulo: 'Total Fretes',
          valor: this.dados.data.total_fretes,
          cor: '#3498db',
          icone: 'mdi-truck'
        },
        {
          titulo: 'R$ Fretes',
          valor: this.dados.data.valor_fretes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          cor: '#2ecc71',
          icone: 'mdi-currency-usd'
        },
        {
          titulo: 'CT-es Cancelados',
          valor: this.dados.data.fretes_cancelados,
          cor: '#e74c3c',
          icone: 'mdi-close-circle-outline'
        },
        {
          titulo: 'R$ Mercadorias',
          valor: this.dados.data.valor_mercadorias.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          cor: '#9b59b6',
          icone: 'mdi-package-variant'
        }
      ];
    }
  }
};
</script>
