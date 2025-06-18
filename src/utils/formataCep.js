export function formataCep(cep) {
  if (!cep) return ''
  // Remove tudo que não for número
  const onlyNumbers = cep.toString().replace(/\D/g, '')

  // Aplica a máscara
  return onlyNumbers.replace(/^(\d{5})(\d{0,3}).*/, (match, p1, p2) => {
    if (p2) return `${p1}-${p2}`
    return p1
  })
}
