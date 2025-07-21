export function limparCamposVazios(objeto) {
  if (Array.isArray(objeto)) {
    return objeto
      .map(item => limparCamposVazios(item))
      .filter(item => !isValorVazio(item));
  }

  if (typeof objeto === 'object' && objeto !== null) {
    const novoObjeto = {};

    for (const chave in objeto) {
      const valor = limparCamposVazios(objeto[chave]);

      if (!isValorVazio(valor)) {
        novoObjeto[chave] = valor;
      }
    }

    return Object.keys(novoObjeto).length > 0 ? novoObjeto : null;
  }

  return objeto;
}

function isValorVazio(valor) {
  return (
    valor === null ||
    valor === undefined ||
    valor === '' ||
    (Array.isArray(valor) && valor.length === 0) ||
    (typeof valor === 'object' && valor !== null && Object.keys(valor).length === 0)
  );
}
