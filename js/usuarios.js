import {

    db,

    collection,

    addDoc,

    getDocs,

    deleteDoc,

    doc

} from "./firebase.js";


// =========================
// ELEMENTOS
// =========================

const nome =
document.getElementById("nome");

const email =
document.getElementById("email");

const senha =
document.getElementById("senha");

const tipo =
document.getElementById("tipo");

const btnSalvar =
document.getElementById("btnSalvar");

const listaUsuarios =
document.getElementById("listaUsuarios");


// =========================
// SALVAR
// =========================

btnSalvar.addEventListener(

    "click",

    salvarUsuario
);


async function salvarUsuario(){

    if(

        nome.value === "" ||

        email.value === "" ||

        senha.value === ""

    ){

        alert(
            "Preencha os campos"
        );

        return;
    }


    const usuario = {

        nome:
        nome.value,

        email:
        email.value,

        senha:
        senha.value,

        tipo:
        tipo.value,

        permissoes: {

            pdv:
            document.getElementById("pdv").checked,

            estoque:
            document.getElementById("estoque").checked,

            financeiro:
            document.getElementById("financeiro").checked,

            analises:
            document.getElementById("analises").checked,

            usuarios:
            document.getElementById("usuarios").checked,

            configuracoes:
            document.getElementById("configuracoes").checked,

            importacao:
            document.getElementById("importacao").checked
        }
    };


    try{

        await addDoc(

            collection(db, "usuarios"),

            usuario
        );


        alert(
            "Usuário salvo!"
        );


        limparCampos();

        carregarUsuarios();

    }catch(error){

        console.log(error);

        alert(
            "Erro salvar usuário"
        );
    }
}


// =========================
// LISTAR
// =========================

async function carregarUsuarios(){

    listaUsuarios.innerHTML = "";


    try{

        const querySnapshot =
        await getDocs(
            collection(db, "usuarios")
        );


        querySnapshot.forEach((item) => {

            const usuario =
            item.data();


            const div =
            document.createElement("div");


            div.classList.add(
                "produto-card"
            );


            div.innerHTML = `

                <h3>
                    ${usuario.nome}
                </h3>

                <p>
                    ${usuario.tipo}
                </p>

                <small>
                    ${usuario.email}
                </small>

                <br><br>

                <strong>
                    Permissões:
                </strong>

                <br><br>

                PDV:
                ${usuario.permissoes.pdv ? "✅" : "❌"}

                <br>

                Estoque:
                ${usuario.permissoes.estoque ? "✅" : "❌"}

                <br>

                Financeiro:
                ${usuario.permissoes.financeiro ? "✅" : "❌"}

                <br>

                Análises:
                ${usuario.permissoes.analises ? "✅" : "❌"}

                <br>

                Usuários:
                ${usuario.permissoes.usuarios ? "✅" : "❌"}

                <br>

                Config:
                ${usuario.permissoes.configuracoes ? "✅" : "❌"}

                <br>

                Importação:
                ${usuario.permissoes.importacao ? "✅" : "❌"}

                <br><br>

                <button
                onclick="excluirUsuario(
                    '${item.id}'
                )">

                    Excluir

                </button>
            `;


            listaUsuarios.appendChild(div);
        });

    }catch(error){

        console.log(error);
    }
}


// =========================
// EXCLUIR
// =========================

async function excluirUsuario(id){

    const confirmar =
    confirm(
        "Excluir usuário?"
    );


    if(!confirmar){

        return;
    }


    try{

        await deleteDoc(

            doc(db, "usuarios", id)
        );


        carregarUsuarios();

    }catch(error){

        console.log(error);
    }
}


window.excluirUsuario =
excluirUsuario;


// =========================
// LIMPAR
// =========================

function limparCampos(){

    nome.value = "";

    email.value = "";

    senha.value = "";

    tipo.value = "funcionario";


    document.getElementById("pdv").checked = false;

    document.getElementById("estoque").checked = false;

    document.getElementById("financeiro").checked = false;

    document.getElementById("analises").checked = false;

    document.getElementById("usuarios").checked = false;

    document.getElementById("configuracoes").checked = false;

    document.getElementById("importacao").checked = false;
}


// =========================
// INICIAR
// =========================

carregarUsuarios();