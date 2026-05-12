// =========================
// SALVAR OFFLINE
// =========================

export function salvarVendaOffline(venda){

    let vendasOffline =
    JSON.parse(
        localStorage.getItem(
            "vendasOffline"
        )
    ) || [];


    vendasOffline.push(venda);


    localStorage.setItem(

        "vendasOffline",

        JSON.stringify(vendasOffline)
    );
}


// =========================
// PEGAR VENDAS OFFLINE
// =========================

export function obterVendasOffline(){

    return JSON.parse(

        localStorage.getItem(
            "vendasOffline"
        )

    ) || [];
}


// =========================
// LIMPAR OFFLINE
// =========================

export function limparVendasOffline(){

    localStorage.removeItem(
        "vendasOffline"
    );
}