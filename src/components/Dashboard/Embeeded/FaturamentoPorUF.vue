<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-text>
      <apexchart type="bar" height="600" :options="options" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexChart from 'vue3-apexcharts';

export default {
  name: 'FaturamentoPorUF',
  components: { apexchart: ApexChart },
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
          toolbar: { show: false }
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
          '#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B',
          '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7',
          '#ffb703', '#023047', '#219ebc', '#8ecae6', '#ff6700',
          '#d4a373', '#3a86ff', '#8338ec', '#ff006e', '#fb5607',
          '#ffbe0b', '#06d6a0', '#118ab2', '#073b4c', '#9b5de5',
          '#f15bb5', '#fee440'
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
        title: {
          text: 'Dados por UF - Faturamento',
          align: 'center',
          floating: true
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
