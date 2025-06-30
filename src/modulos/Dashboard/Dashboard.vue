<template>
  <div>
    <v-breadcrumbs :items="['Dashboard']" class="mb-6"></v-breadcrumbs>

    <div v-if="permissao">
      <v-row>
        <v-col cols="4">
          <GanhosEPerdasCotacoes :dados="ganhosEPerdasCotacoesDados"/>
        </v-col>
        <v-col cols="4">
          <FretesFracionadosDedicados :dados="carregaDadosFretesFracionadosEDedicadosDados"/>
        </v-col>
        <v-col cols="4">
          <!-- <FretesOTD :dados="carregaDadosFretesOTD"/> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <IndicadoresFrete :dados="dadosIndicadoresFrete" />
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
// import FretesOTD from '@/components/Dashboard/Embeeded/FretesOTD.vue';
import IndicadoresFrete from '@/components/Dashboard/Embeeded/IndicadoresFrete.vue';

export default {
  name: 'DashboardView',
  components: {
    GanhosEPerdasCotacoes,
    FretesFracionadosDedicados,
    // FretesOTD,
    IndicadoresFrete
  },
  data() {
    return {
      ganhosEPerdasCotacoesDados: null,
      carregaDadosFretesFracionadosEDedicadosDados: null,
      carregaDadosFretesOTD: null,
      dadosIndicadoresFrete: null,
      permissao: false
    };
  },
  async mounted() {
    await this.buscaGanhosEPerdasCotacoes()
    await this.buscaFretesFracionadosEDedicados()
    // await this.buscaFretesOTD()
    await this.carregaIndicadoresFrete()
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

        this.ganhosEPerdasCotacoesDados = resposta

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

        this.carregaDadosFretesFracionadosEDedicadosDados = resposta

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

        this.carregaDadosFretesOTD = resposta;
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
    }
  }
}
</script>
