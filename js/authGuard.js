// =========================
// USUÁRIO
// =========================

const usuarioLogado = JSON.parse(

    localStorage.getItem(
        "usuarioLogado"
    )
);


// =========================
// NÃO LOGADO
// =========================

if(!usuarioLogado){

    window.location.href =
    "login.html";
}


// =========================
// VERIFICAR PERMISSÃO
// =========================

export function verificarPermissao(

    permissao
){

    if(

        !usuarioLogado.permissoes[
            permissao
        ]

    ){

        alert(
            "Sem permissão!"
        );

        window.location.href =
        "dashboard.html";
    }
}