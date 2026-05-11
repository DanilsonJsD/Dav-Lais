import {
  db,
  collection,
  addDoc
} from "./firebase.js";


async function adicionarVenda(produto, valor){

  const venda = {

    produto: produto,

    valor: valor,

    data: new Date().toLocaleString()
  };

  try{

    await addDoc(
      collection(db, "vendas"),
      venda
    );

    alert("Venda salva no Firestore!");

  }catch(error){

    console.log(error);

    alert("Erro ao salvar");
  }
}


window.adicionarVenda = adicionarVenda;