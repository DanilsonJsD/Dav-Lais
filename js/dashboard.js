import {

    db,

    collection,

    getDocs

} from "./firebase.js";


// ELEMENTOS

const vendasHoje =
    document.getElementById("vendasHoje");

const pedidosHoje =
    document.getElementById("pedidosHoje");

const maisVendido =
    document.getElementById("maisVendido");

const totalProdutos =
    document.getElementById("totalProdutos");


// =========================
// DASHBOARD
// =========================

async function carregarDashboard() {

    try {

        // =========================
        // VENDAS
        // =========================

        const vendasSnapshot =
            await getDocs(
                collection(db, "vendas")
            );


        let totalDia = 0;

        let qtdPedidos = 0;

        let produtosVendidos = {};


        const hoje =
            new Date().toLocaleDateString();


        vendasSnapshot.forEach((docItem) => {

            const venda =
                docItem.data();


            // PROTEÇÃO
            const totalVenda =
                Number(venda.total) || 0;


            const itensVenda =
                venda.itens || [];


            const dataVenda =

                venda.data

                    ?

                    new Date(
                        venda.data
                    ).toLocaleDateString()

                    :

                    "";


            // TOTAL HOJE
            if (dataVenda === hoje) {

                totalDia += totalVenda;

                qtdPedidos++;
            }


            // PRODUTOS
            itensVenda.forEach((item) => {

                const nomeProduto =
                    item.produto || "Produto";


                const quantidade =
                    Number(item.quantidade) || 0;


                if (

                    produtosVendidos[
                    nomeProduto
                    ]

                ) {

                    produtosVendidos[
                        nomeProduto
                    ] += quantidade;

                } else {

                    produtosVendidos[
                        nomeProduto
                    ] = quantidade;
                }
            });
        });


        // =========================
        // MAIS VENDIDO
        // =========================

        let topProduto =
            "Nenhum";

        let maior = 0;


        for (const produto in produtosVendidos) {

            if (

                produtosVendidos[
                produto
                ] > maior

            ) {

                maior =
                    produtosVendidos[
                    produto
                    ];

                topProduto =
                    produto;
            }
        }


        // =========================
        // PRODUTOS
        // =========================

        const produtosSnapshot =
            await getDocs(
                collection(db, "produtos")
            );


        const qtdProdutos =
            produtosSnapshot.size;


        // =========================
        // ATUALIZA TELA
        // =========================

        vendasHoje.innerHTML =
            `R$ ${totalDia.toFixed(2)}`;

        pedidosHoje.innerHTML =
            qtdPedidos;

        maisVendido.innerHTML =
            topProduto;

        totalProdutos.innerHTML =
            qtdProdutos;

    } catch (error) {

        console.log(

            "Erro dashboard:",

            error
        );
    }
}


// =========================
// INICIAR
// =========================

carregarDashboard();

// =========================
// PERMISSÕES MENU
// =========================

const usuarioLogado = JSON.parse(

    localStorage.getItem(
        "usuarioLogado"
    )
);


if(usuarioLogado){

    const permissoes =
    usuarioLogado.permissoes;


    // PDV
    if(!permissoes.pdv){

        document.getElementById(
            "menu-pdv"
        ).style.display = "none";
    }


    // ESTOQUE
    if(!permissoes.estoque){

        document.getElementById(
            "menu-estoque"
        ).style.display = "none";
    }


    // FINANCEIRO
    if(!permissoes.financeiro){

        document.getElementById(
            "menu-financeiro"
        ).style.display = "none";
    }


    // ANALISES
    if(!permissoes.analises){

        document.getElementById(
            "menu-analises"
        ).style.display = "none";
    }


    // USUARIOS
    if(!permissoes.usuarios){

        document.getElementById(
            "menu-usuarios"
        ).style.display = "none";
    }


    // CONFIG
    if(!permissoes.configuracoes){

        document.getElementById(
            "menu-configuracoes"
        ).style.display = "none";
    }


    // IMPORTAÇÃO
    if(!permissoes.importacao){

        document.getElementById(
            "menu-importacao"
        ).style.display = "none";
    }
}