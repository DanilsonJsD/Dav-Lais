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

async function carregarDashboard(){

    try{

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


            const dataVenda =
            new Date(
                venda.data
            ).toLocaleDateString();


            // TOTAL HOJE
            if(dataVenda === hoje){

                totalDia += venda.total;

                qtdPedidos++;
            }


            // PRODUTOS
            venda.itens.forEach((item) => {

                if(

                    produtosVendidos[
                        item.produto
                    ]

                ){

                    produtosVendidos[
                        item.produto
                    ] += item.quantidade;

                }else{

                    produtosVendidos[
                        item.produto
                    ] = item.quantidade;
                }
            });
        });


        // =========================
        // MAIS VENDIDO
        // =========================

        let topProduto =
        "Nenhum";

        let maior = 0;


        for(const produto in produtosVendidos){

            if(

                produtosVendidos[
                    produto
                ] > maior

            ){

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
        `R$ ${totalDia}`;

        pedidosHoje.innerHTML =
        qtdPedidos;

        maisVendido.innerHTML =
        topProduto;

        totalProdutos.innerHTML =
        qtdProdutos;

    }catch(error){

        console.log(error);
    }
}


// =========================
// INICIAR
// =========================

carregarDashboard();