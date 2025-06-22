<template>
  <teleport to="body">
    <div class="alerts-container mt-13">
      <transition-group name="custom-alert" tag="div">
        <v-alert
          v-for="alert in alerts"
          :key="alert.id"
          :type="alert.type"
          class="mb-2"
          closable
          density="compact"
          elevation="24"
          prominent
          border
          :width="alert.width"
          variant="flat"
          @click:close="removeAlert(alert.id)"
        >
          <template #default>
            <v-progress-linear
              v-if="alert.duration > 0"
              :model-value="alert.progress"
              height="4"
              :color="alert.progressColor"
              bg-opacity="0"
              class="mt-2"
            />
          </template>

          <template #text>
            <div v-html="alert.message"></div>
          </template>
        </v-alert>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useAlertStore } from '@/stores/alertStore'

const alertStore = useAlertStore()
const { alerts, removeAlert } = alertStore
</script>

<style>
.alerts-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.custom-alert-enter-active,
.custom-alert-leave-active {
  transition: all 0.4s ease;
}

.custom-alert-enter-from {
  transform: translateX(40px);
  opacity: 0;
}
.custom-alert-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.custom-alert-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.custom-alert-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
