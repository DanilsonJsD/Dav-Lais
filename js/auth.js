import {

    db,

    collection,

    getDocs

} from "./firebase.js";


// =========================
// ELEMENTOS
// =========================

const email =
document.getElementById("email");

const senha =
document.getElementById("senha");

const btnLogin =
document.getElementById("btnLogin");


// =========================
// LOGIN
// =========================

btnLogin.addEventListener(

    "click",

    login
);


async function login(){

    if(

        email.value === "" ||

        senha.value === ""

    ){

        alert(
            "Preencha os campos"
        );

        return;
    }


    try{

        const querySnapshot =
        await getDocs(
            collection(db, "usuarios")
        );


        let usuarioEncontrado =
        null;


        querySnapshot.forEach((docItem) => {

            const usuario =
            docItem.data();


            if(

                usuario.email === email.value &&

                usuario.senha === senha.value

            ){

                usuarioEncontrado = {

                    id: docItem.id,

                    ...usuario
                };
            }
        });


        if(usuarioEncontrado){

            localStorage.setItem(

                "usuarioLogado",

                JSON.stringify(
                    usuarioEncontrado
                )
            );


            window.location.href =
            "dashboard.html";

        }else{

            alert(
                "Email ou senha inválidos"
            );
        }

    }catch(error){

        console.log(error);

        alert(
            "Erro login"
        );
    }
}