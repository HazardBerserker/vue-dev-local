<template>
   <div class="d-flex h-screen w-100">
      <div class="d-flex w-100 fill-height justify-center align-center dynamic-background">
         <div class="wave"></div>
         <div class="wave"></div>
         <div class="wave"></div>

         <!-- <img src="@/assets/logo.png" alt="Logo da empresa" class="logo" /> -->
         <div class="d-flex flex-column ga-3 w-100 justify-center align-start content" style="max-width: 500px;">
            <span class="text-h6 text-start text-white"><strong>NEVESYS</strong></span>
            <v-text-field
               v-model="email"
               prepend-inner-icon="mdi-account-circle"
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
               prepend-inner-icon="mdi-shield-key"
               icon-color="orange-darken-4"
               base-color="orange-darken-4"
               color="orange-darken-4"
               class="w-100"
               hide-details="auto"
               label="Senha"
               variant="solo"
               density="comfortable"
               :type="senhaEstaEscondida ? 'password' : null "
            >
               <template #append-inner>
                  <v-icon v-if="senhaEstaEscondida" color="orange-darken-4" @click="senhaEstaEscondida = !senhaEstaEscondida">
                     mdi-eye-off-outline
                  </v-icon>
                  <v-icon v-else color="orange-darken-4" @click="senhaEstaEscondida = !senhaEstaEscondida">
                     mdi-eye-outline
                  </v-icon>
               </template>
            </v-text-field>
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

<script>

import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'

export default {
   name: 'LoginScreen',
   data() {
      return {
         email: '',
         senha: '',
         senhaEstaEscondida: true,
      }
   },
   methods: {

      async login() {
        const auth = useAuthStore()
        const loading = useLoadingStore()
        loading.show('Logando no sistema...')

        try {
          await auth.login({ email: this.email, password: this.senha });
        } catch (error) {
            console.log('Falha no login: ' + (error.response?.data?.message || error.message));
        } finally {
          loading.hide();
        }
      }

   }
}
</script>

<style scoped>
.dynamic-background {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #920101 0%, #4b0606 100%);
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
}

/* Suave "wave" com pseudo-elemento */
.dynamic-background::before {
  content: "";
  position: absolute;
  top: -20%;
  left: -20%;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle at 30% 40%, rgba(240, 0, 0, 0.452) 0%, transparent 60%),
              radial-gradient(circle at 70% 60%, rgba(255, 7, 7, 0.575) 0%, transparent 70%);
  filter: blur(60px);
  opacity: 0.6;
  z-index: 0;
}

/* Conteúdo por cima das ondas */
.content {
  position: relative;
  z-index: 2;
}
</style>
