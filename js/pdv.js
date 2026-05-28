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

    getDocs,

    doc,

    updateDoc

} from "./firebase.js";


// =========================
// ELEMENTOS
// =========================

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


// =========================
// VARIÁVEIS
// =========================

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
        "#16a34a";

    }else{

        statusInternet.innerHTML =
        "🔴 OFFLINE";

        statusInternet.style.background =
        "#dc2626";
    }
}


// =========================
// EVENTOS INTERNET
// =========================

window.addEventListener(

    "online",

    async () => {

        atualizarStatusInternet();

        try{

            await sincronizarVendas(

                db,

                collection,

                addDoc
            );

            alert(
                "Vendas sincronizadas!"
            );

        }catch(error){

            console.log(error);
        }
    }
);


window.addEventListener(

    "offline",

    () => {

        atualizarStatusInternet();

        alert(
            "Sistema offline"
        );
    }
);


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


        querySnapshot.forEach((docItem) => {

            const produto =
            docItem.data();


            const produtoCompleto = {

                ...produto,

                id: docItem.id
            };


            produtos.push(
                produtoCompleto
            );


            criarCardProduto(
                produtoCompleto
            );
        });


        salvarProdutosOffline(produtos);

    }catch(error){

        console.log(
            "Erro online:",
            error
        );

        carregarProdutosOffline();
    }
}


// =========================
// PRODUTOS OFFLINE
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
// CARD PRODUTO
// =========================

function criarCardProduto(produto){

    const card =
    document.createElement("div");


    card.classList.add(
        "produto-card"
    );


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

        <br>

        Estoque:
        ${produto.quantidade || 0}

        <br><br>

        <button
        onclick="adicionarCarrinho(
            '${produto.id}',
            '${produto.nome}',
            ${produto.valor}
        )">

            Adicionar

        </button>
    `;


    listaProdutos.appendChild(card);
}


// =========================
// ADICIONAR CARRINHO
// =========================

function adicionarCarrinho(

    id,

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

            id,

            produto,

            valor,

            quantidade: 1
        });
    }


    atualizarCarrinho();
}


// =========================
// ATUALIZAR CARRINHO
// =========================

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


// =========================
// REMOVER ITEM
// =========================

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
// BAIXAR ESTOQUE
// =========================

async function baixarEstoque(){

    try{

        const produtosOffline =
        obterProdutosOffline();


        for(const item of carrinho){

            const produtoAtual =
            produtosOffline.find(

                (p) => p.id === item.id
            );


            if(produtoAtual){

                const novaQuantidade =

                    (produtoAtual.quantidade || 0)

                    -

                    item.quantidade;


                await updateDoc(

                    doc(
                        db,
                        "produtos",
                        item.id
                    ),

                    {

                        quantidade:
                        novaQuantidade
                    }
                );
            }
        }

    }catch(error){

        console.log(

            "Erro baixar estoque",

            error
        );
    }
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

        alert(
            "Carrinho vazio"
        );

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
        Date.now()
    };


    // SALVAR OFFLINE
    salvarVendaOffline(venda);


    // ONLINE
    if(navigator.onLine){

        try{

            await sincronizarVendas(

                db,

                collection,

                addDoc
            );


            await baixarEstoque();


            carregarProdutos();

        }catch(error){

            console.log(error);
        }
    }


    // LIMPA CARRINHO
    carrinho = [];

    atualizarCarrinho();


    // ALERTA
    alert(

        navigator.onLine

        ?

        "Venda finalizada!"

        :

        "Venda salva offline!\nSerá sincronizada quando a internet voltar."
    );
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