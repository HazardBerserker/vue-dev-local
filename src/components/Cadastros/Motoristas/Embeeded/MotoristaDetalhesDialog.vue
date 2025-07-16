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
              <div class="text-grey-darken-3">{{ formatLabel(campo) }}:</div>
              <div class="text-grey-darken-5"><strong>{{ valor }}</strong></div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <!-- Seção de Imagens -->
        <h6 class="text-subtitle-1 font-weight-bold mb-4 text-grey-darken-3">Documentos / Imagens</h6>

        <v-row dense>
          <v-col cols="6" v-for="(url, campo) in camposImagem" :key="campo">
            <v-btn
              :color="arquivosEhPdf[campo] ? 'blue-darken-2' : (imagensVisiveis[campo] ? 'red-darken-1' : 'blue-darken-2')"
              class="rounded-lg hover-scale mb-2"
              variant="flat"
              block
              @click="handleCliqueArquivo(campo)"
              size="small"
            >
              {{ arquivosEhPdf[campo] ? 'Abrir Documento' : (imagensVisiveis[campo] ? 'Ocultar' : 'Exibir') }}
              {{ formatLabel(campo) }}
            </v-btn>

            <!-- Exibe imagem se não for PDF -->
            <v-expand-transition v-if="!arquivosEhPdf[campo]">
              <div
                v-if="imagensVisiveis[campo]"
                class="image-container elevation-1 rounded-lg pa-1"
              >
                <v-img
                  :src="imagensTemporarias[campo]"
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
import { geraUrlTemporariaParaImagemS3, urlEDaS3 } from '@/helpers/funcoesParaS3';
import { useLoadingStore } from '@/stores/loading';

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
      imagensTemporarias: {},
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
    arquivosEhPdf() {
      const resultado = {};
      for (const [campo, url] of Object.entries(this.camposImagem)) {
        resultado[campo] = typeof url === 'string' && url.toLowerCase().endsWith('.pdf');
      }
      return resultado;
    },
  },
  methods: {
    async handleCliqueArquivo(campo) {
      const loading = useLoadingStore();

      if (this.arquivosEhPdf[campo]) {
        loading.show('Abrindo PDF...');
        await this.exibePdf(campo);
      }

      if(!this.arquivosEhPdf[campo]) {
        loading.show('Carregando imagem...');
        await this.toggleImagem(campo);
      }

      loading.hide()
    },

    async exibePdf(campo) {

      const urlOriginal = this.camposImagem[campo];

      if (!urlOriginal) return;

       let urlFinal = urlOriginal;

      if (urlEDaS3(urlOriginal)) {
        urlFinal = await geraUrlTemporariaParaImagemS3(urlOriginal);
      }

      window.open(urlFinal, '_blank');
    },

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

    async toggleImagem(campo) {
      const estavaVisivel = this.imagensVisiveis[campo];

      // Se já estava visível, apenas oculta
      if (estavaVisivel) {
        this.imagensVisiveis[campo] = false;
        return;
      }

      // Se vai exibir e ainda não tem URL resolvida
      if (!this.imagensTemporarias[campo]) {
        await this.carregarUrlTemporaria(campo);
      }

      this.imagensVisiveis[campo] = true;
    },
    async carregarUrlTemporaria(campo) {
      const urlOriginal = this.camposImagem[campo];

      if (!urlOriginal) return;

      if (!urlEDaS3(urlOriginal)) {
        this.imagensTemporarias[campo] = urlOriginal;
        return;
      }

      const novaUrl = await geraUrlTemporariaParaImagemS3(urlOriginal);
      this.imagensTemporarias[campo] = novaUrl;
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
