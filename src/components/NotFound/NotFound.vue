<template>
  <v-container
    fluid
    class="d-flex align-center justify-center fill-height position-relative"
  >
    <!-- Fundo animado atrás -->
    <div class="animated-background"></div>

    <transition name="fade-slide" appear>
      <div v-if="show" class="glass-panel mx-auto" style="max-width: 600px;">
        <v-row justify="center" align="center" class="text-center">
          <v-col cols="12">
            <!-- Número animado com sombra -->
            <div class="animated-number font-weight-bold mb-4">
              404
            </div>

            <!-- Mensagem -->
            <h2 class="text-h5 mb-6">
              Ops! A página que você tentou acessar não foi encontrada.
            </h2>

            <!-- Botão com ícone -->
            <v-hover v-slot="{ isHovering, props }">
              <v-btn
                v-bind="props"
                :elevation="isHovering ? 12 : 4"
                color="redNeveah"
                size="large"
                variant="elevated"
                @click="$router.back()"
                :ripple="true"
              >
                <v-icon start>mdi-arrow-left</v-icon>
                Voltar
              </v-btn>
            </v-hover>

            <v-row class="mt-8" justify="center" align="center" dense>
              <v-col cols="12" md="6">
                <v-hover v-slot="{ isHovering, props }">
                  <v-btn
                    v-bind="props"
                    :elevation="isHovering ? 12 : 8"
                    :style="{ transform: isHovering ? 'scale(1.05)' : 'scale(1)' }"
                    color="redNeveah"
                    block
                    large
                    variant="elevated"
                    @click="$router.push('/dashboard/metricas-gerais')"
                  >
                    <v-icon start>mdi-view-dashboard</v-icon>
                    Dashboard
                  </v-btn>
                </v-hover>
              </v-col>

              <v-col cols="12" md="6" class="mt-4 mt-md-0">
                <v-hover v-slot="{ isHovering, props }">
                  <v-btn
                    v-bind="props"
                    :elevation="isHovering ? 8 : 2"
                    :style="{ transform: isHovering ? 'scale(1.03)' : 'scale(1)' }"
                    color="redNeveah"
                    block
                    large
                    variant="flat"
                    @click="$router.push('/menu-do-cliente/meus-fretes')"
                  >
                    <v-icon start>mdi-truck-fast</v-icon>
                    Meus Fretes
                  </v-btn>
                </v-hover>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </transition>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    // Exibe conteúdo com animação após o mount
    this.show = true;
  },
};
</script>

<style scoped>
/* Número flutuando com sombra */
.animated-number {
  font-size: 8rem;
  color: #B50300;
  animation: float 2s ease-in-out infinite;
  text-shadow: 2px 4px 12px rgba(0, 0, 0, 0.15);
}

/* Botão com hover suave */
.animated-button {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.animated-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(181, 3, 0, 0.25);
}

/* Fundo animado */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;

  background: linear-gradient(120deg,
    #ffffff,
    #ffeaea,
    #fddddd,
    #ffffff,
    #ffecec
  );
  background-size: 300% 300%;
  animation: backgroundGradientMotion 15s ease infinite;
  transition: background 0.3s ease-in-out;
}

/* Painel glassmorphism */
.glass-panel {
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Animação do número */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Animação do fundo */
@keyframes backgroundGradientMotion {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 50% 100%;
  }
  75% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

/* Animação de entrada (fade + slide) */
.fade-slide-enter-active {
  animation: fadeSlideIn 0.6s ease forwards;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.4s ease forwards;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

</style>
