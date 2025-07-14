<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Participação no Faturamento
    </v-card-title>
    <v-card-text>
      <apexchart type="donut" height="517" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'DestinatarioParticipacaoFaturamento',
  components: {
    apexchart: ApexCharts
  },
  props: {
    dados: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartOptions() {
      return {
        plotOptions: {
          pie: {
            donut: {
              size: '80%',
              labels: {
                show: true,
                name: {
                  show: false
                },
                value: {
                  show: true,
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#333',
                  formatter: val => Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) // ⬅️ Aqui limita as casas decimais
                },
                total: {
                  show: true,
                  label: 'Total',
                  fontSize: '16px',
                  color: '#666',
                  formatter: function (w) {
                    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                    return total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })
                  }
                }
              }
            }
          }
        },
        chart: {
          toolbar: { show: true },
          zoom: { enabled: false },
        },
        labels: this.labels,
        tooltip: {
          y: {
            formatter: val => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
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
        legend: false
      };
    },
    series() {
      return this.dados.series;
    },
    labels() {
      return this.dados.labels
    }
  }
};
</script>
