<template>
  <v-dialog v-model="open" max-width="900" transition="dialog-bottom-transition">
    <v-card class="rounded-xl elevation-3" color="grey-lighten-4">
      <!-- Título -->
      <v-card-title class="d-flex justify-space-between align-center text-white rounded-t-2xl" style="background-color: #1565C0;">
        <span class="text-h6 font-weight-semibold">Detalhes do Motorista</span>
        <v-btn icon="mdi-close" size="35" color="blue" @click="fechar" class="hover-scale">
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Campos de Texto -->
        <v-row dense>
          <v-col cols="6" v-for="(valor, campo) in camposTexto" :key="campo">
            <div class="mb-2">
              <strong class="text-grey-darken-2">{{ formatLabel(campo) }}:</strong>
              <div class="text-grey-darken-4">{{ valor }}</div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <!-- Seção de Imagens -->
        <h6 class="text-subtitle-1 font-weight-bold mb-4 text-grey-darken-3">Documentos / Imagens</h6>

        <v-row dense>
          <v-col cols="6" v-for="(url, campo) in camposImagem" :key="campo">
            <v-btn
              :color="imagensVisiveis[campo] ? 'red-darken-1' : 'blue-darken-2'"
              class="rounded-lg hover-scale mb-2"
              variant="flat"
              block
              @click="toggleImagem(campo)"
              size="small"
            >
              {{ imagensVisiveis[campo] ? 'Ocultar' : 'Exibir' }} {{ formatLabel(campo) }}
            </v-btn>

            <v-expand-transition>
              <div
                v-if="imagensVisiveis[campo]"
                class="image-container elevation-1 rounded-lg pa-1"
              >
                <v-img
                  :src="url"
                  class="rounded-lg"
                  max-width="100%"
                  max-height="250"
                  cover
                />
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { SimENaoEnum } from '@/Enums/SimENaoEnum';

export default {
  name: 'MotoristaDetalhesDialog',
  data() {
    return {
      motorista: null,
      open: false,
      imagensVisiveis: {
        arquivo_cnh: false,
        arquivo_comprovante_residencia: false,
        arquivo_documento_carro: false,
        arquivo_antt: false,
        arquivo_foto_veiculo: false,
      },
    };
  },
  computed: {
    camposTexto() {
      if (!this.motorista) return {};
      return {
        nome_completo: this.motorista.nome_completo,
        cpf: this.motorista.cpf,
        telefone: this.motorista.telefone,
        placa_carro: this.motorista.placa_carro,
        placa_carreta: this.motorista.placa_carreta,
        tipo_veiculo: this.motorista.tipo_veiculo,
        pix: this.motorista.pix,
        uf_residencia: this.motorista.uf_residencia,
        cidade_residencia: this.motorista.cidade_residencia,
        cep_residencia: this.motorista.cep_residencia,
        observacoes: this.motorista.observacoes,
        ativo: SimENaoEnum[this.motorista.ativo],
      };
    },
    camposImagem() {
      if (!this.motorista) return {};
      return {
        arquivo_cnh: this.motorista.arquivo_cnh,
        arquivo_comprovante_residencia: this.motorista.arquivo_comprovante_residencia,
        arquivo_documento_carro: this.motorista.arquivo_documento_carro,
        arquivo_antt: this.motorista.arquivo_antt,
        arquivo_foto_veiculo: this.motorista.arquivo_foto_veiculo,
      };
    },
  },
  methods: {
    abrir(motorista) {
      this.motorista = motorista;
      this.open = true;
      Object.keys(this.imagensVisiveis).forEach((campo) => {
        this.imagensVisiveis[campo] = false;
      });
    },
    fechar() {
      this.open = false;
    },
    toggleImagem(campo) {
      this.imagensVisiveis[campo] = !this.imagensVisiveis[campo];
    },
    formatLabel(campo) {
      return campo
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    },
  },
};
</script>

<style scoped>
.image-container {
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f5f5f5;
}

.hover-scale:hover {
  transform: scale(1.05);
  transition: 0.2s ease;
}

.v-card-text {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
