<template>
  <v-navigation-drawer width="300" :rail="rail" expand-on-hover permanent fixed @update:rail="onRailAtualizado">
    <v-list class="py-2">
      <v-list-item :title="usuario?.nome" :subtitle="usuario?.email">
        <template #prepend>
          <v-icon>
            mdi-account
          </v-icon>
        </template>
        <template #append>
          <v-icon  @click="ativaRail()">
            {{ !rail ? 'mdi-menu-open' : 'mdi-dock-left'}}
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav v-model:opened="open" variant="flat"  base-color="grey-lighten-3" color="redNeveah" density="compact">

      <template v-for="(rota, i) in rotas" :key="`${rota.nome}-${i}`">
          <v-list-group
            v-if="rota.rotasFilhas"
            fluid
            v-model:active="rota.isOpen"
            color="redNeveah"
            base-color="grey-lighten-3"
            style="background-color: white;"
            class="mb-1"
          >
          <template #activator="{ props, isOpen }">
            <v-list-item
              rounded="pill"
              v-bind="props"
              :title="rota.nome"
              :class=" isOpen ? 'elevation-6': ''"
              :prepend-icon="isOpen ? 'mdi-folder-open' : 'mdi-folder'"
              :style="!isOpen ? 'background-color: rgb(244, 244, 244);' : 'background-color:white;'"
            ></v-list-item>
          </template>

          <template v-for="(filho, j) in rota.rotasFilhas"
            :key="`${filho.nome}-${j}`"
          >
            <v-list-item
              v-if="isActiveLink(filho) || !valorAtualDoRail"
              base-color="grey-darken-4"
              variant="text"
              :title="filho.nome"
              :to="filho.caminho"
              :value="`${filho.nome}-${j}`"
              rounded="pill"
              class="mb-1"
            >
              <template #prepend>
                <v-icon size="small">
                  {{ filho.icone }}
                </v-icon>
              </template>
            </v-list-item>
          </template>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

import { useAuthStore } from '@/stores/auth'

export default {
  name: 'RouteList',
  computed: {
    usuario() {
      return useAuthStore().user
    },
    rotas() {
      return [
        ...this.rotasGerais(),
        this.rotasMenuCliente()
      ]
    }
  },
  data() {
    return {
      valorAtualDoRail: true,
      rail: true,
      open: [],
    }
  },
  methods: {
    ativaRail(){
      this.rail = !this.rail
      this.valorAtualDoRail = false
    },

    onRailAtualizado(railValue){
      if(!this.rail) {
          return;
      }
      this.valorAtualDoRail = railValue
    },

    isActiveLink(item) {
      return this.$route.path === item.caminho; // Compara o caminho da URL com o link do item
    },

    acessoDeCliente() {
      const usuarioEhCliente = this.usuario?.id_cliente != null
      return usuarioEhCliente
    },

    rotasGerais() {

      if(this.acessoDeCliente()) {
        return [];
      }

      const rotasAdmin = [{
        nome: 'Cadastros',
        rotasFilhas: [
          {
            nome: 'Clientes',
            caminho: '/cadastros/clientes',
            icone: 'mdi-domain'
          },
          {
            nome: 'Motoristas',
            caminho: '/cadastros/motoristas',
            icone: 'mdi-card-account-details-outline'
          }
        ],
      },
      {
        nome: 'Comercial',
        rotasFilhas: [
          {
            nome: 'Nova Cotação',
            caminho: '/comercial/nova-cotacao',
            icone: 'mdi-clipboard-plus-outline'
          },
          {
            nome: 'Fretes/Cotações',
            caminho: '/comercial/fretes-cotacoes',
            icone: 'mdi-clipboard-text-multiple'
          }
        ],
      },
      {
        nome: 'Financeiro',
        rotasFilhas: [
          {
            nome: 'Pagamento Motoristas',
            caminho: '/financeiro/pagamento-motoristas',
            icone: 'mdi-account-credit-card-outline'
          },
        ],
      },
      {
        nome: 'Fiscal',
        rotasFilhas: [
          {
            nome: 'Registrar CTE',
            caminho: '/fiscal/registrar-cte',
            icone: 'mdi-note-plus-outline'
          },
        ],
      },
      {
        nome: 'Dashboards',
        rotasFilhas: [
          {
            nome: 'Métricas Gerais',
            caminho: '/dashboard/metricas-gerais',
            icone: 'mdi-chart-box'
          },
        ],
      },
      {
        nome: 'Aplicativo',
        rotasFilhas: [
          {
            nome: 'Gerar Rota',
            caminho: '',
            icone: 'mdi-routes'
          },

        ],
      }]

      return rotasAdmin
    },

    rotasMenuCliente() {
      let rotaDoCliente = {
        nome: 'Menu do Cliente',
      }

      let rotaFilha = [
        {
          nome: 'Meus Fretes',
          caminho: '/menu-do-cliente/meus-fretes',
          icone: 'mdi-domain'
        },
      ]

      if(this.acessoDeCliente()) {
        const rotaDashboard = {
          nome: 'Meu Dashboard',
          caminho: '/dashboard/metricas-gerais',
          icone: 'mdi-chart-box'
        }
        rotaFilha.push(rotaDashboard)
      }

      rotaDoCliente['rotasFilhas'] = rotaFilha

      return rotaDoCliente
    }

  }
}
</script>
