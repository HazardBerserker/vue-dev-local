<template>
   <div class="h-100">
      Teeste apenas
      <v-btn @click="api()">
         daw
      </v-btn>
   </div>
</template>


<script>
import axios from 'axios';

  export default {
    name: 'TesteZao',
    data () {
      return {
        nada: null
      }
    },
    methods: {
      async api() {
        const PingService = axios.create({
          baseURL: import.meta.env.VITE_API_BASE_URL,
          withCredentials: true,
        })

        await PingService.get('/usuario/usuario-logado')
      }
    }
  }
</script>
