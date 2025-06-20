
<template>
  <router-view v-slot="{ Component }">
    <v-fade-transition>
      <component :is="Component"></component>
    </v-fade-transition>
  </router-view>
  <GlobalLoading />
  <GlobalAlert />
</template>

<script setup>
  import GlobalLoading from '@/components/Global/GlobalLoading.vue'
  import GlobalAlert from '@/components/Global/GlobalAlert.vue';
</script>
