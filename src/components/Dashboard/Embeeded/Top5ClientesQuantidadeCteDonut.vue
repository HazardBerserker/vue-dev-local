<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Distribuição Anual - Quantidade CT-es
    </v-card-title>
    <v-card-text>
      <apexchart type="donut" height="315" :options="options" :series="dados.series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts'

export default {
  name: 'Top5ClientesQuantidadeCteDonut',
  components: { apexchart: ApexCharts },
  props: {
    dados: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options: {
        labels: this.dados.labels,
        colors: ['#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#f1c40f'],
        tooltip: { y: { formatter: val => `${val} CT-es` } },
        legend: { position: 'bottom' }
      }
    }
  }
}
</script>
