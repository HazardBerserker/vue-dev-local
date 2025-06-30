<template>
  <v-card class="pa-4" elevation="2" height="600">
    <v-card-text style="height: 100%;">
      <highcharts :options="chartOptions" constructor-type="mapChart" />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MapaQuantidadeCtePorUf',
  props: {
    dados: Array // ← formato: [{ uf: "SP", total: 2 }, ...]
  },
  computed: {
    chartOptions() {
      // converte para formato do Highcharts com a chave hc-key
      const dataMap = this.dados.map(item => ({
        'hc-key': `br-${item.uf.toLowerCase()}`,
        value: Number(item.total) || 0
      }));

      return {
        chart: {
          map: 'countries/br/br-all',
          height: 500
        },
        title: {
          text: 'Quantidade de Fretes por UF'
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        colorAxis: {
          min: 0,
          max: Math.max(...this.dados.map(i => i.total)),
          stops: [
            [0, '#ffe5e5'],
            [0.25, '#ff9999'],
            [0.5, '#ff6666'],
            [0.75, '#ff3333'],
            [1, '#ff0000']
          ]
        },
        legend: {
          enabled: false
        },
        series: [{
          name: 'Quantidade',
          data: dataMap,
          joinBy: 'hc-key',
          states: {
            hover: {
              color: '#ff9999'
            }
          },
          dataLabels: {
            enabled: true,
            format: '{point.properties.postal-code}'
          },
          tooltip: {
            pointFormatter() {
              const uf = this.properties['postal-code']?.toUpperCase() || 'UF';
              return `<b>${uf}</b><br>Fretes: ${this.value}`;
            }
          }
        }]
      };
    }
  }
};
</script>
