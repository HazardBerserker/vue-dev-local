<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Quantidade de CT-es por UF
    </v-card-title>
    <v-card-text>
      <apexchart type="bar" height="600" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexChart from 'vue3-apexcharts';

export default {
  name: 'QuantidadeCtePorUF.vue',
  components: { apexchart: ApexChart },
  props: {
    dados: {
      type: Array,
      required: true
    }
  },
  computed: {
    series() {
      return [{ data: this.dados.map(uf => uf.total) }];
    },
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          height: 600,
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
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: (val, opt) => {
            const label = this.dados[opt.dataPointIndex]?.uf || '';
            return `${label}: ${val}`;
          },
          dropShadow: {
            enabled: true
          }
        },
        colors: [
          '#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f',
          '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7', '#ffb703', '#023047',
          '#219ebc', '#8ecae6', '#ff6700', '#d4a373', '#3a86ff', '#8338ec',
          '#ff006e', '#fb5607', '#ffbe0b', '#06d6a0', '#118ab2', '#073b4c',
          '#9b5de5', '#f15bb5', '#fee440'
        ],
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: this.dados.map(uf => uf.uf),
          labels: {
            style: { fontSize: '12px' }
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        subtitle: {
          text: 'Distribuição de CT-es por Estado',
          align: 'center',
        },
        tooltip: {
          theme: 'dark',
          x: { show: false },
          y: {
            title: {
              formatter: () => 'Quantidade'
            }
          }
        },
        legend: {
          show: false
        }
      };
    }
  }
};
</script>
