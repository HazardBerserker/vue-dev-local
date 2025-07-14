<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Distribuição Período - Quantidade CT-es
    </v-card-title>
    <v-card-text>
      <apexchart type="donut" height="517" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'DestinatarioDistribuicaoPeriodoCte',
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
          zoom: { enabled: false }
        },
        labels: this.labels,
        colors: [
          '#3498db', // azul
          '#2ecc71', // verde
          '#e67e22', // laranja
          '#9b59b6', // roxo
          '#f1c40f', // amarelo
          '#1abc9c', // turquesa
          '#e74c3c', // vermelho
          '#34495e', // azul escuro
          '#95a5a6', // cinza
          '#d35400', // laranja escuro
          '#7f8c8d', // cinza escuro
          '#27ae60', // verde forte
          '#8e44ad', // roxo escuro
          '#2980b9', // azul forte
          '#16a085', // verde água
          '#c0392b', // vermelho escuro
          '#f39c12', // amarelo escuro
          '#bdc3c7', // cinza claro
          '#ff6f61', // coral
          '#6c5ce7'  // violeta
        ],
        tooltip: {
          y: {
            formatter: val => `${val} CT-es`
          }
        },
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
