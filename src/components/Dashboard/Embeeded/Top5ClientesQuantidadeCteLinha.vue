<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Evolução - Quantidade CT-es
    </v-card-title>
    <v-card-text>
      <apexchart
        type="line"
        height="300"
        :options="options"
        :series="dados"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts'

export default {
  name: 'Top5ClientesQuantidadeCteLinha',
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
        chart: { type: 'line', toolbar: { show: false } },
        stroke: { width: 2 },
        xaxis: {
          categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        colors: ['#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#f1c40f'],
        tooltip: {
          y: {
            formatter: val => `${val} CT-es`
          }
        }
      }
    }
  }
}
</script>
