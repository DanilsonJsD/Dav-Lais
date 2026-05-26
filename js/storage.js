// =========================
// SALVAR OFFLINE
// =========================

export function salvarVendaOffline(venda){

    try{

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

        console.log(
            "✅ Venda salva offline:",
            venda
        );

        return true;

    }catch(error){

        console.error(
            "❌ Erro ao salvar offline:",
            error
        );

        return false;
    }
}


// =========================
// PEGAR VENDAS OFFLINE
// =========================

export function obterVendasOffline(){

    try{

        return JSON.parse(

            localStorage.getItem(
                "vendasOffline"
            )

        ) || [];

    }catch(error){

        console.error(
            "Erro ao obter vendas offline:",
            error
        );

        return [];
    }
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

    try{

        const vendasOffline =

        JSON.parse(

            localStorage.getItem(
                "vendasOffline"
            )

        ) || [];


        if(vendasOffline.length <= 0){

            console.log(
                "ℹ️ Nenhuma venda para sincronizar"
            );

            return true;
        }


        console.log(
            "🔄 Sincronizando",
            vendasOffline.length,
            "vendas..."
        );


        let sincronizadas = 0;
        let erros = 0;


        for(const venda of vendasOffline){

            try{

                await addDoc(

                    collection(db, "vendas"),

                    venda
                );

                sincronizadas++;

                console.log(
                    "✅ Venda sincronizada"
                );

            }catch(error){

                erros++;

                console.error(
                    "❌ Erro ao sincronizar venda:",
                    error
                );
            }
        }


        if(sincronizadas > 0){

            localStorage.removeItem(
                "vendasOffline"
            );

            console.log(
                `✅ Sincronização concluída: 
                ${sincronizadas} sucesso, 
                ${erros} erros`
            );
        }

        return sincronizadas > 0;

    }catch(error){

        console.error(
            "❌ Erro em sincronizarVendas:",
            error
        );

        return false;
    }
}