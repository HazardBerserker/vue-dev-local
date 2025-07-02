<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Evolução Faturamento - Top 5 Clientes
    </v-card-title>
    <v-card-text>
      <apexchart type="line" height="307" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'Top5ClientesFaturamentoLinha',
  components: {
    apexchart: ApexCharts
  },
  props: {
    dados: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'line',
          zoom: { enabled: false }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: this.dados.labels,
        },
        tooltip: {
          y: {
            formatter: val => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      },
      series: this.dados.series
    };
  },
  watch: {
    dados: {
      handler() {
        this.series = this.dados.series;
        this.chartOptions.xaxis.categories = this.dados.labels;
      },
      deep: true
    }
  }
};
</script>
