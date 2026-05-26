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

// =========================
// PRODUTOS OFFLINE
// =========================

export function salvarProdutosOffline(
    produtos
){

    localStorage.setItem(

        "produtosOffline",

        JSON.stringify(produtos)
    );
}


export function obterProdutosOffline(){

    return JSON.parse(

        localStorage.getItem(
            "produtosOffline"
        )

    ) || [];
}

// =========================
// SINCRONIZAÇÃO
// =========================

export async function sincronizarVendas(

    db,

    collection,

    addDoc

){

    const vendasOffline =

    JSON.parse(

        localStorage.getItem(
            "vendasOffline"
        )

    ) || [];


    if(vendasOffline.length <= 0){

        return;
    }


    for(const venda of vendasOffline){

        await addDoc(

            collection(db, "vendas"),

            venda
        );
    }


    localStorage.removeItem(
        "vendasOffline"
    );


    console.log(
        "Vendas sincronizadas"
    );
}