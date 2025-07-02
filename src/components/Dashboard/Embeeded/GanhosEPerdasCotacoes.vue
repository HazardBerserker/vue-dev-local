<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Cotações Aceitas x Rejeitadas
    </v-card-title>
    <v-card-text>
      <apexchart
        width="100%"
        height="300"
        type="bar"
        :options="chartOptions"
        :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts'

export default {
  name: 'GanhosEPerdasCotacoes',
  props: {
    dados: {
      type: Object,
      required: true
    }
  },
  components: {
    apexchart: ApexCharts
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          stacked: true,
          toolbar: { show: true },
          zoom: { enabled: false }
        },
        colors: ['#2ecc71', '#e74c3c'], // Verde (prazo), Vermelho (fora)
        xaxis: {
          categories: this.meses(), // nomes dos meses
        },
        plotOptions: {
          bar: { horizontal: false },
        },
        legend: { position: 'top' }
      };
    },
    series() {
      return [
        { name: 'Ganhos', data: this.ganhos() },
        { name: 'Perdas', data: this.perdas() },
      ];
    },
  },
  methods: {
    meses() {
      return this.dados.map(item => item.mes);
    },
    ganhos() {
      return this.dados.map(item => item.ganhos);
    },
    perdas() {
      return this.dados.map(item => item.perdas);
    },
  }
}
</script>
