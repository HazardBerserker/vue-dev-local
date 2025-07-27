<template>
  <div class="pa-4">
    <v-row dense class="ga-4">
      <!-- Dados Gerais -->
      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #prepend>
            <v-icon color="redNeveah">
              mdi-information
            </v-icon>
          </template>

          <template #title>
            <span class="text-redNeveah text-h6">Dados Gerais</span>
          </template>

          <v-divider class="mb-3" />

          <v-row dense class="px-4">
            <v-col cols="12" md="4">
              <strong>CFOP:</strong> {{ dadosFormGeral.cfop }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>Finalidade:</strong> {{ dadosFormGeral.finalidade.text }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>Tipo:</strong> {{ dadosFormGeral.tipo.text }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>Modalidade:</strong> {{ dadosFormGeral.modalidade.text }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>Início da Prestação:</strong> {{ dadosFormGeral.local_inicio_prestacao.cidade }} / {{ dadosFormGeral.local_inicio_prestacao.uf }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>Término da Prestação:</strong> {{ dadosFormGeral.local_termino_prestacao.cidade }} / {{ dadosFormGeral.local_termino_prestacao.uf }}
            </v-col>
            <v-col cols="12">
              <strong>Observações:</strong> {{ dadosFormGeral.observacoes_gerais || '---' }}
            </v-col>
          </v-row>
          <v-divider class="my-3" />
          <div class="text-subtitle-2 text-grey-darken-2 mb-2 px-4">Serviços</div>
          <v-row class="px-3">
            <v-col v-for="(valorServico, campo) in dadosFormGeral.servico.componentes" :key="campo" cols="12" md="4">
              <v-card variant="tonal" color="grey-darken-5" class="pa-2">
                <div><strong>{{campo}}:</strong> {{ formataMoeda(valorServico) }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Atores -->
      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #prepend>
            <v-icon color="redNeveah">
              mdi-account-supervisor
            </v-icon>
          </template>

          <template #title>
            <span class="text-redNeveah text-h6">Atores do CT-e</span>
          </template>

          <v-divider class="mb-6" />

          <v-row dense class="ga-6">
            <template v-for="(ator, key) in dadosFormAtores" :key="key">
              <template v-if="key !== 'tomador' || dadosDoTomador">
                <v-col cols="12">
                  <!-- Verifica se deve exibir o texto alternativo -->
                  <v-alert
                    v-if="(key === 'expedidor' && semExpedidor) || (key === 'recebedor' && semRecebedor)"
                    type="info"
                    class="text-subtitle-1"
                    variant="tonal"
                    border="start"
                  >
                    Sem {{ formatarTituloAtores(key) }}
                  </v-alert>

                  <!-- Caso contrário, mostra os dados -->
                  <v-card
                    v-else
                    class="pa-5 d-flex ga-6 bg-red-lighten-5 rounded-lg border"
                    variant="flat"
                  >
                    <div class="d-flex flex-column align-center justify-start" style="min-width: 100px;">
                      <v-avatar size="48" color="redNeveah" class="elevation-2">
                        <v-icon color="white">mdi-account-box</v-icon>
                      </v-avatar>
                      <div class="text-redNeveah text-subtitle-2 mt-2 text-center">
                        {{ formatarTituloAtores(key) }}
                      </div>
                    </div>

                    <div class="flex-grow-1">
                      <v-row dense>
                        <v-col cols="12" md="4">
                          <strong>Nome/Razão:</strong><br />
                          <span class="text-body-1">{{ key === 'tomador' ? dadosDoTomador?.nome_razao : dadosFormAtores[key].nome_razao }}</span>
                        </v-col>
                        <v-col cols="12" md="4">
                          <strong>Nome Fantasia:</strong><br />
                          <span class="text-body-1">{{ key === 'tomador' ? dadosDoTomador?.nome_fantasia : dadosFormAtores[key].nome_fantasia }}</span>
                        </v-col>
                        <v-col cols="12" md="4">
                          <strong>CNPJ:</strong><br />
                          <span class="text-body-1">{{ key === 'tomador' ? formataCNPJ(dadosDoTomador?.cnpj) : formataCNPJ(dadosFormAtores[key].cnpj) }}</span>
                        </v-col>

                        <v-col cols="12" md="4">
                          <strong>Telefone:</strong><br />
                          <span class="text-body-1">{{ key === 'tomador' ? dadosDoTomador?.telefone : dadosFormAtores[key].telefone }}</span>
                        </v-col>
                        <v-col cols="12" md="4">
                          <strong>IE:</strong><br />
                          <span class="text-body-1">{{ key === 'tomador' ? dadosDoTomador?.ie : dadosFormAtores[key].ie }}</span>
                        </v-col>
                        <v-col cols="12" md="12">
                          <strong>Endereço Completo:</strong><br />
                          <span class="text-body-1">
                            {{ key === 'tomador' ? dadosDoTomador?.endereco : dadosFormAtores[key].endereco }}, Nº {{ key === 'tomador' ? dadosDoTomador?.numero : dadosFormAtores[key].numero }}
                            {{ (key === 'tomador' ? dadosDoTomador?.complemento : dadosFormAtores[key].complemento) ? ' - ' + (key === 'tomador' ? dadosDoTomador?.complemento : dadosFormAtores[key].complemento) : '' }},
                            {{ key === 'tomador' ? dadosDoTomador?.bairro : dadosFormAtores[key].bairro }} - {{ key === 'tomador' ? dadosDoTomador?.cidade : dadosFormAtores[key].cidade }}/{{ key === 'tomador' ? dadosDoTomador?.uf : dadosFormAtores[key].uf }},
                            CEP: {{ formataCEP( key === 'tomador' ? dadosDoTomador?.cep : dadosFormAtores[key].cep) }}
                          </span>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
              </template>
            </template>
          </v-row>

        </v-card>
      </v-col>

      <!-- Carga -->
      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #prepend>
            <v-icon color="redNeveah">
              mdi-truck-trailer
            </v-icon>
          </template>

          <template #title>
            <span class="text-redNeveah text-h6">Dados Carga</span>
          </template>

          <v-divider class="mb-3" />

          <v-row dense class="px-4">
            <v-col cols="12" md="4"><strong>Valor Total:</strong> {{ dadosFormCarga.valor_total }}</v-col>
            <v-col cols="12" md="4"><strong>Valor Averbação:</strong> {{ dadosFormCarga.valor_averbacao }}</v-col>
            <v-col cols="12" md="4"><strong>Produto Predominante:</strong> {{ dadosFormCarga.produto_predominante }}</v-col>
            <v-col cols="12"><strong>Características:</strong> {{ dadosFormCarga.caracteristicas }}</v-col>
          </v-row>

          <!-- Quantidades -->
          <v-divider class="my-3" />
          <div class="text-subtitle-2 text-grey-darken-2 mb-2 px-4">Quantidades</div>
          <v-row v-if="dadosFormCarga.quantidades.length" class="px-4">
            <v-col v-for="(qtd, index) in dadosFormCarga.quantidades" :key="index" cols="12" md="4">
              <v-card variant="tonal" color="grey-darken-5" class="pa-2">
                <div><strong>Unidade:</strong> {{ UnidadeDeMedidaEnumDescricao[qtd.unidade_medida] }}</div>
                <div><strong>Tipo:</strong> {{ qtd.tipo_medida }}</div>
                <div><strong>Quantidade:</strong> {{ qtd.quantidade }}</div>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12" class="text-grey text-center"><em>Nenhuma quantidade informada</em></v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Documentos -->
      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #prepend>
            <v-icon color="redNeveah">
              mdi-file-document-multiple
            </v-icon>
          </template>

          <template #title>
            <span class="text-redNeveah text-h6">Documentos Vinculados</span>
          </template>

          <v-divider class="mb-3" />

          <v-row v-if="dadosFormDocumento.length" class="px-4">
            <v-col v-for="(doc, index) in dadosFormDocumento" :key="index" cols="12" md="6">
              <v-card variant="tonal" color="redNeveah" class="pa-3">
                <div><strong>Tipo:</strong> {{ DocumentoFiscalEnumDescricao[doc.tipo] }}</div>
                <div><strong>Chave:</strong> {{ doc.chave }}</div>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else >
            <v-col cols="12" class="text-grey text-center"><em>Nenhum documento vinculado</em></v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { DocumentoFiscalEnumDescricao } from '@/Enums/Fiscal/DocumentoFiscalEnum'
import { UnidadeDeMedidaEnumDescricao } from '@/Enums/Fiscal/UnidadeDeMedidaEnum'
import { formataCEP, formataCNPJ, formataMoeda } from '@/utils/masks'

export default {
  name: 'RecapitulacaoDados',
  props: {
    dadosFormGeral: Object,
    dadosFormAtores: Object,
    dadosFormCarga: Object,
    dadosFormDocumento: Array,
    tomadorEhIgualRemetente: Boolean,
    tomadorEhIgualDestinatario: Boolean,
    tomadorEhIgualRecebedor: Boolean,
    tomadorEhIgualExpedidor: Boolean,
    semExpedidor: {
      type: Boolean,
      default: false,
    },
    semRecebedor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      DocumentoFiscalEnumDescricao,
      UnidadeDeMedidaEnumDescricao,
      formataCNPJ,
      formataCEP,
      formataMoeda
    }
  },
  computed: {
    dadosDoTomador() {
      if (this.tomadorEhIgualRemetente) return this.dadosFormAtores.remetente
      if (this.tomadorEhIgualDestinatario) return this.dadosFormAtores.destinatario
      if (this.tomadorEhIgualRecebedor) return this.dadosFormAtores.recebedor
      if (this.tomadorEhIgualExpedidor) return this.dadosFormAtores.expedidor
      return null // ou {}
    }
  },
  methods: {
    formatarTituloAtores(chave) {
    const nomes = {
      remetente: 'Remetente',
      destinatario: 'Destinatário',
      expedidor: 'Expedidor',
      recebedor: 'Recebedor',
      tomador: 'Tomador'
    }
    return nomes[chave] || chave.charAt(0).toUpperCase() + chave.slice(1)
  }
  }
}
</script>
