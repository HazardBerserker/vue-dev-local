<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Participação no Faturamento
    </v-card-title>
    <v-card-text>
      <apexchart type="donut" height="362" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'DestinatarioParticipacaoFaturamento',
  components: {
    apexchart: ApexCharts
  },
  props: {
    dados: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          toolbar: { show: true },
          zoom: { enabled: false }
        },
        labels: this.labels,
        tooltip: {
          y: {
            formatter: val => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        },
        colors: [
          '#3498db', // azul
          '#2ecc71', // verde
          '#e67e22', // laranja
          '#9b59b6', // roxo
          '#f1c40f', // amarelo
          '#1abc9c', // turquesa
          '#e74c3c', // vermelho
          '#34495e', // azul escuro
          '#95a5a6', // cinza
          '#d35400', // laranja escuro
        ],
        legend: false
      };
    },
    series() {
      return this.dados.series;
    },
    labels() {
      return this.dados.labels
    }
  }
};
</script>
