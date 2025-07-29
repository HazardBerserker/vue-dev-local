<template>
  <div class="pa-4">
    <v-row dense class="ga-4">
      <!-- 1. DADOS GERAIS -->
      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Dados Gerais da Carga</span>
          </template>
          <v-divider class="mb-3" />

          <v-row dense class="px-4">
            <v-col cols="12" md="4"><strong>Emitente:</strong> {{ TipoDoEmitenteEnumDescricao[dadosFormCarga.emitente] }}</v-col>
            <v-col cols="12" md="4"><strong>Transportador:</strong> {{ TipoDoTransportadorEnumDescricao[dadosFormCarga.transportador] }}</v-col>
            <v-col cols="12" md="4"><strong>Modalidade:</strong> {{ ModalidadeEntregaEnumDescricao[dadosFormCarga.modalidade] }}</v-col>

            <v-col cols="12" md="4"><strong>UF Carregamento:</strong> {{ dadosFormCarga.uf_carregamento }}</v-col>
            <v-col cols="12" md="4"><strong>UF Descarregamento:</strong> {{ dadosFormCarga.uf_descarregamento }}</v-col>
            <v-col cols="12" md="4"><strong>Percurso:</strong> {{ dadosFormCarga.percurso.join(', ') || '---' }}</v-col>

            <v-col cols="12" md="4"><strong>Valor da Carga:</strong> {{ formataMoeda(dadosFormCarga.valor_carga) }}</v-col>
            <v-col cols="12" md="4"><strong>Unidade (Peso):</strong> {{ UnidadeMedidaMdfeEnumDescricao[dadosFormCarga.unidade] }}</v-col>
            <v-col cols="12" md="4"><strong>Peso Bruto:</strong> {{ formataNumeroBR(dadosFormCarga.peso_bruto) }}</v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- 2. LOCAIS -->
      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Municípios de Carregamento e Descarregamento</span>
          </template>
          <v-divider class="mb-3" />

          <v-row dense class="px-4">
            <v-col cols="12" md="6">
              <strong>Carregamento:</strong>
              <ul>
                <li v-for="(local, index) in dadosFormCarga.carregamento" :key="index">
                  {{ local.description || local.value }}
                </li>
              </ul>
            </v-col>
            <v-col cols="12" md="6">
              <strong>Descarregamento:</strong>
              <ul>
                <li v-for="(local, index) in dadosFormCarga.descarregamento" :key="index">
                  {{ local.nome_municipio }}
                  <ul v-if="local.documentos_fiscais?.length">
                    <li v-for="(doc, i) in local.documentos_fiscais" :key="i">
                      CTe: {{ doc.chCTe }}
                    </li>
                  </ul>
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- 3. PRODUTO PREDOMINANTE -->
      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Produto Predominante</span>
          </template>
          <v-divider class="mb-3" />
          <v-row dense class="px-4">
            <v-col cols="12" md="4"><strong>Tipo de Carga:</strong> {{ TipoCargaEnumDescricao[dadosFormCarga.produto_predominante.tipo_carga] }}</v-col>
            <v-col cols="12" md="4"><strong>Nome:</strong> {{ dadosFormCarga.produto_predominante.nome }}</v-col>
            <v-col cols="12" md="4"><strong>NCM:</strong> {{ dadosFormCarga.produto_predominante.ncm }}</v-col>
            <v-col cols="12" md="4"><strong>CEP Carregamento:</strong> {{ dadosFormCarga.produto_predominante.lotacao.carregamento.cep }}</v-col>
            <v-col cols="12" md="4"><strong>CEP Descarregamento:</strong> {{ dadosFormCarga.produto_predominante.lotacao.descarregamento.cep }}</v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- 4. SEGURO -->
      <v-col cols="12" v-for="(seguro, index) in dadosFormCarga.seguro" :key="index">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Seguro</span>
          </template>
          <v-divider class="mb-3" />
          <v-row dense class="px-4">
            <v-col cols="12" md="4"><strong>Seguradora:</strong> {{ seguro.seguradora.nome_seguradora }}</v-col>
            <v-col cols="12" md="4"><strong>CNPJ:</strong> {{ formataCNPJ(seguro.seguradora.cnpj) }}</v-col>
            <v-col cols="12" md="4"><strong>Nº Apólice:</strong> {{ seguro.numero_apolice }}</v-col>
            <v-col cols="12" md="4"><strong>Responsável:</strong> Tipo {{ TipoResponsavelEnumDescricao[seguro.responsavel.tipo_responsavel] }}</v-col>
            <v-col cols="12" md="4"><strong>CNPJ do Responsável:</strong> {{ seguro.responsavel.cnpj ? formataCNPJ(seguro.responsavel.cnpj) : '--' }}</v-col>
            <v-col cols="12" md="4"><strong>Averbações:</strong> {{ seguro.numero_averbacao.join(', ') }}</v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- CONTRATANTE -->
      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Dados do Contratante</span>
          </template>
          <v-divider class="mb-3" />
          <v-row dense class="px-4">
            <v-col cols="12" md="4"><strong>RNTRC:</strong> {{ dadosFormCarga.rodoviario.rntrc }}</v-col>
            <v-col cols="12" md="4"><strong>CNPJ:</strong> {{ formataCNPJ(dadosFormCarga.rodoviario.contratante[0].cnpj) }}</v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Dados do Veículo</span>
          </template>
          <v-divider class="mb-3" />
          <v-row dense class="px-4">
            <v-col cols="12" md="4"><strong>Placa:</strong> {{ dadosFormCarga.rodoviario.veiculo_tracao.placa }}</v-col>
            <v-col cols="12" md="4">
                <strong>Tara:</strong> {{ dadosFormCarga.rodoviario.veiculo_tracao.tara ? `${formataNumeroBR(dadosFormCarga.rodoviario.veiculo_tracao.tara)} KG` : '--' }}
              </v-col>
            <v-col cols="12" md="4"><strong>UF Licenciamento:</strong> {{ dadosFormCarga.rodoviario.veiculo_tracao.uf_licenciamento }}</v-col>
            <v-col cols="12" md="4"><strong>Tipo Rodado:</strong> {{  TipoRodadoEnumDescricao[dadosFormCarga.rodoviario.veiculo_tracao.tipo_rodado] }}</v-col>
            <v-col cols="12" md="4"><strong>Tipo Carroceria:</strong> {{ TipoCarroceriaEnumDescricao[dadosFormCarga.rodoviario.veiculo_tracao.tipo_carroceria] }}</v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Dados do Proprietário do Veículo</span>
          </template>
          <v-divider class="mb-3" />
          <v-row dense class="px-4">
            <v-col cols="12" md="4"
              v-if="dadosFormCarga.rodoviario.veiculo_tracao.proprietario.cpf"
            >
              <strong>CPF:</strong> {{ formataCPF(dadosFormCarga.rodoviario.veiculo_tracao.proprietario.cpf) }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="dadosFormCarga.rodoviario.veiculo_tracao.proprietario.cnpj"
            >
              <strong>CNPJ:</strong> {{ formataCNPJ(dadosFormCarga.rodoviario.veiculo_tracao.proprietario.cnpj) }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="dadosFormCarga.rodoviario.veiculo_tracao.proprietario.cpf"
            >
              <strong>Nome:</strong> {{ dadosFormCarga.rodoviario.veiculo_tracao.proprietario.nome }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="dadosFormCarga.rodoviario.veiculo_tracao.proprietario.cnpj"
            >
              <strong>Razão Social:</strong> {{ dadosFormCarga.rodoviario.veiculo_tracao.proprietario.razao_social }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="dadosFormCarga.rodoviario.veiculo_tracao.proprietario.ie"
            >
              <strong>Inscrição Estadual:</strong> {{ dadosFormCarga.rodoviario.veiculo_tracao.proprietario.ie }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>RNTRC:</strong> {{ dadosFormCarga.rodoviario.veiculo_tracao.proprietario.rntrc ?? '--' }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>UF do Proprietário:</strong> {{ dadosFormCarga.rodoviario.veiculo_tracao.proprietario.uf ?? '--' }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>Tipo do Proprietário:</strong>
              {{ dadosFormCarga.rodoviario.veiculo_tracao.proprietario.tipo_proprietario
                  ? TipoProprietarioEnumDescricao[dadosFormCarga.rodoviario.veiculo_tracao.proprietario.tipo_proprietario]
                  : '--'
              }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- 6. CONDUTOR(ES) -->
      <v-col cols="12" v-if="dadosFormCarga.rodoviario.condutor?.length">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Condutores</span>
          </template>
          <v-divider class="mb-3" />
          <v-row dense class="px-4">
            <v-col
              v-for="(condutor, i) in dadosFormCarga.rodoviario.condutor"
              :key="i"
              cols="12" md="6"
            >
              <strong>Nome:</strong> {{ condutor.nome }}<br />
              <strong>CPF:</strong> {{ formataCPF(condutor.cpf) }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- 7. PAGAMENTO DE FRETE -->
      <v-col cols="12" v-for="(pagamento, index) in dadosFormCarga.rodoviario.pagamento_frete" :key="index">
        <v-card class="pa-4 bg-grey-lighten-4" elevation="2">
          <template #title>
            <span class="text-redNeveah text-h6">Pagamento de Frete</span>
          </template>
          <v-divider class="mb-3" />
          <v-row dense class="px-4">
            <v-col cols="12" md="4"
              v-if="pagamento.nome"
            >
              <strong>Nome do Pagador:</strong> {{ pagamento.nome }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.razao_social"
            >
              <strong>Razão Social do Pagador:</strong> {{ pagamento.razao_social }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.cpf"
            >
              <strong>CPF do Pagador:</strong> {{ formataCPF(pagamento.cpf) }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.cnpj"
            >
              <strong>CNPJ do Pagador:</strong> {{ formataCNPJ(pagamento.cnpj) }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.informacoes_bancarias.tipo_informacao_bancaria"
            >
              <strong>Método do Pagamento:</strong> {{ TipoInformacaoBancariaEnumDescricao[pagamento.informacoes_bancarias.tipo_informacao_bancaria] }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.informacoes_bancarias.numero_banco"
            >
              <strong>Número do Banco:</strong> {{ pagamento.informacoes_bancarias.numero_banco }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.informacoes_bancarias.numero_agencia"
            >
              <strong>Agência do Banco:</strong> {{ pagamento.informacoes_bancarias.numero_agencia }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.informacoes_bancarias.cnpj_ipef"
            >
              <strong>CNPJ da Instituição de Pagamento Eletrônico do Frete:</strong> {{ pagamento.informacoes_bancarias.cnpj_ipef }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.informacoes_bancarias.pix"
            >
              <strong>Chave PIX:</strong> {{ pagamento.informacoes_bancarias.pix }}
            </v-col>
            <v-col cols="12" md="4"><strong>Valor do Contrato: </strong>{{ formataMoeda(pagamento.valor_contrato) }}</v-col>
            <v-col cols="12" md="4"><strong>Forma Pagamento: </strong> {{ FormaPagamentoMdfeEnumDescricao[pagamento.forma_pagamento] }}</v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.valor_adiantamento"
            >
              <strong>Valor do Adiantamento:</strong> {{ formataMoeda(pagamento.valor_adiantamento) }}
            </v-col>

            <v-col cols="12" md="4"
              v-if="pagamento.informacoes_pagamento_prazo[0].data_vencimento_parcela"
            >
              <strong>Data de Vencimento da Parcela:</strong> {{ formataDataSomenteData(pagamento.informacoes_pagamento_prazo[0].data_vencimento_parcela) }}
            </v-col>
            <v-col cols="12" md="4"
              v-if="pagamento.informacoes_pagamento_prazo[0].valor_parcela"
            >
              <strong>Valor da Parcela:</strong> {{ formataMoeda(pagamento.informacoes_pagamento_prazo[0].valor_parcela) }}
            </v-col>
            <v-col cols="12" md="12" class="mt-4">
              <strong>Detalhamento dos Pagamentos:</strong>
            </v-col>

            <v-col v-for="(comp, idx) in pagamento.componentes_pagamento_frete" :key="idx" md="4">
              <v-card variant="tonal" color="redNeveah" class="pa-3">
                <div><strong>Tipo de Pagamento:</strong> {{ TipoComponentePagamentoEnumDescricao[comp.tipo_componente] }}</div>
                <div><strong>Valor do Pagamento:</strong> {{ formataMoeda(comp.valor_componente) }}</div>
                <div><strong>Descrição:</strong> {{ comp.descricao_componente ? comp.descricao_componente : '--' }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { FormaPagamentoMdfeEnumDescricao } from '@/Enums/Fiscal/FormaPagamentoMdfeEnum';
import { ModalidadeEntregaEnumDescricao } from '@/Enums/Fiscal/ModalidadeEntregaEnum';
import { TipoCargaEnumDescricao } from '@/Enums/Fiscal/TipoCargaEnum';
import { TipoCarroceriaEnumDescricao } from '@/Enums/Fiscal/TipoCarroceriaEnum';
import { TipoComponentePagamentoEnumDescricao } from '@/Enums/Fiscal/TipoComponentePagamento';
import { TipoDoEmitenteEnumDescricao } from '@/Enums/Fiscal/TipoDoEmitenteEnum';
import { TipoDoTransportadorEnumDescricao } from '@/Enums/Fiscal/TipoDoTransportadorEnum.js';
import { TipoInformacaoBancariaEnumDescricao } from '@/Enums/Fiscal/TipoInformacaoBancariaEnum';
import { TipoProprietarioEnumDescricao } from '@/Enums/Fiscal/TipoProprietarioEnum';
import { TipoResponsavelEnumDescricao } from '@/Enums/Fiscal/TipoResponsavelEnum';
import { TipoRodadoEnumDescricao } from '@/Enums/Fiscal/TipoRodadoEnum';
import { UnidadeMedidaMdfeEnumDescricao } from '@/Enums/Fiscal/UnidadeMedidaMdfeEnum';
import { formataCNPJ, formataCPF, formataDataSomenteData, formataMoeda, formataNumeroBR } from '@/utils/masks';

export default {
  name: 'RecapitulacaoDados',
  props: {
    dadosFormCarga: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formataCNPJ,
      formataCPF,
      formataMoeda,
      formataNumeroBR,
      formataDataSomenteData,

      TipoComponentePagamentoEnumDescricao,
      FormaPagamentoMdfeEnumDescricao,
      TipoResponsavelEnumDescricao,
      ModalidadeEntregaEnumDescricao,
      TipoCargaEnumDescricao,
      TipoCarroceriaEnumDescricao,
      TipoRodadoEnumDescricao,
      UnidadeMedidaMdfeEnumDescricao,
      TipoDoTransportadorEnumDescricao,
      TipoDoEmitenteEnumDescricao,
      TipoProprietarioEnumDescricao,
      TipoInformacaoBancariaEnumDescricao

    }
  }
}
</script>
