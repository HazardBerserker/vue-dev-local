<template>
    <v-navigation-drawer app v-model="drawerIsOpen" width="320">
        <v-list class="py-0 w-100">
          <v-list-item :title="usuario?.nome" :subtitle="usuario?.email" class="py-3 d-flex">
            <template #prepend>
                <v-icon class="justify-center">
                  mdi-account
                </v-icon>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav v-model:opened="open" variant="flat"  base-color="grey-lighten-3" color="redNeveah" density="compact">
          <v-list-group v-for="(rota, i) in rotas" :key="`${rota.nome}-${i}`" :value="`${rota.nome}-${i}`">
              <template v-slot:activator="{ props, isOpen }">
                <v-list-item
                    rounded="pill"
                    :prepend-icon="isOpen ? 'mdi-folder-open' : 'mdi-folder'"
                    v-bind="props"
                    :title="rota.nome"
                >
                </v-list-item>
              </template>
              <v-list-item
                v-for="(filho, i) in rota?.rotasFilhas"
                :key="`${filho.nome}-${i}`"
                base-color="grey-darken-4"
                variant="text"
                :title="filho.nome"
                :to="filho.caminho"
                :value="`${filho.nome}-${i}`"
                rounded="pill"
                class="mb-1"
              >
                <template #prepend>
                    <v-icon size="small">
                      {{ filho.icone }}
                    </v-icon>
                  </template>
              </v-list-item>
          </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>

import { useAuthStore } from '@/stores/auth'

export default {
   name: 'RouteList',
   props: {
      modelValue: {
         type: Boolean,
         required: true
      }
   },
   computed: {
      drawerIsOpen: {
         get(){
            return this.modelValue
         },
         set(value){
            this.$emit('update:modelValue', value)
         }
      },
      usuario() {
        return useAuthStore().user
      }
   },
   data() {
      return {
        width: this.modelValue ? '250px' : '60px',
        open: [],
        rotas: [
          {
            nome: 'Cadastros',
            rotasFilhas: [
              {
                  nome: 'Clientes',
                  caminho: '/cadastros/clientes',
                  icone: 'mdi-domain'
              },
              {
                  nome: 'Motoristas',
                  caminho: '',
                  icone: 'mdi-card-account-details-outline'
              }
            ],
          },
          {
            nome: 'Comercial',
            rotasFilhas: [
              {
                  nome: 'Nova Cotação',
                  caminho: '',
                  icone: 'mdi-clipboard-plus-outline'
              },
              {
                  nome: 'Fretes/Cotações',
                  caminho: '',
                  icone: 'mdi-clipboard-text-multiple'
              }
            ],
          },
          {
            nome: 'Financeiro',
            rotasFilhas: [
              {
                  nome: 'Pagamento Motoristas',
                  caminho: '',
                  icone: 'mdi-account-credit-card-outline'
              },
            ],
          },
          {
            nome: 'Fiscal',
            rotasFilhas: [
              {
                  nome: 'Registrar CTE',
                  caminho: '',
                  icone: 'mdi-note-plus-outline'
              },
            ],
          },
          {
            nome: 'Dashboards',
            rotasFilhas: [
              {
                  nome: 'Dashboards',
                  caminho: '',
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
          },
          {
            nome: 'Menu do Cliente',
            rotasFilhas: [
              {
                  nome: 'Meus Fretes',
                  caminho: '',
                  icone: 'mdi-domain'
              },
              {
                  nome: 'Dashboard Cliente',
                  caminho: '',
                  icone: 'mdi-chart-box'
              }
            ],
          }
      ],
    }
  }
}
</script>
