import {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc
} from "./firebase.js";


const numeroNota = document.getElementById("numeroNota");

const cliente = document.getElementById("cliente");

const valorNota = document.getElementById("valorNota");

const pagamento = document.getElementById("pagamento");

const status = document.getElementById("status");

const btnSalvarNota = document.getElementById("btnSalvarNota");

const listaNotas = document.getElementById("listaNotas");


btnSalvarNota.addEventListener(
    "click",
    salvarNota
);


carregarNotas();


// SALVAR
async function salvarNota(){

    const nota = {

        numero: numeroNota.value,

        cliente: cliente.value,

        valor: Number(valorNota.value),

        pagamento: pagamento.value,

        status: status.value,

        data: new Date().toLocaleString()
    };


    try{

        await addDoc(
            collection(db, "notas"),
            nota
        );

        alert("Nota salva!");

        limparCampos();

        carregarNotas();

    }catch(error){

        console.log(error);

        alert("Erro ao salvar nota");
    }
}


// LISTAR
async function carregarNotas(){

    listaNotas.innerHTML = "";


    try{

        const querySnapshot = await getDocs(
            collection(db, "notas")
        );


        querySnapshot.forEach((documento) => {

            const nota = documento.data();
            nota.id = documento.id;
            criarItemNota(nota);
        });

    }catch(error){

        console.log(error);
    }
}


// CRIAR HTML
function criarItemNota(nota){

    const li = document.createElement("li");


    li.innerHTML = `

        <strong>Nota:</strong> ${nota.numero}

        <br>

        <strong>Cliente:</strong> ${nota.cliente}

        <br>

        <strong>Valor:</strong> 
        R$ ${nota.valor.toFixed(2)}

        <br>

        <strong>Pagamento:</strong> 
        ${nota.pagamento}

        <br>

        <strong>Status:</strong> 
        ${nota.status}

        <br>

        <small>${nota.data}</small>

        <br><br>

        ${
            nota.status === "pendente"
            ?

            `<button onclick="darBaixa('${nota.id}')">
                Dar Baixa
            </button>`

            :

            `<button disabled>
                Pago
            </button>`
        }

        <hr>
    `;


    listaNotas.appendChild(li);
}


// LIMPAR
function limparCampos(){

    numeroNota.value = "";

    cliente.value = "";

    valorNota.value = "";
}

async function darBaixa(id){

    try{

        const notaRef = doc(db, "notas", id);

        await updateDoc(notaRef, {

            status: "pago"
        });

        alert("Nota baixada!");

        carregarNotas();

    }catch(error){

        console.log(error);

        alert("Erro ao dar baixa");
    }
}


window.darBaixa = darBaixa;