import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/styles/global.css'
import vuetify from '@/plugins/vuetify';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// GERENCIAMENTO DO ESTADO
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(vuetify)
app.mount('#app')
