import {

    db,

    collection,

    addDoc,

    getDocs

} from "./firebase.js";


const nomeProduto =
document.getElementById("nomeProduto");

const valorProduto =
document.getElementById("valorProduto");

const categoriaProduto =
document.getElementById("categoriaProduto");

const imagemProduto =
document.getElementById("imagemProduto");

const btnSalvarProduto =
document.getElementById("btnSalvarProduto");

const listaProdutos =
document.getElementById("listaProdutos");


btnSalvarProduto.addEventListener(
    "click",
    salvarProduto
);


async function salvarProduto(){

    const produto = {

        nome:
        nomeProduto.value,

        valor:
        Number(valorProduto.value),

        categoria:
        categoriaProduto.value,

        imagem:
        imagemProduto.value
    };


    try{

        await addDoc(
            collection(db, "produtos"),
            produto
        );

        alert("Produto salvo!");

        limparCampos();

        carregarProdutos();

    }catch(error){

        console.log(error);

        alert("Erro ao salvar");
    }
}


async function carregarProdutos(){

    listaProdutos.innerHTML = "";

    const querySnapshot =
    await getDocs(
        collection(db, "produtos")
    );


    querySnapshot.forEach((doc) => {

        const produto = doc.data();

        criarCardProduto(produto);
    });
}


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

    `;


    listaProdutos.appendChild(card);
}


function limparCampos(){

    nomeProduto.value = "";

    valorProduto.value = "";

    categoriaProduto.value = "";

    imagemProduto.value = "";
}


carregarProdutos();