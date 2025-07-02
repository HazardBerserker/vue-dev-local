<template>
  <v-card class="pa-4" elevation="2" height="600">
    <v-card-title class="text-body-1 font-weight-bold mb-4 text-center text-wrap">
      Faturamento por UF (Mapa de Calor)
    </v-card-title>
    <v-card-text style="height: 100%;">
      <highcharts :options="chartOptions" :constructor-type="'mapChart'" />
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'MapaFaturamentoPorUf',
  props: {
    dados: Array
  },
  computed: {
    chartOptions() {
      const dataMap = this.dados.map(item => {
        return [`br-${item.uf.toLowerCase()}`, Number(item.total) || 0]
      })

      return {
        chart: {
          map: 'countries/br/br-all',
          height: 500
        },
        title: {
          text: ''
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        colorAxis: {
          min: 0,
          max: Math.max(...this.dados.map(item => item.total)),
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
          data: dataMap,
          name: 'Faturamento',
          states: {
            hover: {
              color: '#ff6666'
            }
          },
          dataLabels: {
            enabled: true,
            format: '{point.properties.postal-code}'
          },
          tooltip: {
            pointFormatter() {
              const uf = this.properties['postal-code'].toUpperCase()
              const valor = this.value ? this.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'
              return `<b>${uf}</b><br>Faturamento: ${valor}`
            }
          }
        }]
      }
    }
  }
};
</script>
