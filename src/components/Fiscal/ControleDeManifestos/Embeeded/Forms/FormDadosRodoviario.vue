<template>
  <v-form class="bg-grey-lighten-4 border elevation-2 pa-6" ref="formDadosCarga">
    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2 align-center">
            <v-icon size="large">
              mdi-note-text
            </v-icon>
            <span>Detalhes do Transporte</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row class="my-3">
      <v-col cols="12" md="4" class="py-2">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-badge
              class="w-100 px-0"
              v-bind="props"
              content="?"
            >
              <InputText
                v-model="dadosFormRodoviarioLocal.rntrc"
                label="RNTRC *"
                density="compact"
                variant="outlined"
                bg-color="white"
                counter="8"
                mask="########"
                clearable
              />
            </v-badge>
          </template>
          <span v-html="mensagemTooltipRodoviario"></span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" md="4" class="py-2">
        <InputText
          label="CNPJ do Contratante *"
          v-model="dadosFormRodoviarioLocal.contratante[0].cnpj"
          mask="##.###.###/####-##"
          disabled
          counter="18"
          density="compact"
          variant="outlined"
          bg-color="white"
          clearable
        />
      </v-col>
    </v-row>

    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2 align-center">
            <v-icon size="large">
              mdi-truck
            </v-icon>
            <span>Veículo Tração</span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3" class="py-2">
        <InputText
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.placa"
          label="Placa do Veículo*"
          density="compact"
          variant="outlined"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          counter="7"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <InputTextMoeda
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.tara"
          label="Tara do Veículo *"
          bg-color="white"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.uf_licenciamento"
          bg-color="white"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF de Licenciamento *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.tipo_rodado"
          bg-color="white"
          :items="TipoRodadoEnumEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Tipo de Rodado *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3" class="py-2">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.tipo_carroceria"
          bg-color="white"
          :items="TipoCarroceriaEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Tipo de Carroceria *"
          density="compact"
          :rules="rules.campoObrigatorio"
          clearable
        />
      </v-col>
    </v-row>

    <!-- Campos baseados no Tipo do Transportador, se for TAC é PF do Contrário é PJ, se o Tipo do Transportador não estiver preenchidos esses campos são adicionais -->
    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2">
            <v-tooltip location="top">
              <template #activator="{ props }">

                  <span>
                    <v-badge
                      class="w-100"
                      v-bind="props"
                      content="?"
                      offset-x="-18"
                      offset-y="6"
                    >
                      Dados Proprietário do Veículo
                  </v-badge>
                </span>

              </template>
              <span v-html="mensagemTooltipProprietarioDoVeiculo"></span>
            </v-tooltip>
            </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-radio-group
          v-model="valorDoRadio"
          disabled
          inline
        >
          <v-radio
            label="Proprietário é PJ"
            :value="1"
          ></v-radio>
          <v-radio
            label="Proprietário é PF"
            :value="2"
          ></v-radio>
        </v-radio-group>

      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-if="valorDoRadio == 1">
        <InputText
          label="CNPJ do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.cnpj"
          mask="##.###.###/####-##"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          counter="18"
          density="compact"
          variant="outlined"
          bg-color="white"
        />
      </v-col>
      <v-col cols="12" md="4" v-else>
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="CPF do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.cpf"
          mask="###.###.###-##"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          counter="14"
        />
      </v-col>
      <v-col cols="12" md="4" v-if="valorDoRadio == 1">
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Razão Social do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.razao_social"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
        />
      </v-col>
      <v-col cols="12" md="4" v-else>
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Nome do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.nome"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
        />
      </v-col>
      <v-col cols="12" md="4" v-if="valorDoRadio == 1">
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="IE do Proprietário *"
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.ie"
          mask="##############"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          counter="14"
        />
      </v-col>
    </v-row>
    <v-row>
       <v-col cols="12" md="4">
        <InputText
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.rntrc"
          label="RNTRC do Proprietário *"
          density="compact"
          variant="outlined"
          bg-color="white"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          counter="8"
          mask="########"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.uf"
          bg-color="white"
          :items="estadosBrasileiros"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="UF do Proprietário *"
          density="compact"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="dadosFormRodoviarioLocal.veiculo_tracao.proprietario.tipo_proprietario"
          bg-color="white"
          :items="TipoProprietarioEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Tipo de Proprietário *"
          density="compact"
          :rules="tipoTransportador ? rules.campoObrigatorio : []"
          :disabled="tipoTransportador ? false : true"
          clearable
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="bg-red-lighten-5 mx-1 px-2 text-grey-darken-2 text-body-2" style="border: 1px solid #ffbdb7;">
          <v-row dense class="bg-red-lighten-4 mt-4 pa-2">
            <v-col cols="12" md="4" class="d-flex ga-2 align-center">
              <div>
                <v-icon color="redNeveah">
                  mdi-card-account-details
                </v-icon>
              </div>
              <InputText
                density="compact"
                variant="outlined"
                bg-color="white"
                label="CPF do condutor"
                v-model="cpfCondutor"
                mask="###.###.###-##"
                hide-details
                clearable
                counter="14"
              />
            </v-col>
            <v-col cols="12" md="3" class="d-flex ga-2 align-center">
              <v-text-field
                v-model="nomeCondutor"
                density="compact"
                variant="outlined"
                label="Nome do condutor"
                bg-color="white"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex ga-2 align-center">
              <v-btn variant="flat" color="redNeveah" @click="adicionaCondutor">
              Adicionar
              </v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 align-center pt-2 text-redNeveah justify-end text-body-1">
                <div>
                  <em>Condutores vinculados</em>
                </div>
                <div>
                  <v-chip>{{dadosFormRodoviarioLocal.condutor.length}}</v-chip>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">

              <div v-if="dadosFormRodoviarioLocal.condutor.length == 0" class="d-flex pt-2 text-grey text-body-2">
                <div class="mt-2">
                  <em>Nenhum Condutor vinculado</em>
                </div>
              </div>

              <v-card class="pa-4 mb-2 rounded-md bg-red-lighten-5 d-flex flex-column ga-3 overflow-y-auto" variant="flat" max-height="450" v-else>
                <v-row class="mb-4">
                  <v-col
                    cols="12"
                    md="4"
                    class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
                    v-for="condutor, index in dadosFormRodoviarioLocal.condutor" :key="`condutor-${index}`"
                  >
                    <v-card class="px-2 bg-red-lighten-4 text-redNeveah pa-2" style="border: 1px solid #ba1614;">
                      <div class="d-flex align-center text-body-2">
                        <div class="d-flex flex-column w-100 ga-2">
                          <div class="w-100">
                            Nome: <strong>{{ condutor.nome}}</strong>
                          </div>
                          <div class="w-100">CPF: <strong>{{ condutor.cpf}}</strong></div>
                        </div>
                        <v-btn icon="mdi-close" size="x-small" variant="tonal" @click="removeCondutor(index)"/>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-row dense class="mt-8">
      <v-col cols="12">
        <div class="px-2 text-redNeveah">
          <div class="d-flex ga-2 align-center">
            <v-icon size="large">
              mdi-cash
            </v-icon>
            <span>
              <v-badge
                class="w-100"
                v-tooltip:top="'Esses campos serão obrigatórios/disponíveis quando houver apenas um CT-e vinculado'"
                content="?"
                offset-x="-18"
                offset-y="6"
              >
                Pagamento do Frete
              </v-badge>
            </span>
          </div>
          <v-divider :thickness="2"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <v-radio-group
          v-model="valorDoRadioPagamento"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          inline
        >
          <v-radio
            label="Pagador é PJ"
            :value="1"
          ></v-radio>
          <v-radio
            label="Pagador é PF"
            :value="2"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-if="valorDoRadioPagamento == 1">
        <InputText
          label="CNPJ do Pagador *"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].cnpj"
          mask="##.###.###/####-##"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          counter="18"
          density="compact"
          variant="outlined"
          bg-color="white"
        />
      </v-col>
      <v-col cols="12" md="4" v-else>
         <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="CPF do Pagador *"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].cpf"
          mask="###.###.###-##"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          counter="14"
        />
      </v-col>
      <v-col cols="12" md="4" v-if="valorDoRadioPagamento == 1">
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Razão Social do Pagador *"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].razao_social"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
        />
      </v-col>
      <v-col cols="12" md="4" v-else>
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Nome do Pagador *"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].nome"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-badge
          class="w-100"
          v-tooltip:top="'Esse valor é a soma dos Pagamentos Vinculados'"
          content="?"
        >
          <InputTextMoeda
            prefix="R$"
            v-model="dadosFormRodoviarioLocal.pagamento_frete[0].valor_contrato"
            label="Valor do contrato *"
            bg-color="white"
            :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
            disabled
            clearable
          />
        </v-badge>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].forma_pagamento"
          bg-color="white"
          :items="FormaPagamentoMdfeEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Forma de Pagamento *"
          density="compact"
          :rules="rules.campoObrigatorio"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          clearable
        />
      </v-col>
    </v-row>

    <v-row v-if="dadosFormRodoviarioLocal.pagamento_frete[0].forma_pagamento == FormaPagamentoMdfeEnumValorDescricao.A_PRAZO">
      <v-col cols="12" md="4">
        <InputTextMoeda
          prefix="R$"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].valor_adiantamento"
          label="Valor do Adiantamento *"
          bg-color="white"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <InputTextMoeda
          prefix="R$"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_pagamento_prazo[0].valor_parcela"
          label="Valor do Saldo/Parcela *"
          bg-color="white"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-date-input
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_pagamento_prazo[0].data_vencimento_parcela"
          label="Data de Vencimento do Saldo/Parcela:"
          prepend-icon=""
          density="compact"
          prepend-inner-icon="$calendar"
          placeholder="dd/mm/yy"
          bg-color="white"
          clearable
          variant="outlined"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
        ></v-date-input>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.tipo_informacao_bancaria"
          bg-color="white"
          :items="TipoInformacaoBancariaEnum"
          item-value="value"
          item-title="text"
          variant="outlined"
          label="Método de Pagamento*"
          density="compact"
          :rules="rules.campoObrigatorio"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4"
        v-if="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.tipo_informacao_bancaria == TipoInformacaoBancariaEnumValorDescricao.BANCO_AGENCIA"
      >
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Número do banco *"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.numero_banco"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          counter="5"
        />
      </v-col>
      <v-col cols="12" md="4"
        v-if="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.tipo_informacao_bancaria == TipoInformacaoBancariaEnumValorDescricao.BANCO_AGENCIA"
      >
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Número da Agência Bancaria *"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.numero_agencia"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          counter="10"
        />
      </v-col>
      <v-col cols="12" md="4"
        v-if=" dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.tipo_informacao_bancaria == TipoInformacaoBancariaEnumValorDescricao.CNPJ_IPFE"
      >
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="CNPJ da Instituição de Pagamento Eletrônico do Frete *"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.cnpj_ipef"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          counter="14"
        />
      </v-col>
      <v-col cols="12" md="4"
        v-if="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.tipo_informacao_bancaria == TipoInformacaoBancariaEnumValorDescricao.PIX"
      >
        <InputText
          density="compact"
          variant="outlined"
          bg-color="white"
          label="Chave PIX para recebimento do frete*"
          v-model="dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.pix"
          :rules="totalDeCtesVinculados == 1 ? rules.campoObrigatorio : []"
          :disabled="totalDeCtesVinculados == 1 ? false : true"
          counter="60"
        />
      </v-col>
    </v-row>

    <v-row v-if="totalDeCtesVinculados == 1">
      <v-col>
        <div class="bg-red-lighten-5 mx-1 px-2 text-grey-darken-2 text-body-2" style="border: 1px solid #ffbdb7;">
          <v-row dense class="bg-red-lighten-4 mt-4 pa-2">
            <v-col cols="12" md="2" class="d-flex ga-2 align-center">
              <div>
                <v-icon color="redNeveah">
                  mdi-cash-plus
                </v-icon>
              </div>
              <v-select
                v-model="tipoDoComponenteDePagamento"
                bg-color="white"
                variant="outlined"
                :items="TipoComponentePagamentoEnum"
                item-value="value"
                item-title="text"
                label="Tipo de Pagamento *"
                density="compact"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex ga-2 align-center">
              <InputTextMoeda
                prefix="R$"
                v-model="valorDoComponenteDePagamento"
                label="Valor do pagamento *"
                bg-color="white"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="3" class="d-flex ga-2 align-center">
              <v-text-field
                v-model="descricaoComponentePagamento"
                density="compact"
                variant="outlined"
                label="Descrição Pagamento"
                bg-color="white"
                hide-details
                :disabled="tipoDoComponenteDePagamento != TipoComponentePagamentoEnumValorDescricao.OUTROS"
                clearable
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex ga-2 align-center">
              <v-btn variant="flat" color="redNeveah" @click="adicionaComponenteDePagamento">
              Adicionar
              </v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 align-center pt-2 text-redNeveah justify-end text-body-1">
                <div>
                  <em>Pagamentos Vinculados</em>
                </div>
                <div>
                  <v-chip>{{this.dadosFormRodoviarioLocal.pagamento_frete[0].componentes_pagamento_frete.length}}</v-chip>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12">

              <div v-if="this.dadosFormRodoviarioLocal.pagamento_frete[0].componentes_pagamento_frete.length == 0" class="d-flex pt-2 text-grey text-body-2">
                <div class="mt-2">
                  <em>Nenhum Pagamento vinculado</em>
                </div>
              </div>

              <v-card class="pa-4 mb-2 rounded-md bg-red-lighten-5 d-flex flex-column ga-3 overflow-y-auto" variant="flat" max-height="450" v-else>
                <v-row class="mb-4">
                  <v-col
                    cols="12"
                    md="4"
                    class="pa-1 rounded-lg text-body-2 d-flex flex-column ga-3"
                    v-for="pagamento, index in this.dadosFormRodoviarioLocal.pagamento_frete[0].componentes_pagamento_frete" :key="`condutor-${index}`"
                  >
                    <v-card class="px-2 bg-red-lighten-4 text-redNeveah pa-2" style="border: 1px solid #ba1614;">
                      <div class="d-flex align-center text-body-2">
                        <div class="d-flex flex-column w-100 ga-2">
                          <div class="w-100">Tipo de Pagamento: <strong>{{ TipoComponentePagamentoEnumDescricao[pagamento.tipo_componente]}}</strong></div>
                          <div class="w-100">Valor do Pagamento: <strong>{{ formataMoeda(pagamento.valor_componente)}}</strong></div>
                          <div class="w-100" v-if="pagamento.tipo_componente == TipoComponentePagamentoEnumValorDescricao.OUTROS">
                            Descrição do Pagamento: <strong>{{ pagamento.descricao_componente}}</strong>
                          </div>
                          <div class="w-100" v-else>
                            Descrição do Pagamento: --
                          </div>
                        </div>
                        <v-btn icon="mdi-close" size="x-small" variant="tonal" @click="removeComponenteDePagamento(index)"/>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-card class="border pa-4 text-body-2 mt-2" variant="tonal" color="redNeveah">
      (*) Campos com esta estrela são obrigatórios
    </v-card>
  </v-form>
</template>

<script>

import { estadosBrasileiros } from '@/Enums/estadosEnum'
import InputTextMoeda from '@/components/Form/InputTextMoeda.vue'
import { useAlertStore } from '@/stores/alertStore'
import { formataMoeda } from '@/utils/masks';
import { TipoDoTransportadorEnum, TipoDoTransportadorEnumValorDescricao } from '@/Enums/Fiscal/TipoDoTransportadorEnum.js.js'
import { TipoCargaEnum } from '@/Enums/Fiscal/TipoCargaEnum'
import InputText from '@/components/Form/InputText.vue'
import { TipoRodadoEnumEnum } from '@/Enums/Fiscal/TipoRodadoEnum'
import { TipoCarroceriaEnum } from '@/Enums/Fiscal/TipoCarroceriaEnum'
import { TipoProprietarioEnum } from '@/Enums/Fiscal/TipoProprietarioEnum';
import { FormaPagamentoMdfeEnum, FormaPagamentoMdfeEnumValorDescricao } from '@/Enums/Fiscal/FormaPagamentoMdfeEnum';
import { format as formatDate } from 'date-fns';
import { TipoComponentePagamentoEnum, TipoComponentePagamentoEnumValorDescricao, TipoComponentePagamentoEnumDescricao } from '@/Enums/Fiscal/TipoComponentePagamento';
import { TipoInformacaoBancariaEnum, TipoInformacaoBancariaEnumValorDescricao } from '@/Enums/Fiscal/TipoInformacaoBancariaEnum';

export default {
  name: 'FormDadosGeral',
  components: {
    InputTextMoeda,
    InputText
  },
  props: {
    dadosFormRodoviario: {
      type: Object,
      required: true
    },
    estadosESeusMunicipios: {
      type: Object,
      required: true
    },
    totalDeCtesVinculados: {
      type: Number,
      required: true
    },
    tipoTransportador: {
      required: true
    },
  },
  watch: {
    valorDoRadio(newValue, oldValue) {
      if(newValue != oldValue) {
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.razao_social = null
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.nome = null
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.cnpj = null
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.cpf = null
        this.dadosFormRodoviarioLocal.veiculo_tracao.proprietario.ie = null
      }
    },
    tipoDoComponenteDePagamento(newValue, oldValue) {
      if(newValue == oldValue) {
        return
      }

      if(oldValue == TipoComponentePagamentoEnumValorDescricao.OUTROS) {
        this.descricaoComponentePagamento = null
      }
    },
    tipoDeInformacaoBancaria(newValue, oldValue) {
      if(newValue == oldValue) {
        return
      }
      if(oldValue == TipoInformacaoBancariaEnumValorDescricao.BANCO_AGENCIA) {
        this.dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.numero_banco = null
        this.dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.numero_agencia = null
      }
      if(oldValue == TipoInformacaoBancariaEnumValorDescricao.PIX) {
        this.dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.pix = null
      }
      if(oldValue == TipoInformacaoBancariaEnumValorDescricao.CNPJ_IPFE) {
        this.dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.cnpj_ipef = null
      }
    },
    'pagamentoFrete.componentes_pagamento_frete': {
      handler() {
        this.calculaValorDoContrato()
      },
      deep: true
    },
  },
  mounted() {
    if(this.tipoTransportador == TipoDoTransportadorEnumValorDescricao.TAC) {
      this.valorDoRadio = 2
      return
    }

    this.valorDoRadio = 1
  },
  data() {
    return {
      formataMoeda,

      TipoDoTransportadorEnum,
      estadosBrasileiros,
      TipoCargaEnum,
      TipoRodadoEnumEnum,
      TipoCarroceriaEnum,
      TipoProprietarioEnum,
      FormaPagamentoMdfeEnum,
      FormaPagamentoMdfeEnumValorDescricao,
      TipoComponentePagamentoEnum,
      TipoComponentePagamentoEnumValorDescricao,
      TipoComponentePagamentoEnumDescricao,
      TipoInformacaoBancariaEnum,
      TipoInformacaoBancariaEnumValorDescricao,
      TipoDoTransportadorEnumValorDescricao,

      // ClassificacaoTributariaEnum,

      mensagemTooltipRodoviario: `
        Registro obrigatório do emitente do MDF-e <br>
        junto à ANTT para exercer a atividade de <br>
        transportador rodoviário de cargas por <br>
        conta de terceiros e mediante remuneração
      `,

      mensagemTooltipProprietarioDoVeiculo: `
        Campos baseados no Tipo do Transportador, se for TAC é PF do Contrário é PJ. <br>
        Se o Tipo do Transportador não estiver preenchido esses campos serão opcionais
      `,

      valorDoRadio: null,
      valorDoRadioPagamento: 2,

      rules: {
        campoObrigatorio: [
          (v) => v !== null && v !== undefined && v !== '' || 'Este campo é obrigatório'
        ],
      },

      nomeCondutor: null,
      cpfCondutor: null,

      tipoDoComponenteDePagamento: null,
      valorDoComponenteDePagamento: null,
      descricaoComponentePagamento: null,
    }
  },
  computed: {
    pagamentoFrete() {
      return this.dadosFormRodoviarioLocal.pagamento_frete?.[0];
    },
    tipoDeInformacaoBancaria() {
      return this.dadosFormRodoviarioLocal.pagamento_frete[0].informacoes_bancarias.tipo_informacao_bancaria
    },

    dadosFormRodoviarioLocal: {
      get() {
        return this.dadosFormRodoviario
      },
      set(novosDados) {
        this.$emit('update:dadosFormRodoviario', novosDados)
      }
    },
    totalDeCtesVinculadosLocal: {
      get() {
        return this.totalDeCtesVinculados
      },
      set(novosDados) {
        this.$emit('update:totalDeCtesVinculados', novosDados)
      }
    },
  },
  methods: {
    format(date) {
      return formatDate(date, 'dd/MM/yyyy')
    },

    calculaValorDoContrato() {
      const componentesDePagamento = this.dadosFormRodoviarioLocal.pagamento_frete[0].componentes_pagamento_frete
      let total = 0

      for(const index in componentesDePagamento) {

        total += componentesDePagamento[index].valor_componente
      }

      this.dadosFormRodoviarioLocal.pagamento_frete[0].valor_contrato = total
    },

    adicionaComponenteDePagamento() {

      const alertStore = useAlertStore();


      if(!this.tipoDoComponenteDePagamento) {
        alertStore.addAlert('Preencha o Tipo de Pagamento corretamente', 'warning')
        return
      }

      if(!this.valorDoComponenteDePagamento) {
        alertStore.addAlert('Preencha o Valor do Pagamento corretamente', 'warning')
        return
      }

      if(!this.descricaoComponentePagamento && this.tipoDoComponenteDePagamento == TipoComponentePagamentoEnumValorDescricao.OUTROS) {
        alertStore.addAlert('Preencha a Descrição do Pagamento corretamente', 'warning')
        return
      }

      this.criaNovoComponenteDePagamento()
    },

    criaNovoComponenteDePagamento() {
      let item = {
        tipo_componente: this.tipoDoComponenteDePagamento,
        valor_componente: this.valorDoComponenteDePagamento,
      }

      if(this.tipoDoComponenteDePagamento == TipoComponentePagamentoEnumValorDescricao.OUTROS) {
        item['descricao_componente'] = this.descricaoComponentePagamento
      }

      this.dadosFormRodoviarioLocal.pagamento_frete[0].componentes_pagamento_frete.push(item)
    },

    removeComponenteDePagamento(index) {
      this.dadosFormRodoviarioLocal.pagamento_frete[0].componentes_pagamento_frete.splice(index, 1);
    },


    adicionaCondutor() {

      const alertStore = useAlertStore();

      if(!this.nomeCondutor) {
        alertStore.addAlert('Preencha o Nome do Condutor corretamente', 'warning')
        return
      }

      if(!this.cpfCondutor) {
        alertStore.addAlert('Preencha o CPF do Condutor corretamente', 'warning')
        return
      }

      if(this.dadosFormRodoviarioLocal.condutor.length == 0) {
        this.criaNovoCondutor()
        return
      }

      const item = this.buscaCondutorPeloCPF()

      if(item) {
        alertStore.addAlert('Já existe um condutor com esse CPF adicionado', 'warning')
        return
      }

      this.criaNovoCondutor()
    },
    criaNovoCondutor() {
      const item = {
        cpf: this.cpfCondutor,
        nome: this.nomeCondutor,
      }
      this.dadosFormRodoviarioLocal.condutor.push(item)
    },

    removeCondutor(index) {
     this.dadosFormRodoviarioLocal.condutor.splice(index, 1);
    },

    buscaCondutorPeloCPF() {
      for(const index in this.dadosFormRodoviarioLocal.condutor) {
        if(this.dadosFormRodoviarioLocal.condutor[index].cpf == this.cpfCondutor.cpf) {
          return true
        }
      }
      return false
    },

    validate() {
      return this.$refs?.formDadosCarga.validate()
    },
  }
}
</script>
