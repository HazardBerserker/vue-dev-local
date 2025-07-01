<template>
  <div>
    <v-breadcrumbs :items="['Dashboard']" class="mb-6"></v-breadcrumbs>

    <div v-if="permissao">
      <v-row>
        <v-col cols="12">
          <IndicadoresFrete :dados="dadosIndicadoresFrete" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <GanhosEPerdasCotacoes :dados="dadosganhosEPerdasCotacoes"/>
        </v-col>
        <v-col cols="4">
          <FretesFracionadosDedicados :dados="dadosFretesFracionadosEDedicados"/>
        </v-col>
        <v-col cols="4">
          <FretesOTD :dados="dadosFretesOTD"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <FreteVsMercadoria :dados="dadosFreteVsMercadoria"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <Top5ClientesFaturamentoLinha :dados="dadosTop5ClientesFaturamento"/>
        </v-col>
        <v-col cols="6">
          <Top5ClientesFaturamentoDonut :dados="dadosTop5ClientesFaturamento"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <Top5ClientesQuantidadeCteLinha :dados="dadosTop5ClientesQuantidadeCteLinha"/>
        </v-col>
        <v-col cols="6">
          <Top5ClientesQuantidadeCteDonut :dados="dadosTop5ClientesQuantidadeCteDonut"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <QuantidadeCtePorUF :dados="dadosPorUfQuantidadeCte"/>
        </v-col>
        <v-col cols="6">
          <FaturamentoPorUF :dados="dadosPorUfFaturamento"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <MapaQuantidadeCtePorUf :dados="dadosPorUfQuantidadeCte"/>
        </v-col>
        <v-col cols="6">
          <MapaFaturamentoPorUf :dados="dadosPorUfFaturamento"/>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import ApiService from '@/services/ApiService'
import GanhosEPerdasCotacoes from '@/components/Dashboard/Embeeded/GanhosEPerdasCotacoes.vue';
import FretesFracionadosDedicados from '@/components/Dashboard/Embeeded/FretesFracionadosDedicados.vue';
import { endpoints } from '@/utils/apiEndpoints';
import FretesOTD from '@/components/Dashboard/Embeeded/FretesOTD.vue';
import IndicadoresFrete from '@/components/Dashboard/Embeeded/IndicadoresFrete.vue';
import FreteVsMercadoria from '@/components/Dashboard/Embeeded/FreteVsMercadoria.vue';
import Top5ClientesFaturamentoLinha from '@/components/Dashboard/Embeeded/Top5ClientesFaturamentoLinha.vue';
import Top5ClientesFaturamentoDonut from '@/components/Dashboard/Embeeded/Top5ClientesFaturamentoDonut.vue';
import Top5ClientesQuantidadeCteLinha from '@/components/Dashboard/Embeeded/Top5ClientesQuantidadeCteLinha].vue';
import Top5ClientesQuantidadeCteDonut from '@/components/Dashboard/Embeeded/Top5ClientesQuantidadeCteDonut.vue';
import QuantidadeCtePorUF from '@/components/Dashboard/Embeeded/QuantidadeCtePorUF.vue';
import FaturamentoPorUF from '@/components/Dashboard/Embeeded/FaturamentoPorUF.vue';
import MapaFaturamentoPorUf from '@/components/Dashboard/Embeeded/MapaFaturamentoPorUf.vue';
import MapaQuantidadeCtePorUf from '@/components/Dashboard/Embeeded/MapaQuantidadeCtePorUf.vue';

export default {
  name: 'DashboardView',
  components: {
    GanhosEPerdasCotacoes,
    FretesFracionadosDedicados,
    FretesOTD,
    IndicadoresFrete,
    FreteVsMercadoria,
    Top5ClientesFaturamentoLinha,
    Top5ClientesFaturamentoDonut,
    Top5ClientesQuantidadeCteLinha,
    Top5ClientesQuantidadeCteDonut,
    QuantidadeCtePorUF,
    FaturamentoPorUF,
    MapaFaturamentoPorUf,
    MapaQuantidadeCtePorUf
  },
  data() {
    return {
      dadosganhosEPerdasCotacoes: null,
      dadosFretesFracionadosEDedicados: null,
      dadosFretesOTD: null,
      dadosIndicadoresFrete: null,
      dadosFreteVsMercadoria: null,
      dadosTop5ClientesFaturamento: null,
      dadosTop5ClientesQuantidadeCteLinha: null,
      dadosTop5ClientesQuantidadeCteDonut: null,
      dadosPorUfFaturamento: null,
      dadosPorUfQuantidadeCte: null,
      permissao: false
    };
  },
  async mounted() {
    await this.buscaGanhosEPerdasCotacoes()
    await this.buscaFretesFracionadosEDedicados()
    await this.buscaFretesOTD()
    await this.carregaIndicadoresFrete()
    await this.carregaFreteVsMercadoria()
    await this.carregaTop5ClientesFaturamento()
    await this.carregaTop5ClientesQuantidadeCte()
    await this.carregaDadosPorUF()
    this.permissao = true
  },
  methods: {
    async buscaGanhosEPerdasCotacoes() {
      try {

        const endpoint = endpoints.dashboard.ganhosEPerdasCotacoes;

        const resposta =  await ApiService({
          method: 'get',
          url: endpoint,
        })

        this.dadosganhosEPerdasCotacoes = resposta

      } catch (error) {
        console.error('Erro ao buscar carregaDadosFreteMensal', error)
      }
    },

    async buscaFretesFracionadosEDedicados() {
      try {
        const resposta =  await ApiService({
          method: 'get',
          url: 'http://api-dev.local/dashboard/fretes-fracionados-dedicados',
        })

        this.dadosFretesFracionadosEDedicados = resposta

      } catch (error) {
        console.error('Erro ao buscar carregaDadosFretesFracionadosEDedicados', error)
      }
    },

    async buscaFretesOTD() {
      try {
        const resposta = await ApiService({
          method: 'get',
          url: 'http://api-dev.local/dashboard/otd',
        });

        this.dadosFretesOTD = resposta;
      } catch (error) {
        console.error('Erro ao buscar OTD', error);
      }
    },

    async carregaIndicadoresFrete() {
      try {
        const resposta = await ApiService({
          method: 'get',
          url: 'http://api-dev.local/dashboard/indicadores-fretes',
          // params: {
          //   ano: this.filtros.ano,
          //   tomador: this.filtros.tomador,
          //   uf: this.filtros.uf
          // }
        })

        this.dadosIndicadoresFrete = resposta;
      } catch (error) {
          console.error('Erro ao carregar indicadores de frete', error);
      }
    },

    async carregaFreteVsMercadoria() {
      try {
        const resposta = await ApiService({
          method: 'get',
          url: 'http://api-dev.local/dashboard/frete-vs-mercadoria',
          // params: {
          //   ano: this.filtros.ano,
          //   tomador: this.filtros.tomador,
          //   uf: this.filtros.uf
          // }
        })

        this.dadosFreteVsMercadoria = resposta.data.data;
      } catch (error) {
          console.error('Erro ao carregar indicadores de frete', error);
      }
    },

    async carregaTop5ClientesFaturamento() {
      try {
        const resposta = await ApiService({
          method: 'get',
          url: 'http://api-dev.local/dashboard/top5-clientes-faturamento',
          // params: {
          //   ano: this.filtros.ano,
          //   tomador: this.filtros.tomador,
          //   uf: this.filtros.uf
          // }
        })

        this.dadosTop5ClientesFaturamento = resposta.data;
      } catch (error) {
          console.error('Erro ao carregar indicadores de frete', error);
      }
    },

    async carregaTop5ClientesQuantidadeCte() {
      try {
        const resposta = await ApiService({
          method: 'get',
          url: 'http://api-dev.local/dashboard/top5-clientes-quantidade-cte',
          // params: {
          //   ano: this.filtros.ano,
          //   tomador: this.filtros.tomador,
          //   uf: this.filtros.uf
          // }
        })

        this.dadosTop5ClientesQuantidadeCteLinha = resposta.data.linha;
        this.dadosTop5ClientesQuantidadeCteDonut = resposta.data.donut;
      } catch (error) {
          console.error('Erro ao carregar indicadores de frete', error);
      }
    },

    async carregaDadosPorUF() {
      try {
        const resposta = await ApiService({
          method: 'get',
          url: 'http://api-dev.local/dashboard/dados-por-uf',
          // params: {
          //   ano: this.filtros.ano,
          //   tomador: this.filtros.tomador,
          //   uf: this.filtros.uf
          // }
        })

        this.dadosPorUfFaturamento = resposta.data.frete;
        this.dadosPorUfQuantidadeCte = resposta.data.quantidade;
      } catch (error) {
          console.error('Erro ao carregar indicadores de frete', error);
      }
    },
  }
}
</script>
