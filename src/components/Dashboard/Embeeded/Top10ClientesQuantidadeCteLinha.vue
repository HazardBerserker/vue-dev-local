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
          custom: ({ series, dataPointIndex, w }) => {
            if (this.acessoDeCliente) {
              // Cliente vê só o valor simples, sem nomes
              const valor = series[0][dataPointIndex]; // geralmente só 1 série para cliente
              return `
                <div class="apex-tooltip">
                  <span><strong>Quantidade:</strong> ${valor} CT-es</span>
                </div>
              `;
            } else {
              // Admin vê lista ordenada dos 10 maiores, com cores e total no topo
              const nomes = w.globals.seriesNames;
              const cores = w.globals.colors;

              // Junta nome, valor e cor para cada série
              const pares = series.map((serie, i) => ({
                nome: nomes[i],
                valor: serie[dataPointIndex] || 0,
                cor: cores[i % cores.length] || '#000'
              }));

              // Ordena do maior para o menor valor
              const paresOrdenados = pares.sort((a, b) => b.valor - a.valor);

              // Pega só os 10 maiores (já deve ter no máximo 10, mas garantimos)
              const top10 = paresOrdenados.slice(0, 10);

              // Soma total do ponto do gráfico
              const total = pares.reduce((acc, item) => acc + item.valor, 0);
              const totalFormatado = total.toLocaleString('pt-BR', { minimumFractionDigits: 0 });

              // Monta as linhas do tooltip
              const linhas = top10.map(({ nome, valor, cor }) => {
                const valorFormatado = valor.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
                return `<div style="color: ${cor}; font-size: 13px;"><strong>${nome}:</strong> ${valorFormatado} CT-es</div>`;
              });

              return `
                <div class="apex-tooltip pa-4" style="max-height: 450px; overflow-y: auto;">
                  <div style="font-weight: bold; margin-bottom: 4px;">TOTAL: ${totalFormatado} CT-es</div>
                  <div style="font-size: 12px; color: #666; margin-bottom: 4px;">(Exibindo os 10 maiores)</div>
                  <hr style="margin: 4px 0;" />
                  ${linhas.join('')}
                </div>
              `;
            }
          }
        }
      }
    }
  }
}
</script>
