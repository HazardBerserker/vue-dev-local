import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/styles/global.css'
import vuetify from '@/plugins/vuetify';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {mask} from 'vue-the-mask'
import { VueMaskFilter } from 'v-mask';

// GERENCIAMENTO DO ESTADO
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

// diretivas
app.directive('mask', mask);

app.config.globalProperties.$VMask = (value, pattern) => {
  return VueMaskFilter(value, pattern);
};

// plugins
app.use(router)
app.use(pinia)
app.use(vuetify)

app.mount('#app')
