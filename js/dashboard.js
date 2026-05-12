import {

    db,

    collection,

    getDocs

} from "./firebase.js";


const vendasHoje =
document.getElementById("vendasHoje");

const pedidosHoje =
document.getElementById("pedidosHoje");

const maisVendido =
document.getElementById("maisVendido");

const totalProdutos =
document.getElementById("totalProdutos");


// =========================
// CARREGAR DASHBOARD
// =========================

async function carregarDashboard(){

    await carregarVendas();

    await carregarProdutos();
}


// =========================
// VENDAS
// =========================

async function carregarVendas(){

    const querySnapshot =
    await getDocs(
        collection(db, "vendas")
    );


    let total = 0;

    let pedidos = 0;

    let produtosVendidos = {};


    querySnapshot.forEach((doc) => {

        const venda = doc.data();


        total += venda.total;

        pedidos++;


        venda.itens.forEach((item) => {

            if(
                produtosVendidos[item.produto]
            ){

                produtosVendidos[item.produto] +=
                item.quantidade;

            }else{

                produtosVendidos[item.produto] =
                item.quantidade;
            }
        });
    });


    vendasHoje.innerText =
    `R$ ${total}`;


    pedidosHoje.innerText =
    pedidos;


    let produtoTop = "Nenhum";

    let quantidadeTop = 0;


    for(
        let produto in produtosVendidos
    ){

        if(
            produtosVendidos[produto]
            >
            quantidadeTop
        ){

            quantidadeTop =
            produtosVendidos[produto];

            produtoTop = produto;
        }
    }


    maisVendido.innerText =
    produtoTop;
}


// =========================
// PRODUTOS
// =========================

async function carregarProdutos(){

    const querySnapshot =
    await getDocs(
        collection(db, "produtos")
    );


    totalProdutos.innerText =
    querySnapshot.size;
}


// =========================
// INICIAR
// =========================

carregarDashboard();