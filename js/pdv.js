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

let modoOffline = false;


// =========================
// MONITOR INTERNET
// =========================

window.addEventListener("offline", () => {

    modoOffline = true;

    statusInternet.style.display =
    "block";
});


window.addEventListener("online", async () => {

    modoOffline = false;

    statusInternet.style.display =
    "none";


    await sincronizarVendas(

        db,

        collection,

        addDoc
    );


    alert(
        "Vendas sincronizadas!"
    );
});


// =========================
// CARREGAR PRODUTOS
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


// =========================
// OFFLINE PRODUTOS
// =========================

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


    totalTexto.innerText =
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


    // =========================
    // OFFLINE
    // =========================

    if(modoOffline){

        salvarVendaOffline(venda);


        carrinho = [];

        atualizarCarrinho();


        alert(

            "Venda salva offline!\n\nQuando a internet voltar ela será sincronizada."

        );

        return;
    }


    // =========================
    // ONLINE
    // =========================

    try{

        await addDoc(

            collection(db, "vendas"),

            venda
        );


        carrinho = [];

        atualizarCarrinho();


        alert(
            "Venda finalizada!"
        );

    }catch(error){

        console.log(error);


        salvarVendaOffline(venda);


        carrinho = [];

        atualizarCarrinho();


        alert(

            "Erro conexão.\n\nVenda salva offline."

        );
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

carregarProdutos();