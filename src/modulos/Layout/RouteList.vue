<template>
   <v-navigation-drawer app v-model="drawerIsOpen">
      <v-list class="py-0">
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
         <!-- <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item> -->
         <v-list-group v-for="(rota, i) in rotas" :key="`${rota.nome}-${i}`" :value="`${rota.nome}-${i}`">
            <template v-slot:activator="{ props, isOpen }">
               <v-list-item
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
               :prepend-icon="filho.icone"
               :title="filho.nome"
               :to="filho.caminho"
               :value="`${filho.nome}-${i}`"
            ></v-list-item>
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
        open: [],
        rotas: [
          {
            nome: 'Cadastros',
            rotasFilhas: [
              {
                  nome: 'Clientes',
                  caminho: '/teste',
                  icone: 'mdi-domain'
              },
              {
                  nome: 'Motoristas',
                  caminho: '/teste2',
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
