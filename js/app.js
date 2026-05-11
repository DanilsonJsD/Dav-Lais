const listaVendas = document.getElementById("listaVendas");
const totalTexto = document.getElementById("total");

let total = 0;

carregarVendas();

function carregarVendas(){

  const vendas = pegarVendas();

  listaVendas.innerHTML = "";

  total = 0;

  vendas.forEach(venda => {

    criarItemVenda(venda);

    total += venda.valor;
  });

  atualizarTotal();
}

function criarItemVenda(venda){

  const li = document.createElement("li");

  li.innerHTML = `
    ${venda.produto} -
    R$ ${venda.valor.toFixed(2)}

    <br>

    <small>${venda.data}</small>

    <br>

    <button onclick="excluirVenda('${venda.id}')">
      Excluir
    </button>
  `;

  listaVendas.appendChild(li);
}

function atualizarTotal(){

  totalTexto.innerText = `Total: R$ ${total.toFixed(2)}`;
}

function excluirVenda(id){

  let vendas = pegarVendas();

  vendas = vendas.filter(venda => venda.id !== id);

  salvarVendas(vendas);

  carregarVendas();
}

if("serviceWorker" in navigator){

  navigator.serviceWorker.register("service-worker.js");
}