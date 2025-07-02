<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Participação no Faturamento - Top 10 Clientes
    </v-card-title>
    <v-card-text>
      <apexchart type="donut" height="322" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'Top10ClientesFaturamentoDonut',
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
        legend: {
          position: 'bottom'
        },
        tooltip: {
          y: {
            formatter: val => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      };
    },
    series() {
      return this.dados.series.map(cliente => {
        return cliente.data.reduce((soma, valor) => soma + valor, 0);
      });
    },
    labels() {
      return this.dados.series.map(cliente => cliente.name);
    }
  }
};
</script>
