<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Dados por UF - Faturamento
    </v-card-title>
    <v-card-text>
      <apexchart type="bar" height="506" :options="options" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'FaturamentoPorUF',
  components: { apexchart: ApexCharts },
  props: {
    dados: { type: Array, required: true }
  },
  computed: {
    series() {
      return [
        {
          name: 'Faturamento',
          data: this.dados.map(uf => uf.total)
        }
      ];
    },
    options() {
      return {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
            barHeight: '100%',
            dataLabels: {
              position: 'bottom'
            }
          }
        },
        xaxis: {
          categories: this.dados.map(uf => uf.uf)
        },
        colors: [
          '#2c3e50', // azul petróleo escuro
          '#27ae60', // verde escuro vibrante
          '#d35400', // laranja queimado
          '#8e44ad', // roxo profundo
          '#f39c12', // amarelo queimado
          '#16a085', // verde água escuro
          '#c0392b', // vermelho escuro
          '#1f2d3d', // azul grafite
          '#7f8c8d', // cinza escuro
          '#e84393', // rosa vibrante
          '#2980b9', // azul forte
          '#2d3436', // cinza grafite
          '#6c5ce7', // violeta neon
          '#e67e22', // laranja vibrante
          '#00b894'  // verde menta escuro
        ],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: { colors: ['#fff'] },
          formatter: (val, opt) => {
            const label = opt.w.globals.labels[opt.dataPointIndex] || '';
            return `${label}: R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          },
          offsetX: 0,
          dropShadow: { enabled: true }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        yaxis: {
          labels: { show: false }
        },
        subtitle: {
          text: 'Distribuição de valores por Estado',
          align: 'center',
        },
        tooltip: {
          theme: 'dark',
          y: {
            formatter: val => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
        },
        legend: { show: false }
      };
    }
  }
}
</script>
