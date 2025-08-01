import { Mask } from 'maska';
import dayjs from 'dayjs';
import { formatDate } from 'date-fns';

function aplicarMascara(valor, padrao) {
  if (!valor) return '';
  const mask = new Mask({ mask: padrao });
  return mask.masked(valor);
}

export function formataNumeroBR(numero) {
  if (numero == null || isNaN(numero)) return '';

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
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

// ele formata pro padrao BR datas que vem no padrão do BD yyyy-mm-dd
export function formataData(data) {
  return dayjs(data).format('DD/MM/YYYY HH:mm:ss');
}

// ele formata pro padrao BR datas que vem no padrão do BD yyyy-mm-dd
export function formataDataSomenteData(data) {
  return dayjs(data).format('DD/MM/YYYY');
}

// ele formata dataas 20/10/2025 para padrao banco yyyy-mm-dd
export function formataDataBRParaPadraoBanco(dataBr) {
  const [dia, mes, ano] = dataBr.split('/');
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

export function formataDataISOParaPadraoBanco(data) {
  return formatDate(new Date(data), 'yyyy-MM-dd');
}

export function formataDataBRParaDate(dataBr) {
  if (!dataBr) return null;

  const [dataParte, horaParte = '00:00:00'] = dataBr.split(' ');
  const [dia, mes, ano] = dataParte.split('/');

  const isoString = `${ano}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}T${horaParte}`;
  return new Date(isoString);
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

