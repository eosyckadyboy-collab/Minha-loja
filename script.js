const WHATSAPP = "258849596174";

let carrinho = JSON.parse(localStorage.getItem("carrinhoArte")) || [];
let categoriaAtual = "Todos";

const produtosPublicados =
  JSON.parse(localStorage.getItem("produtosPublicados")) || [];

let todosProdutos = [
  ...produtos,
  ...produtosPublicados.filter(p => p.pendente !== true)
];

const produtosDiv = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");

function dinheiro(valor){
  return Number(valor).toLocaleString("pt-MZ") + " MT";
}

function renderProdutos(){

  const busca = pesquisa.value.toLowerCase().trim();

  const lista = todosProdutos.filter(produto => {

    const correspondeCategoria =
      categoriaAtual === "Todos" ||
      produto.categoria === categoriaAtual;

    const correspondeBusca =
      produto.nome.toLowerCase().includes(busca) ||
      produto.artista.toLowerCase().includes(busca) ||
      produto.categoria.toLowerCase().includes(busca);

    return correspondeCategoria && correspondeBusca;
  });

  if(!lista.length){
    produtosDiv.innerHTML =
      '<p class="vazio">Nenhuma obra encontrada.</p>';
    return;
  }

  produtosDiv.innerHTML = lista.map(produto => `

    <article class="produto">

      <img
        class="produto-img"
        src="${produto.imagem}"
        alt="${produto.nome}"
        onerror="this.src='imagens/1785836675510.jpg'"
      >

      <div class="produto-info">

        <span class="produto-categoria">
          ${produto.categoria}
        </span>

        <h3>${produto.nome}</h3>

        <p class="produto-artista">
          🎨 ${produto.artista}
        </p>

        <div class="preco">
          ${dinheiro(produto.preco)}
        </div>

        <div class="produto-acoes">

          <button onclick="verProduto(${produto.id})">
            Ver detalhes
          </button>

          <button onclick="adicionarCarrinho(${produto.id})">
            🛒 Comprar
          </button>

        </div>

      </div>

    </article>

  `).join("");
}

function verProduto(id){

  const produto = todosProdutos.find(p => p.id === id);

  if(!produto) return;

  const modal = document.getElementById("produtoModal");
  const detalhes = document.getElementById("produtoDetalhes");

  detalhes.innerHTML = `

    <div class="detalhe-produto">

      <span class="produto-categoria">
        ${produto.categoria}
      </span>

      <h2>${produto.nome}</h2>

      <img src="${produto.imagem}" alt="${produto.nome}">

      <p>
        <strong>Artista:</strong> ${produto.artista}
      </p>

      <p>
        ${produto.descricao || "Obra artística original."}
      </p>

      <div class="preco">
        ${dinheiro(produto.preco)}
      </div>

      <button
        class="btn principal"
        onclick="adicionarCarrinho(${produto.id}); fecharModal();"
      >
        🛒 Adicionar ao carrinho
      </button>

    </div>
  `;

  modal.classList.add("aberto");
}

function fecharModal(){
  document.getElementById("produtoModal").classList.remove("aberto");
}

function adicionarCarrinho(id){

  const produto = todosProdutos.find(p => p.id === id);

  if(!produto) return;

  const existe = carrinho.find(p => p.id === id);

  if(existe){
    alert("Esta obra já está no seu carrinho.");
    return;
  }

  carrinho.push(produto);

  salvarCarrinho();

  alert("Obra adicionada ao carrinho! 🎨");

  renderCarrinho();

  document.getElementById("carrinho").scrollIntoView({
    behavior:"smooth"
  });
}

function removerCarrinho(id){

  carrinho = carrinho.filter(p => p.id !== id);

  salvarCarrinho();
  renderCarrinho();
}

function salvarCarrinho(){
  localStorage.setItem(
    "carrinhoArte",
    JSON.stringify(carrinho)
  );
}

function renderCarrinho(){

  const lista = document.getElementById("lista-carrinho");
  const total = document.getElementById("total");

  if(!carrinho.length){

    lista.innerHTML =
      '<p class="vazio">O seu carrinho está vazio.</p>';

    total.textContent = "0 MT";

    return;
  }

  lista.innerHTML = carrinho.map(produto => `

    <div class="item-carrinho">

      <div>
        <strong>${produto.nome}</strong>
        <br>
        <small>
          ${produto.artista} • ${dinheiro(produto.preco)}
        </small>
      </div>

      <button onclick="removerCarrinho(${produto.id})">
        Remover
      </button>

    </div>

  `).join("");

  const soma = carrinho.reduce(
    (total, produto) => total + Number(produto.preco),
    0
  );

  total.textContent = dinheiro(soma);
}

function finalizarWhatsApp(){

  if(!carrinho.length){

    alert("O seu carrinho está vazio.");

    return;
  }

  const total = carrinho.reduce(
    (soma, produto) => soma + Number(produto.preco),
    0
  );

  let mensagem =
    "Olá! 👋 Gostaria de fazer um pedido na Minha Loja de Arte.%0A%0A";

  carrinho.forEach((produto, index) => {

    mensagem +=
      `${index + 1}. ${produto.nome}%0A` +
      `Artista: ${produto.artista}%0A` +
      `Preço: ${dinheiro(produto.preco)}%0A%0A`;
  });

  mensagem +=
    `Total: ${dinheiro(total)}%0A%0A` +
    "Aguardo informações para concluir o pedido.";

  const urlWhatsApp =
    `https://wa.me/${WHATSAPP}?text=${mensagem}`;

  window.location.href = urlWhatsApp;
}

document.getElementById("limpar").addEventListener("click", () => {

  if(!carrinho.length) return;

  carrinho = [];

  salvarCarrinho();
  renderCarrinho();
});

pesquisa.addEventListener("input", renderProdutos);

document.querySelectorAll(".filtro").forEach(botao => {

  botao.addEventListener("click", () => {

    document
      .querySelectorAll(".filtro")
      .forEach(b => b.classList.remove("ativo"));

    botao.classList.add("ativo");

    categoriaAtual = botao.dataset.categoria;

    renderProdutos();
  });

});

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("aberto");
});

document.querySelectorAll(".nav-links a").forEach(link => {

  link.addEventListener("click", () => {
    navLinks.classList.remove("aberto");
  });

});

function abrirVendedor(){
  document
    .getElementById("vendedorModal")
    .classList.add("aberto");
}

function fecharVendedor(){
  document
    .getElementById("vendedorModal")
    .classList.remove("aberto");
}

document
  .getElementById("formVendedor")
  .addEventListener("submit", function(event){

    event.preventDefault();

    const arquivo =
      document.getElementById("imagemObra").files[0];

    if(!arquivo){
      alert("Escolha uma imagem da obra.");
      return;
    }

    const leitor = new FileReader();

    leitor.onload = function(){

      const novoProduto = {

        id: Date.now(),

        nome:
          document.getElementById("nomeObra").value.trim(),

        preco:
          Number(document.getElementById("precoObra").value),

        categoria:
          document.getElementById("categoriaObra").value,

        artista:
          document.getElementById("nomeArtista").value.trim(),

        whatsapp:
          document.getElementById("whatsappArtista").value.trim(),

        descricao:
          document.getElementById("descricaoObra").value.trim(),

        imagem: leitor.result,

        pendente: true,

        data:
          new Date().toISOString()
      };

      const publicados =
        JSON.parse(
          localStorage.getItem("produtosPublicados")
        ) || [];

      publicados.push(novoProduto);

      localStorage.setItem(
        "produtosPublicados",
        JSON.stringify(publicados)
      );

      alert(
        "Obra enviada! 🎨\n\n" +
        "Os dados foram guardados neste dispositivo " +
        "e a obra deverá ser aprovada antes da publicação definitiva."
      );

      document
        .getElementById("formVendedor")
        .reset();

      fecharVendedor();

    };

    leitor.readAsDataURL(arquivo);

  });

document.getElementById("produtoModal").addEventListener(
  "click",
  function(event){

    if(event.target === this){
      fecharModal();
    }

  }
);

document.getElementById("vendedorModal").addEventListener(
  "click",
  function(event){

    if(event.target === this){
      fecharVendedor();
    }

  }
);

renderProdutos();
renderCarrinho();
