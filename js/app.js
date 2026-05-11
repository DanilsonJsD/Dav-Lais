import {
  db,
  collection,
  getDocs
} from "./firebase.js";


const listaVendas = document.getElementById("listaVendas");

const totalTexto = document.getElementById("total");


let total = 0;


// CARREGA VENDAS
carregarVendas();


// FUNÇÃO PRINCIPAL
async function carregarVendas(){

  listaVendas.innerHTML = "";

  total = 0;

  try{

    const querySnapshot = await getDocs(
      collection(db, "vendas")
    );

    querySnapshot.forEach((doc) => {

      const venda = doc.data();

      criarItemVenda(venda);

      total += venda.valor;
    });

    atualizarTotal();

  }catch(error){

    console.log(error);

    alert("Erro ao carregar vendas");
  }
}


// CRIA ITEM HTML
function criarItemVenda(venda){

  const li = document.createElement("li");

  li.innerHTML = `

    <strong>${venda.produto}</strong>

    - R$ ${venda.valor.toFixed(2)}

    <br>

    <small>${venda.data}</small>

    <hr>
  `;

  listaVendas.appendChild(li);
}


// TOTAL
function atualizarTotal(){

  totalTexto.innerText =
  `Total: R$ ${total.toFixed(2)}`;
}