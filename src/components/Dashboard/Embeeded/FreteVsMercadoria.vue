<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Fretes x Mercadoria
    </v-card-title>
    <v-card-text>
      <apexchart
        type="area"
        height="300"
        :options="options"
        :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'FreteVsMercadoriaChart',
  components: { apexchart: ApexCharts },
  props: {
    dados: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      options: {
        chart: {
          type: 'area',
          zoom: { enabled: false }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          categories: [],
          labels: {
            rotate: -45
          }
        },
        yaxis: {
          labels: {
            formatter: val => val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })
          }
        },
        tooltip: {
          y: {
            formatter: val => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        },
        colors: ['#1abc9c', '#e67e22']
      },
      series: []
    };
  },
  mounted() {
    this.carregarSeries();
  },
  watch: {
    dados: {
      handler() {
        this.carregarSeries();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    carregarSeries() {
      console.log(this.dados.data);

      const categorias = this.dados.map(item => item.mes);
      const serieFrete = this.dados.map(item => item.frete);
      const serieMercadoria = this.dados.map(item => item.mercadoria);

      this.options.xaxis.categories = categorias;

      this.series = [
        { name: 'Frete', data: serieFrete },
        { name: 'Mercadoria', data: serieMercadoria }
      ];
    }
  }
}
</script>
