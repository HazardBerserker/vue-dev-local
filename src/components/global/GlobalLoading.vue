<!-- src/components/GlobalLoading.vue -->
<template>
  <v-dialog
    v-model="loading.isLoading"
    persistent
    max-width="400"
  >
    <v-list
      class="py-2"
      color="primary"
      elevation="12"
      rounded="lg"
    >
      <v-list-item
        :title="loading.message"
      >
        <template v-slot:prepend>
          <div class="pe-4">
            <v-img
              width="120"
              src="/logo/cropped-LOGOSEMFUNDO-150x50.png"
              alt="Logo Neveah"
              class="me-3">
            </v-img>
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script setup>
  import { useLoadingStore } from '@/stores/loading'
  const loading = useLoadingStore()
</script>
