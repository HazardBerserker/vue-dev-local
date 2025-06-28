
<template>
  <router-view v-slot="{ Component }">
    <v-fade-transition>
      <component :is="Component"></component>
    </v-fade-transition>
  </router-view>
  <GlobalLoading />
  <GlobalAlert />
  <GlobalDialogConfirm ref="dialogRef" />
</template>

<script setup>
  import { ref, provide } from 'vue'
  import GlobalLoading from '@/components/GlobalComponents/GlobalLoading.vue'
  import GlobalAlert from '@/components/GlobalComponents/GlobalAlert.vue';
  import GlobalDialogConfirm from './components/GlobalComponents/GlobalDialogConfirm.vue';


  const dialogRef = ref()
  provide('dialog', dialogRef)
</script>
