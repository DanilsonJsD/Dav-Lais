// =========================
// SALVAR VENDAS
// =========================

export function salvarVendaOffline(venda){

    let vendas = JSON.parse(

        localStorage.getItem(
            "vendasOffline"
        )

    ) || [];


    vendas.push(venda);


    localStorage.setItem(

        "vendasOffline",

        JSON.stringify(vendas)
    );
}


// =========================
// OBTER VENDAS
// =========================

export function obterVendasOffline(){

    return JSON.parse(

        localStorage.getItem(
            "vendasOffline"
        )

    ) || [];
}


// =========================
// LIMPAR VENDAS
// =========================

export function limparVendasOffline(){

    localStorage.removeItem(
        "vendasOffline"
    );
}


// =========================
// SINCRONIZAR
// =========================

export async function sincronizarVendas(

    db,

    collection,

    addDoc

){

    const vendas =
    obterVendasOffline();


    if(vendas.length <= 0){

        return;
    }


    for(const venda of vendas){

        try{

            await addDoc(

                collection(db, "vendas"),

                venda
            );

        }catch(error){

            console.log(

                "Erro sincronizar",

                error
            );

            return;
        }
    }


    limparVendasOffline();
}


// =========================
// PRODUTOS
// =========================

export function salvarProdutosOffline(produtos){

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