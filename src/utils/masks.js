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
