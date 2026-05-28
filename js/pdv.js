import {

    salvarVendaOffline,

    salvarProdutosOffline,

    obterProdutosOffline,

    sincronizarVendas

} from "./storage.js";

import {

    db,

    collection,

    addDoc,

    getDocs

} from "./firebase.js";


// ELEMENTOS

const listaProdutos =
document.getElementById("listaProdutos");

const listaCarrinho =
document.getElementById("listaCarrinho");

const totalTexto =
document.getElementById("total");

const pagamento =
document.getElementById("pagamento");

const btnFinalizar =
document.getElementById("btnFinalizar");

const statusInternet =
document.getElementById("statusInternet");


// VARIÁVEIS

let carrinho = [];

let total = 0;


// =========================
// STATUS INTERNET
// =========================

function atualizarStatusInternet(){

    if(navigator.onLine){

        statusInternet.innerHTML =
        "🟢 ONLINE";

        statusInternet.style.background =
        "green";

    }else{

        statusInternet.innerHTML =
        "🔴 OFFLINE";

        statusInternet.style.background =
        "red";
    }
}


window.addEventListener(

    "online",

    async () => {

        atualizarStatusInternet();


        await sincronizarVendas(

            db,

            collection,

            addDoc
        );


        alert(
            "Vendas sincronizadas!"
        );
    }
);


window.addEventListener(

    "offline",

    () => {

        atualizarStatusInternet();
    }
);


// =========================
// PRODUTOS
// =========================

async function carregarProdutos(){

    listaProdutos.innerHTML = "";


    try{

        const querySnapshot =
        await getDocs(
            collection(db, "produtos")
        );


        let produtos = [];


        querySnapshot.forEach((doc) => {

            const produto = doc.data();

            produtos.push(produto);

            criarCardProduto(produto);
        });


        salvarProdutosOffline(produtos);

    }catch(error){

        console.log(error);

        carregarProdutosOffline();
    }
}


function carregarProdutosOffline(){

    listaProdutos.innerHTML = "";


    const produtosOffline =
    obterProdutosOffline();


    produtosOffline.forEach((produto) => {

        criarCardProduto(produto);
    });
}


// =========================
// CARD
// =========================

function criarCardProduto(produto){

    const card =
    document.createElement("div");


    card.classList.add("card");


    card.innerHTML = `

        <img
        src="${produto.imagem}"
        onerror="this.style.display='none'">

        <h3>
            ${produto.nome}
        </h3>

        <p>
            R$ ${produto.valor}
        </p>

        <small>
            ${produto.categoria}
        </small>

        <br><br>

        <button
        onclick="adicionarCarrinho(
            '${produto.nome}',
            ${produto.valor}
        )">

            Adicionar

        </button>
    `;


    listaProdutos.appendChild(card);
}


// =========================
// CARRINHO
// =========================

function adicionarCarrinho(

    produto,

    valor
){

    const itemExistente =
    carrinho.find((item) =>

        item.produto === produto
    );


    if(itemExistente){

        itemExistente.quantidade++;

    }else{

        carrinho.push({

            produto,

            valor,

            quantidade: 1
        });
    }


    atualizarCarrinho();
}


function atualizarCarrinho(){

    listaCarrinho.innerHTML = "";

    total = 0;


    carrinho.forEach((item, index) => {

        const subtotal =
        item.valor * item.quantidade;


        total += subtotal;


        const li =
        document.createElement("li");


        li.innerHTML = `

            <strong>
                ${item.produto}
            </strong>

            <br>

            Quantidade:
            ${item.quantidade}

            <br>

            Subtotal:
            R$ ${subtotal}

            <br><br>

            <button
            onclick="removerItem(${index})">

                Remover

            </button>

            <hr>
        `;


        listaCarrinho.appendChild(li);
    });


    totalTexto.innerHTML =
    `Total: R$ ${total}`;
}


function removerItem(index){

    if(
        carrinho[index].quantidade > 1
    ){

        carrinho[index].quantidade--;

    }else{

        carrinho.splice(index, 1);
    }


    atualizarCarrinho();
}


// =========================
// FINALIZAR VENDA
// =========================

btnFinalizar.addEventListener(

    "click",

    finalizarVenda
);


async function finalizarVenda(){

    if(carrinho.length <= 0){

        alert("Carrinho vazio");

        return;
    }


    const venda = {

        itens: [...carrinho],

        total: total,

        pagamento: pagamento.value,

        status:
        pagamento.value === "fiado"
        ?
        "pendente"
        :
        "pago",

        data:
        new Date().toLocaleString()
    };


    // SALVA LOCAL PRIMEIRO
    salvarVendaOffline(venda);


    // LIMPA TELA
    carrinho = [];

    atualizarCarrinho();


    // ALERTA
    alert(

        navigator.onLine
        ?
        "Venda finalizada!"
        :
        "Venda salva offline!"
    );


    // TENTA SINCRONIZAR
    if(navigator.onLine){

        try{

            await sincronizarVendas(

                db,

                collection,

                addDoc
            );

        }catch(error){

            console.log(error);
        }
    }
}


// =========================
// GLOBAL
// =========================

window.adicionarCarrinho =
adicionarCarrinho;

window.removerItem =
removerItem;


// =========================
// INICIAR
// =========================

atualizarStatusInternet();

carregarProdutos();