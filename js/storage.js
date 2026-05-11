function pegarVendas(){

  const vendas = localStorage.getItem("vendas");

  if(vendas){
    return JSON.parse(vendas);
  }

  return [];
}

function salvarVendas(vendas){

  localStorage.setItem("vendas", JSON.stringify(vendas));
}