<template>
   <v-app-bar app class="diagonal-app-bar" color="redNeveah">
      <v-app-bar-nav-icon @click="emitEscondeOuExpandeRouteList"/>

      <template v-slot:append>
          <v-img
            width="150"
            src="/logo/cropped-LOGOSEMFUNDO-150x50.png"
            alt="Logo Neveah"
            style="filter: brightness(0) saturate(100%) invert(100%); z-index: 2;"
            class="me-3">
          </v-img>

         <v-speed-dial
            location="bottom center"
            transition="fade-transition"
         >
            <template v-slot:activator="{ props: activatorProps }">
               <v-btn
                  color="white"
                  v-bind="activatorProps"
                  icon="mdi-cog"
                  class="me-2"
            style="z-index: 3;"

               >
               </v-btn>
            </template>
            <v-btn key="1" color="grey-darken-3" icon="mdi-logout" v-tooltip="'Logout'" @click="emitLogout"></v-btn>
         </v-speed-dial>
      </template>
   </v-app-bar>
</template>

<script>
export default {
   name: 'AppBarHeader',
   data() {
    return {
      logo: new URL('@/assets/logo/cropped-LOGOSEMFUNDO-150x50.png', import.meta.url).href
    }
   },
   methods: {
      emitEscondeOuExpandeRouteList() {
        this.$emit('onEscondeRouteList')
      },
      emitLogout(){
        this.$emit('onLogout')
      }
   }
}
</script>

<style scoped>

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

</style>
