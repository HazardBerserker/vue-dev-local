import { Mask } from 'maska';
import dayjs from 'dayjs';

function aplicarMascara(valor, padrao) {
  if (!valor) return '';
  const mask = new Mask({ mask: padrao });
  return mask.masked(valor);
}

export function formataCNPJ(cnpj) {
  return aplicarMascara(cnpj, '##.###.###/####-##');
}

export function formataCEP(cep) {
  return aplicarMascara(cep, '#####-###');
}

export function formataCPF(cpf) {
  return aplicarMascara(cpf, '###.###.###-##');
}

export function formataTelefone(telefone) {
  if (!telefone) return '';
  const padrao = telefone.length === 11 ? '(##) #####-####' : '(##) ####-####';
  return aplicarMascara(telefone, padrao);
}

export function formataData(data) {
  return dayjs(data).format('DD/MM/YYYY HH:mm:ss');
}

export function formataDataSomenteData(data) {
  return dayjs(data).format('DD/MM/YYYY');
}

export function formataMoeda(valor) {
  if (valor == null || isNaN(valor)) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

export function formatarDataParaInputVuetify(dataString) {
  // dataString: "26/02/2025 00:00:00"

  if (typeof dataString !== 'string' || dataString.trim() === '') {
    return null;
  }

  // Tenta extrair a parte da data antes do espaço
  const partes = dataString.split(' ');
  if (partes.length === 0) {
    return null;
  }

  const dataParte = partes[0]; // "26/02/2025"
  const [dia, mes, ano] = dataParte.split('/');

  // Verifica se dia, mes e ano existem e são strings válidas
  if (!dia || !mes || !ano) {
    return null;
  }

  // Garante que mês e dia tenham 2 dígitos
  const diaFormatado = dia.padStart(2, '0');
  const mesFormatado = mes.padStart(2, '0');

  return `${ano}-${mesFormatado}-${diaFormatado}`;
}

