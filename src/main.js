import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import './assets/styles/global.css'
import vuetify from '@/plugins/vuetify';

// GERENCIAMENTO DO ESTADO
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(vuetify)
app.mount('#app')
