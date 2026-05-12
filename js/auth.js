const btnLogin =
document.getElementById("btnLogin");


btnLogin.addEventListener(
    "click",
    fazerLogin
);


function fazerLogin(){

    const email =
    document.getElementById("email").value;

    const senha =
    document.getElementById("senha").value;


    if(
        email === "d97.dias@gmail.com"
        &&
        senha === "123"
    ){

        window.location.href =
        "pages/dashboard.html";

    }else{

        alert("E-mail ou senha inválidos");
    }
}