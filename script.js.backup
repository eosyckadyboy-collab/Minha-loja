const produtosContainer = document.getElementById("produtos");
const lista = document.getElementById("lista-carrinho");
const totalElemento = document.getElementById("total");
const limpar = document.getElementById("limpar");

let carrinho = [];

const produtosPublicados =
  JSON.parse(localStorage.getItem("meusProdutos")) || [];

const todosProdutos = [...produtos, ...produtosPublicados];

todosProdutos.forEach((produto) => {
  const div = document.createElement("div");
  div.className = "produto";

  div.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}" style="width:100%; border-radius:10px;">
    <h3>${produto.nome}</h3>
    <p>${produto.descricao}</p>
    <strong>${produto.preco.toLocaleString("pt-PT")} MT</strong>
    <br><br>
    <button>Adicionar ao carrinho</button>
  `;

  div.querySelector("button").addEventListener("click", () => {
    carrinho.push(produto);
    atualizarCarrinho();
  });

  produtosContainer.appendChild(div);
});

function atualizarCarrinho() {
  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="vazio">Seu carrinho está vazio.</p>';
    totalElemento.textContent = "0 MT";
    return;
  }

  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco;

    const div = document.createElement("div");
    div.className = "item-carrinho";

    div.innerHTML = `
      <span>${item.nome} — ${item.preco.toLocaleString("pt-PT")} MT</span>
      <button onclick="removerProduto(${index})">Remover</button>
    `;

    lista.appendChild(div);
  });

  totalElemento.textContent =
    total.toLocaleString("pt-PT") + " MT";
}

function removerProduto(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

limpar.addEventListener("click", () => {
  carrinho = [];
  atualizarCarrinho();
});

function finalizarWhatsApp() {
  if (carrinho.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  let total = 0;
  let mensagem = "Olá! Quero fazer este pedido:%0A%0A";

  carrinho.forEach((item, index) => {
    mensagem += `${index + 1}. ${item.nome} - ${item.preco} MT%0A`;
    total += item.preco;
  });

  mensagem += `%0A*Total: ${total} MT*`;

  const url = `https://wa.me/258849596174?text=${mensagem}`;

  window.open(url, "_blank");
}
