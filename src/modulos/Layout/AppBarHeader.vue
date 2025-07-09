<template>
  <v-app-bar app class="diagonal-app-bar" color="redNeveah">
    <template v-slot:append>
      <v-img
        width="150"
        src="/logo/cropped-LOGOSEMFUNDO-150x50.png"
        alt="Logo Neveah"
        style="filter: brightness(0) saturate(100%) invert(100%); z-index: 2;"
        class="me-3">
      </v-img>

      <v-menu
        location="bottom center"
        offset-y
        transition="fade-transition"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            color="white"
            v-bind="activatorProps"
            icon
            style="z-index: 3;"
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>

        <v-list class="mt-3 px-2" density="compact" theme="dark"  slim >
          <v-list-item
            color="white"
            @click="emitEditaPerfil"
          >
            <template v-slot:prepend>
              <v-icon>mdi-account-cog</v-icon>
            </template>

            <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item>

            <v-list-item
            base-color="redNeveah"
            @click="emitLogout"
          >
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>

            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
    emitLogout(){
      this.$emit('onLogout')
    },
    emitEditaPerfil() {
      this.$emit('onEditaPerfil')
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
