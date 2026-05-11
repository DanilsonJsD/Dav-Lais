function adicionarVenda(produto, valor){

  const vendas = pegarVendas();

  const venda = {
    id: crypto.randomUUID(),
    produto: produto,
    valor: valor,
    data: new Date().toLocaleString()
  };

  vendas.push(venda);

  salvarVendas(vendas);

  alert(`${produto} adicionado!`);
}