<template>
  <v-card class="pa-4 border-t-md border-s-sm border-e-sm" elevation="2">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Evolução Mercadoria
    </v-card-title>
    <v-card-text>
      <apexchart height="350" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'DestinatarioValoresMercadoria',
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
        legend: { show: false },
        xaxis: {
          categories: this.dados.labels
        },
        colors: [
          '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#f1c40f',
          '#1abc9c', '#e74c3c', '#34495e', '#95a5a6', '#d35400'
        ],
        tooltip: {
          custom: ({ series, dataPointIndex, w }) => {
            const nomes = w.globals.seriesNames;
            const cores = w.globals.colors;

            const pares = series.map((serie, i) => ({
              nome: nomes[i],
              valor: serie[dataPointIndex] || 0,
              cor: cores[i % cores.length] || '#000'
            }));

            const paresOrdenados = pares.sort((a, b) => b.valor - a.valor);
            const top10 = paresOrdenados.slice(0, 10);

            const total = paresOrdenados.reduce((acc, item) => acc + item.valor, 0);
            const totalFormatado = total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

            const linhas = top10.map(({ nome, valor, cor }) => {
              const valorFormatado = valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
              return `<div style="color: ${cor}; font-size: 13px;"><strong>${nome}:</strong> R$ ${valorFormatado}</div>`;
            });

            return `
              <div class="apex-tooltip pa-4" style="max-height: 450px; overflow-y: auto;">
                <div style="font-weight: bold; margin-bottom: 4px;">TOTAL: R$ ${totalFormatado}</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">(Exibindo os 10 maiores)</div>
                <hr style="margin: 4px 0;" />
                ${linhas.join('')}
              </div>
            `;
          }
        },
        fill: {
          type: 'solid',
          opacity: 0.3
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
