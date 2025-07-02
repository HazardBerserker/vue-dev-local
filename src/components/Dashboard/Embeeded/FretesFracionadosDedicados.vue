<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Fretes Fracionados x Dedicados
    </v-card-title>

    <v-card-text>
      <apexchart
        type="donut"
        width="100%"
        height="315"
        :options="chartOptions"
        :series="series"
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
  computed: {
    chartOptions() {
      return {
        chart: {
          toolbar: { show: true },
          zoom: { enabled: false }
        },
        labels: this.labels,
        colors: ['#f39c12', '#9b59b6', '#3498db'], // Roxo (Fracionado), Laranja (Dedicado), Azul (aéreo)
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
      };
    },
    series() {
      return this.dados.valores
    },
    labels() {
      return this.dados.labels
    }
  },
  // data() {
  //   return {
  //     valores: [],
  //     options: {
  //       chart: {
  //         zoom: { enabled: false },
  //         toolbar: { show: true },
  //       },
  //       labels: [],
  //       colors: ['#f39c12', '#9b59b6', '#3498db'], // Roxo (Fracionado), Laranja (Dedicado), Azul (aéreo)
  //       legend: {
  //         position: 'bottom',
  //       },
  //       tooltip: {
  //         y: {
  //           formatter: (val) => `${val} fretes`,
  //         },
  //       },
  //       dataLabels: {
  //         formatter: (val) => {
  //           return `${val.toFixed(1)}%`;
  //         },
  //       }
  //     },
  //     // series: [],
  //   };
  // },
  // async mounted() {
  //   await this.carregaDadosFreteMensal()
  // },
  // methods: {
  //   async carregaDadosFreteMensal() {
  //     try {

  //       this.valores = this.dados.valores;
  //       this.options.labels = this.dados.labels;

  //     } catch (error) {
  //       console.error('Erro ao buscar dados do dashboard', error)
  //     }
  //   }
  // }
}
</script>
