<template>
   <div class="d-flex h-screen w-100">
      <div class="d-flex w-100 fill-height justify-center align-center dynamic-background">
         <!-- <img src="@/assets/logo.png" alt="Logo da empresa" class="logo" /> -->
         <div class="d-flex flex-column ga-3 w-100 justify-center align-start" style="max-width: 500px;">
            <span class="text-h6 text-start text-white"><strong>NEVESYS</strong></span>
            <v-text-field
               v-model="email"
               :prepend-inner-icon="mdiAccountCircle"
               icon-color="orange-darken-4"
               base-color="orange-darken-4"
               color="orange-darken-4"
               class="w-100"
               hide-details="auto"
               label="Usuário"
               variant="solo"
               density="comfortable"
            ></v-text-field>
            <v-text-field
               v-model="senha"
               :prepend-inner-icon="mdiShieldKey"
               icon-color="orange-darken-4"
               base-color="orange-darken-4"
               color="orange-darken-4"  
               class="w-100"
               hide-details="auto"
               label="Senha"
               variant="solo"
               density="comfortable"
               type="password"
               :append-inner-icon="mdiEyeOffOutline"
            ></v-text-field>
            <v-btn
               class="w-100"
               color="orange-darken-4"
               @click="login"
            >
               Entrar
            </v-btn>
         </div>
         

      </div>

      <!-- Lado direito: Formulário -->
      <div class="d-flex fill-height bg-white w-100">
         d
      </div>

   </div>
</template>

<script setup>
   import { mdiAccountCircle } from '@mdi/js'
   import { mdiShieldKey } from '@mdi/js'
   import { mdiEyeOutline } from '@mdi/js'
   import { mdiEyeOffOutline } from '@mdi/js'
</script>

<script>

import { useAuthStore } from '@/stores/auth'

export default {
   name: 'Login',
   data() {
      return {
         email: '',
         senha: ''
      }
   },
   methods: {

      async login() {
         const auth = useAuthStore()

         try {

            const resposta = await auth.login({ email: this.email, password: this.senha });

            console.log(resposta);
            
            
         } catch (error) {
            console.log('Falha no login: ' + (error.response?.data?.message || error.message));
         }
      }
      
   }
}
</script>

<style scoped>

.dynamic-background {
  height: 100vh;
  width: 100%;
  background: linear-gradient(-45deg, rgb(209, 50, 35), rgb(160, 13, 0), rgb(211, 36, 20), rgb(253, 71, 71));
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

</style>