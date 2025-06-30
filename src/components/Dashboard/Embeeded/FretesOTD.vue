<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="text-h6 font-weight-bold mb-4">
      Entregas no Prazo vs Fora do Prazo (OTD)
    </v-card-title>

    <v-card-text>
      <apexchart
        type="donut"
        width="100%"
        height="315"
        :options="options"
        :series="valores"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts'

export default {
  name: 'FretesOTD',
  props: {
    dados: {
      type: Object,
      required: true
    }
  },
  components: {
    apexchart: ApexCharts
  },
  data() {
    return {
      valores: [],
      options: {
        labels: [],
        colors: ['#2ecc71', '#e74c3c'], // Verde (prazo), Vermelho (fora)
        legend: {
          position: 'bottom'
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} fretes`
          }
        },
        dataLabels: {
          formatter: (val) => `${val.toFixed(1)}%`
        }
      }
    }
  },
  async mounted() {
    await this.carregaDadosOtd()
  },
  methods: {
    async carregaDadosOtd() {
      try {
        this.valores = this.dados.data.valores;
        this.options.labels = this.dados.data.labels;
      } catch (error) {
        console.error('Erro ao carregar dados OTD', error);
      }
    }
  }
}
</script>
