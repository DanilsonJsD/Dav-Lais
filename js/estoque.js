import {

    db,

    collection,

    addDoc,

    getDocs,

    deleteDoc,

    doc

} from "./firebase.js";


// ELEMENTOS

const nome =
document.getElementById("nome");

const valor =
document.getElementById("valor");

const categoria =
document.getElementById("categoria");

const quantidade =
document.getElementById("quantidade");

const imagem =
document.getElementById("imagem");

const btnSalvar =
document.getElementById("btnSalvar");

const listaProdutos =
document.getElementById("listaProdutos");


// =========================
// SALVAR
// =========================

btnSalvar.addEventListener(

    "click",

    salvarProduto
);


async function salvarProduto(){

    if(

        nome.value === "" ||

        valor.value === ""

    ){

        alert(
            "Preencha os campos"
        );

        return;
    }


    const produto = {

        nome:
        nome.value,

        valor:
        Number(valor.value),

        categoria:
        categoria.value,

        quantidade:
        Number(quantidade.value),

        imagem:
        imagem.value
    };


    try{

        await addDoc(

            collection(db, "produtos"),

            produto
        );


        alert(
            "Produto salvo!"
        );


        limparCampos();

        carregarProdutos();

    }catch(error){

        console.log(error);

        alert(
            "Erro salvar produto"
        );
    }
}


// =========================
// LISTAR
// =========================

async function carregarProdutos(){

    listaProdutos.innerHTML = "";


    try{

        const querySnapshot =
        await getDocs(
            collection(db, "produtos")
        );


        querySnapshot.forEach((item) => {

            const produto =
            item.data();


            const div =
            document.createElement("div");


            div.classList.add(
                "produto-card"
            );


            div.innerHTML = `

                <img
                src="${produto.imagem}"

                onerror="
                this.style.display='none'
                ">

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
                ${produto.quantidade}

                <br><br>

                <button
                onclick="excluirProduto(
                    '${item.id}'
                )">

                    Excluir

                </button>

                <hr>
            `;


            listaProdutos.appendChild(div);
        });

    }catch(error){

        console.log(error);
    }
}


// =========================
// EXCLUIR
// =========================

async function excluirProduto(id){

    const confirmar =
    confirm(

        "Excluir produto?"
    );


    if(!confirmar){

        return;
    }


    try{

        await deleteDoc(

            doc(db, "produtos", id)
        );


        carregarProdutos();

    }catch(error){

        console.log(error);
    }
}


window.excluirProduto =
excluirProduto;


// =========================
// LIMPAR
// =========================

function limparCampos(){

    nome.value = "";

    valor.value = "";

    categoria.value = "";

    quantidade.value = "";

    imagem.value = "";
}


// =========================
// INICIAR
// =========================

carregarProdutos();