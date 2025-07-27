export const TipoInformacaoBancariaEnum = [
  { value: '1', text: '1 - Banco e agência' },
  { value: '2', text: '2 - CNPJ da Instituição de Pagamento Eletrônico do Frete' },
  { value: '3', text: '3 - Chave PIX para recebimento do frete' },
];

export const TipoInformacaoBancariaEnumValorDescricao = Object.freeze({
  BANCO_AGENCIA: '1',
  CNPJ_IPFE: '2',
  PIX: '3',
})

export const TipoInformacaoBancariaEnumDescricao = Object.freeze({
  '1': 'Banco e agência',
  '2': 'CNPJ da Instituição de Pagamento Eletrônico do Frete',
  '3': 'Chave PIX para recebimento do frete',
})
