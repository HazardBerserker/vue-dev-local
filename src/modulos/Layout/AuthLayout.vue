<template>
  <v-app>
      <RouteList v-model="drawer"/>

      <AppBarHeader @onEscondeRouteList="drawer = !drawer" @onLogout="logout"/>

      <v-main class="height-screen d-flex align-center justify-center">
         <v-container class="main" fluid>
            <router-view v-slot="{ Component }">
              <Transition name="fade" mode="out-in">
                <component :is="Component" />
              </Transition>
            </router-view>
         </v-container>
      </v-main>
  </v-app>
</template>

<script>
import RouteList from '@/modulos/Layout/RouteList.vue';
import AppBarHeader from '@/modulos/Layout/AppBarHeader.vue';
import { useAuthStore } from '@/stores/auth'

export default {
   components: {
      RouteList,
      AppBarHeader
   },
   data() {
      return {
         drawer: true,
      }
   },
   methods: {
      logout() {
         const auth = useAuthStore()
         auth.logout()
      }
   }
}
</script>

<style>
.main {
  height: 93.746vh;
}

.diagonal-app-bar::before {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 30%;
  background-color: black;

  /* cria o corte diagonal */
  clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
  z-index: 1;
}

.v-toolbar-title {
  position: relative;
  z-index: 2;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
