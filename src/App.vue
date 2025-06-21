
<template>
  <router-view v-slot="{ Component }">
    <v-fade-transition>
      <component :is="Component"></component>
    </v-fade-transition>
  </router-view>
  <GlobalLoading />
  <GlobalAlert />
</template>

<script>
  import GlobalLoading from '@/components/GlobalComponents/GlobalLoading.vue';
  import GlobalAlert from '@/components/GlobalComponents/GlobalAlert.vue';


export default {
  components: {
    GlobalLoading,
    GlobalAlert
  }
}
</script>

