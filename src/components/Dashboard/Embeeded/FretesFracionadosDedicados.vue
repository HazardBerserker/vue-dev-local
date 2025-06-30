<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="text-h6 font-weight-bold mb-4">
      Cotações Ganhas vs Perdidas por Mês
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
  name: 'FretesFracionadosDedicados',
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
        colors: ['#3498db', '#f39c12'], // Azul (Fracionado), Laranja (Dedicado)
        legend: {
          position: 'bottom',
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} fretes`,
          },
        },
        dataLabels: {
          formatter: (val) => {
            return `${val.toFixed(1)}%`;
          },
        }
      },
      series: [],
    };
  },
  async mounted() {
    await this.carregaDadosFreteMensal()
  },
  methods: {
    async carregaDadosFreteMensal() {
      try {

        this.valores = this.dados.data.valores;
        this.options.labels = this.dados.data.labels;

      } catch (error) {
        console.error('Erro ao buscar dados do dashboard', error)
      }
    }
  }
}
</script>
