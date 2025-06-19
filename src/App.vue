
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
  import GlobalLoading from '@/components/global/GlobalLoading.vue'
  import GlobalAlert from '@/components/global/GlobalAlert.vue';
</script>
