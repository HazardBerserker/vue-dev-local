<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      {{ acessoDeCliente ? 'Evolução Faturamento' : 'Evolução Faturamento CT-es - Top 10 Clientes'}}
    </v-card-title>
    <v-card-text>
      <apexchart type="line" height="350" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'Top10ClientesFaturamentoLinha',
  components: {
    apexchart: ApexCharts
  },
  props: {
    dados: {
      type: Object,
      required: true
    },
    acessoDeCliente: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'line',
          zoom: { enabled: false }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        legend: {
          position: 'right',
          formatter: (seriesName) => {
            const limiteCaracteres = 18;
            return seriesName.length > limiteCaracteres
              ? seriesName.slice(0, limiteCaracteres) + '...'
              : seriesName;
          },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: this.dados.labels,
        },
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
        ],
        tooltip: {
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const valor = series[seriesIndex][dataPointIndex];
            const valorFormatado = valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

            if (this.acessoDeCliente) {
              return `<div class="apex-tooltip">
                <span><strong>Valor Mercadoria:</strong> R$ ${valorFormatado}</span>
              </div>`;
            } else {
              const nomeCliente = w.globals.seriesNames[seriesIndex];
              return `<div class="apex-tooltip">
                <div><strong>${nomeCliente}</strong></div>
                <span>Valor Mercadoria: R$ ${valorFormatado}</span>
              </div>`;
            }
          }
        }
      },
      series: this.dados.series
    };
  },
  watch: {
    dados: {
      handler() {
        this.series = this.dados.series;
        this.chartOptions.xaxis.categories = this.dados.labels;
      },
      deep: true
    }
  }
};
</script>
