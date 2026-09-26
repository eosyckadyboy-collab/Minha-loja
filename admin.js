const ADMIN_PIN = "2580";

function entrarAdmin() {
  const pin = document.getElementById("pin").value;
  const erro = document.getElementById("erro");

  if (pin === ADMIN_PIN) {
    sessionStorage.setItem("adminLogado", "true");

    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("painel").classList.remove("hidden");

    carregarPainel();
  } else {
    erro.textContent = "❌ PIN incorreto.";
  }
}

function sairAdmin() {
  sessionStorage.removeItem("adminLogado");
  location.reload();
}

function obterProdutos() {
  return JSON.parse(
    localStorage.getItem("produtosPublicados") || "[]"
  );
}

function salvarProdutos(produtos) {
  localStorage.setItem(
    "produtosPublicados",
    JSON.stringify(produtos)
  );
}

function dinheiro(valor) {
  return Number(valor || 0).toLocaleString("pt-MZ") + " MT";
}

function carregarPainel() {
  const produtos = obterProdutos();

  const pendentes = produtos.filter(
    p => p.pendente === true
  );

  const aprovadas = produtos.filter(
    p => p.pendente !== true
  );

  document.getElementById("pendentes").textContent =
    pendentes.length;

  document.getElementById("aprovadas").textContent =
    aprovadas.length;

  document.getElementById("total").textContent =
    produtos.length;

  renderPendentes(pendentes);
  renderAprovadas(aprovadas);
}

function renderPendentes(lista) {
  const container =
    document.getElementById("listaPendentes");

  if (!lista.length) {
    container.innerHTML =
      "<p>🎉 Não existem obras pendentes.</p>";
    return;
  }

  container.innerHTML = lista.map(p => `
    <div class="produto">
      <img src="${p.imagem}" alt="${p.nome || "Obra de arte"}">

      <h3>${p.nome || "Sem nome"}</h3>

      <p>
        <strong>Artista:</strong>
        ${p.artista || "Não informado"}
      </p>

      <p>
        <strong>Preço:</strong>
        ${dinheiro(p.preco)}
      </p>

      <p>
        ${p.descricao || "Sem descrição"}
      </p>

      <div class="acoes">
        <button
          class="aprovar"
          onclick="aprovarObra('${p.id}')">
          ✅ Aprovar
        </button>

        <button
          class="rejeitar"
          onclick="rejeitarObra('${p.id}')">
          ❌ Rejeitar
        </button>
      </div>
    </div>
  `).join("");
}

function renderAprovadas(lista) {
  const container =
    document.getElementById("listaAprovadas");

  if (!lista.length) {
    container.innerHTML =
      "<p>Nenhuma obra publicada ainda.</p>";
    return;
  }

  container.innerHTML = lista.map(p => `
    <div class="produto">
      <img src="${p.imagem}" alt="${p.nome || "Obra de arte"}">

      <h3>${p.nome || "Sem nome"}</h3>

      <p>
        <strong>Artista:</strong>
        ${p.artista || "Não informado"}
      </p>

      <p>
        <strong>Preço:</strong>
        ${dinheiro(p.preco)}
      </p>

      <button
        class="apagar"
        onclick="apagarObra('${p.id}')">
        🗑️ Apagar obra
      </button>
    </div>
  `).join("");
}

function aprovarObra(id) {
  const produtos = obterProdutos();

  const produto = produtos.find(
    p => String(p.id) === String(id)
  );

  if (!produto) return;

  produto.pendente = false;

  salvarProdutos(produtos);
  carregarPainel();

  alert("✅ Obra aprovada e publicada!");
}

function rejeitarObra(id) {
  if (!confirm("Rejeitar esta obra?")) return;

  const produtos = obterProdutos();

  const novos = produtos.filter(
    p => String(p.id) !== String(id)
  );

  salvarProdutos(novos);
  carregarPainel();

  alert("Obra rejeitada.");
}

function apagarObra(id) {
  if (!confirm("Apagar esta obra publicada?")) return;

  const produtos = obterProdutos();

  const novos = produtos.filter(
    p => String(p.id) !== String(id)
  );

  salvarProdutos(novos);
  carregarPainel();

  alert("Obra apagada.");
}

document.addEventListener("DOMContentLoaded", () => {

  if (sessionStorage.getItem("adminLogado") === "true") {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("painel").classList.remove("hidden");

    carregarPainel();
  }

  const pin = document.getElementById("pin");

  if (pin) {
    pin.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        entrarAdmin();
      }
    });
  }

});
