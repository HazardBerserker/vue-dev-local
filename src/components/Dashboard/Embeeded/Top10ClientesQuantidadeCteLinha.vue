<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      {{ acessoDeCliente ? 'Evolução Quantidade CT-es' : 'Evolução Quantidade CT-es - Top 10'}}
    </v-card-title>
    <v-card-text>
      <apexchart
        type="line"
        height="350"
        :options="options"
        :series="dados"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts'

export default {
  name: 'Top10ClientesQuantidadeCteLinha',
  components: { apexchart: ApexCharts },
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
      options: {
        chart: { type: 'line',
          zoom: { enabled: false }
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
        stroke: { width: 2 },
        xaxis: {
          categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
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
            const valor = series[seriesIndex][dataPointIndex]

            if (this.acessoDeCliente) {
              // Cliente não deve ver nome da série
              return `<div class="apex-tooltip">
                <span><strong>Quantidade:</strong> ${valor} CT-es</span>
              </div>`;
            } else {
              // Admin ou geral vê nome da série
              const nomeCliente = w.globals.seriesNames[seriesIndex]
              return `<div class="apex-tooltip">
                <div><strong>${nomeCliente}</strong></div>
                <span>Quantidade: ${valor} CT-es</span>
              </div>`;
            }
          }
        }
      }
    }
  }
}
</script>
