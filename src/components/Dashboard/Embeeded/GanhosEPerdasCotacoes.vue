<template>
  <v-card class="pa-4" elevation="2">
  <v-card-title class="text-h6 font-weight-bold mb-4">
    Cotações Ganhas vs Perdidas por Mês
  </v-card-title>

  <v-card-text>
    <apexchart
      width="100%"
      height="300"
      type="bar"
      :options="options"
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
  data() {
    return {
      meses: [],
      ganhos: [],
      perdas: [],
      options: {
        chart: { type: 'bar', stacked: true },
        colors: ['#2ecc71', '#e74c3c'], // Verde e vermelho
        xaxis: {
          categories: [], // nomes dos meses
        },
        plotOptions: {
          bar: { horizontal: false },
        },
        legend: { position: 'top' }
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

        this.meses = this.dados.data.map(item => item.mes);
        this.ganhos = this.dados.data.map(item => item.ganhos);
        this.perdas = this.dados.data.map(item => item.perdas);

        this.options.xaxis.categories = this.meses;

        this.series = [
          { name: 'Ganhos', data: this.ganhos },
          { name: 'Perdas', data: this.perdas },
        ];
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard', error)
      }
    }
  }
}
</script>
