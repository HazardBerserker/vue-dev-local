<template>
   <div class="d-flex h-screen w-100">
      <div class="d-flex w-100 fill-height justify-center align-center dynamic-background">
         <!-- <img src="@/assets/logo.png" alt="Logo da empresa" class="logo" /> -->
         <v-card class="d-flex flex-column ga-3 w-100 justify-center align-start content py-16 px-8 elevation-0" rounded="lg">
            <span class="text-subtitle-2 text-redNeveah text-start font-weight-medium">Logistica inteligente, frete eficiente!</span>
            <v-text-field
               v-model="email"
               prepend-inner-icon="mdi-account-circle"
               icon-color="redNeveah"
               base-color="redNeveah"
              bg-color="grey-lighten-3"
               color="redNeveah"
               class="w-100"
               hide-details="auto"
               label="Usuário"
               variant="solo"
               density="comfortable"
            ></v-text-field>
            <v-text-field
               v-model="senha"
               prepend-inner-icon="mdi-shield-key"
               icon-color="redNeveah"
               base-color="redNeveah"
               bg-color="grey-lighten-3"
               color="redNeveah"
               class="w-100"
               hide-details="auto"
               label="Senha"
               variant="solo"
               density="comfortable"
               :type="senhaEstaEscondida ? 'password' : null "
            >
               <template #append-inner>
                  <v-icon v-if="senhaEstaEscondida" color="redNeveah" @click="senhaEstaEscondida = !senhaEstaEscondida">
                    mdi-eye-off-outline
                  </v-icon>
                  <v-icon v-else color="redNeveah" @click="senhaEstaEscondida = !senhaEstaEscondida">
                    mdi-eye-outline
                  </v-icon>
               </template>
            </v-text-field>
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-btn
                    v-bind="props"
                    class="w-100 animated-gradient"
                    :color=" !isHovering ? 'redNeveah' : 'orange-accent-4'"
                    @click="login"
                >
                    <strong>Acessar</strong>
                </v-btn>
              </template>
            </v-hover>
          </v-card>


      </div>

      <!-- Lado direito: Formulário -->
      <div class="d-flex fill-height bg-white w-100">
        <div class="w-50 ma-auto">
          <v-img
            src="/logo/neveah_logo_transp.png"
            alt="Logo Neveah"
            class="me-3">
          </v-img>
        </div>
      </div>

   </div>
</template>

<script>

import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { useAlertStore } from '@/stores/alertStore'

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
        const alertStore = useAlertStore()
        loading.show('Logando no sistema...')

        try {
          await auth.login({ email: this.email, password: this.senha });
        } catch (error) {
          alertStore.addAlert(error.response?.data?.message || error.message, 'error', 3000)
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
  background: linear-gradient(135deg, #690604 0%, #ff0400 100%);
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
}

.dynamic-background::before {
  content: "";
  position: absolute;
  top: -20%;
  left: -20%;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle at 20% 20%, #000000 0%, transparent 60%),
              radial-gradient(circle at 70% 60%, #770804e5 0%, transparent 70%);
  filter: blur(60px);
  opacity: 0.6;
  z-index: 0;
}

/* Conteúdo por cima das ondas */
.content {
  position: relative;
  z-index: 2;
  max-width: 550px;
  background: linear-gradient(to bottom, #1a1211e5, rgba(92, 0, 0, 0.473)); /* ou branco com opacidade */
  overflow: hidden; /* Garante que o pseudo-elemento não vaze */
  box-shadow: -10px -10px 20px 0px #1600006e !important;
}

.animated-gradient {
  background: linear-gradient(90deg, #B50300, #df490e, #B50300, #df490e);
  background-size: 800% 800%;
  transition: background-position 5s ease-in-out;
  animation: none;
}

.animated-gradient:hover {
  animation: gradientShift 6s ease-in-out infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

</style>
