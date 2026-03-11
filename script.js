// ===============================
// HORÁRIO DE FUNCIONAMENTO
// ===============================
function estaAberto() {
    const agora = new Date();
    const dia = agora.getDay();
    const hora = agora.getHours();
    const minuto = agora.getMinutes();
    const horarioAtual = hora + minuto / 60;

    if (dia === 3) return false; // Quarta-feira fechado
    if (dia >= 1 && dia <= 5) return horarioAtual >= 18.5 && horarioAtual <= 21;
    if (dia === 0 || dia === 6) return horarioAtual >= 15 && horarioAtual <= 21;
    return false;
}

function atualizarStatusVisual() {
    const status = document.getElementById("statusLoja");
    if (!status) return;
    if (estaAberto()) {
        status.innerHTML = "🟢 ABERTO AGORA";
        status.classList.remove("fechado");
        status.classList.add("aberto");
    } else {
        status.innerHTML = "🔴 FECHADO AGORA";
        status.classList.remove("aberto");
        status.classList.add("fechado");
    }
}

setInterval(atualizarStatusVisual, 60000);
atualizarStatusVisual();

// ===============================
// LISTAS DE ITENS
// ===============================
const acompanhamentos = ["", "Flocos de arroz", "Farinha láctea", "Cereja em calda", "Leite em pó", "Chocoball", "Granulado", "Amendoim", "Sucrilhos", "Granola", "Jujuba", "Mms", "Bis"];
const frutas = ["Banana", "Kiwi", "Uva"];
const coberturas = ["Leite condensado", "Chocolate", "Morango", "Maracujá", "Kiwi"];
const cremes = ["Chocolate", "Maracujá", "Morango", "Ninho"];

const acompanhamentosBatida = ["Flocos de arroz", "Amendoim", "Farinha láctea", "Leite em pó", "Granulado"];
const coberturasBatida = ["Chocolate", "Kiwi", "Maracujá", "Morango", "Leite condensado"];

let batidaSelecionada = null;
let tamanhoSelecionado = null;
let carrinho = [];
let total = 0;

// ===============================
// LIMITES DINÂMICOS
// ===============================
const limitesAcai = {
    "300": { acomp: 3, creme: 1, fruta: 1, cobertura: 1 },
    "400": { acomp: 4, creme: 1, fruta: 1, cobertura: 1 },
    "500": { acomp: 5, creme: 2, fruta: 1, cobertura: 1 },
    "tigela": { acomp: 6, creme: 2, fruta: 2, cobertura: 2 }
};

const limitesBatida = {
    "300ml": { acomp: 2, cobertura: 1 },
    "500ml": { acomp: 3, cobertura: 1 }
};

// ===============================
// INICIALIZAÇÃO AO CARREGAR
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    // Modal Açaí já existem no HTML, só vamos preparar os checkboxes
    document.getElementById("montagem").style.display = "none";
    document.getElementById("montagemBatida").style.display = "none";
});

// ===============================
// FUNÇÃO CRIAR CHECKBOX
// ===============================
function criarCheckbox(lista, id) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = "";
    lista.forEach(item => {
        const label = document.createElement("label");
        label.style.display = "block"; // garante que apareça
        label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
        container.appendChild(label);
    });
}

// ===============================
// FUNÇÃO DE AVISO
// ===============================
function mostrarAviso(texto) {
    const aviso = document.getElementById("aviso");
    aviso.innerText = texto;
    aviso.style.display = "block";
    setTimeout(() => aviso.style.display = "none", 2500);
}

// ===============================
// LIMITAR CHECKBOX DINÂMICO
// ===============================
function limitarCheckboxesDinamico(id, limite) {
    const container = document.getElementById(id);
    if (!container) return;
    container.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", () => {
            const selecionados = [...container.querySelectorAll("input:checked")];
            if (selecionados.length > limite) {
                cb.checked = false;
                mostrarAviso(`Você só pode escolher até ${limite} item(s)!`);
            }
        });
    });
}

// ===============================
// ===============================
// SELECIONAR TAMANHO DO AÇAÍ
// ===============================
function selecionarTamanho(info) {
    const dados = info.split("|");
    tamanhoSelecionado = dados[0];        // "300", "400", etc.
    const preco = parseFloat(dados[1]);   // 13, 17, 19...

    // Cria checkboxes ANTES de abrir o modal
    criarCheckbox(acompanhamentos, "acomp");
    criarCheckbox(frutas, "frutas");
    criarCheckbox(coberturas, "coberturas");
    criarCheckbox(cremes, "cremes");

    const limites = limitesAcai[tamanhoSelecionado];
    limitarCheckboxesDinamico("acomp", limites.acomp);
    limitarCheckboxesDinamico("frutas", limites.fruta);
    limitarCheckboxesDinamico("coberturas", limites.cobertura);
    limitarCheckboxesDinamico("cremes", limites.creme);

    // Guarda o preço junto com o tamanho para adicionar ao carrinho depois
    tamanhoSelecionado = `${tamanhoSelecionado}|${preco}`;

    // Agora abre o modal
    document.getElementById("montagem").style.display = "block";
}
// ===============================
// SELECIONAR BATIDINHA
// ===============================
function selecionarBatida(info) {
    batidaSelecionada = info;  // ✅ Salva o info completo (ex: "300ml|13.00")

    criarCheckbox(acompanhamentosBatida, "acompBatida");
    criarCheckbox(coberturasBatida, "cobBatida");

    const limites = limitesBatida[batidaSelecionada.split("|")[0]] || { acomp: 2, cobertura: 1 };
    limitarCheckboxesDinamico("acompBatida", limites.acomp);
    limitarCheckboxesDinamico("cobBatida", limites.cobertura);

    document.getElementById("montagemBatida").style.display = "block";
}
// ===============================
// CRIAR CHECKBOX
// ===============================
function criarCheckbox(lista, id) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = "";
    lista.forEach(item => {
        const label = document.createElement("label");
        label.style.display = "block"; // garante que apareça
        label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
        container.appendChild(label);
    });
}

// ===============================
// LIMITAR CHECKBOX
// ===============================
function limitarCheckboxesDinamico(id, limite) {
    const container = document.getElementById(id);
    if (!container) return;
    container.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", () => {
            const selecionados = [...container.querySelectorAll("input:checked")];
            if (selecionados.length > limite) {
                cb.checked = false;
                mostrarAviso(`Você só pode escolher até ${limite} item(s)!`);
            }
        });
    });
}

// ===============================
// ABRIR / FECHAR MODAL
// ===============================
function abrirModalAcai() {
    document.getElementById("montagem").style.display = "block";
}

function fecharModalAcai() {
    document.getElementById("montagem").style.display = "none";
    document.querySelectorAll("#montagem input[type='checkbox']").forEach(c => c.checked = false);
    tamanhoSelecionado = null;
}
// ===============================
// PEGA SELECIONADOS
// ===============================
function pegarSelecionados(id) {
    return [...document.querySelectorAll(`#${id} input:checked`)].map(i => i.value);
}

// ===============================
// ADICIONAR AO CARRINHO
// ===============================
function adicionarBatida() {
    if (!batidaSelecionada) return mostrarAviso("Selecione o tamanho da batida!");
    const [tamanho, precoStr] = batidaSelecionada.split("|");
    const preco = parseFloat(precoStr);

    const acompSel = pegarSelecionados("acompBatida");
    const cobSel = pegarSelecionados("cobBatida");

    if (acompSel.length > 2) return mostrarAviso("Escolha até 2 acompanhamentos!");
    if (cobSel.length > 1) return mostrarAviso("Escolha apenas 1 cobertura!");

    const descricao = `Batidinha de Açaí ${tamanho}\nAcomp: ${acompSel.join(", ") || "Nenhum"}\nCobertura: ${cobSel.join(", ") || "Nenhuma"}`;

    carrinho.push({ nome: descricao, preco, qtd: 1 });
    total += preco;

    document.getElementById("montagemBatida").style.display = "none";
    atualizarCarrinho();
    mostrarAviso("Batidinha adicionada!");
}

function adicionarAcai() {
    if (!tamanhoSelecionado) return mostrarAviso("Selecione um tamanho primeiro!");

    const dados = tamanhoSelecionado.split("|");
    const nomeTamanho = dados[0];
    const preco = parseFloat(dados[1]);
    const limites = limitesAcai[nomeTamanho];

    const acompSel = pegarSelecionados("acomp");
    const frutaSel = pegarSelecionados("frutas");
    const cobSel = pegarSelecionados("coberturas");
    const cremeSel = pegarSelecionados("cremes");

    if (acompSel.length > limites.acomp) return mostrarAviso(`Limite de ${limites.acomp} acompanhamentos!`);
    if (frutaSel.length > limites.fruta) return mostrarAviso(`Limite de ${limites.fruta} frutas!`);
    if (cobSel.length > limites.cobertura) return mostrarAviso(`Limite de ${limites.cobertura} coberturas!`);
    if (cremeSel.length > limites.creme) return mostrarAviso(`Limite de ${limites.creme} cremes!`);

    const descricao = `Açaí ${nomeTamanho}\nAcomp: ${acompSel.join(", ") || "Nenhum"}\nFrutas: ${frutaSel.join(", ") || "Nenhuma"}\nCoberturas: ${cobSel.join(", ") || "Nenhuma"}\nCremes: ${cremeSel.join(", ") || "Nenhum"}`;

    carrinho.push({ nome: descricao, preco, qtd: 1 });
    total += preco;

    atualizarCarrinho();
    mostrarAviso("Açaí adicionado!");
    fecharModalAcai();
}

// ===============================
// RESTANTE DO SEU CÓDIGO
// ===============================
// (Carrinho, Pix, Finalizar pedido, etc... mantém exatamente igual ao seu script)

// ===============================
// CARRINHO
// ===============================
function addItem(nome, preco) {
    carrinho.push({ nome: nome, preco: preco, qtd: 1 });
    total += preco;
    atualizarCarrinho();
    mostrarAviso(nome + " adicionado ao carrinho!");
}

function atualizarCarrinho() {
    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";
    carrinho.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="item-carrinho">
                <div class="info-item">
                    <strong>${item.nome}</strong>
                    <p>R$ ${(item.preco * item.qtd).toFixed(2)}</p>
                </div>
                <div class="controle-qtd">
                    <button onclick="diminuirQtd(${index})">-</button>
                    <span>${item.qtd}</span>
                    <button onclick="aumentarQtd(${index})">+</button>
                </div>
            </div>`;
        lista.appendChild(li);
    });

    document.getElementById("total").innerText = total.toFixed(2);
    document.getElementById("contador").innerText = carrinho.length;
}

function aumentarQtd(index) {
    carrinho[index].qtd++;
    total += carrinho[index].preco;
    atualizarCarrinho();
}

function diminuirQtd(index) {
    if (carrinho[index].qtd > 1) {
        carrinho[index].qtd--;
        total -= carrinho[index].preco;
    } else {
        total -= carrinho[index].preco;
        carrinho.splice(index, 1);
    }
    atualizarCarrinho();
}

// ===============================
// MODAL CARRINHO E PIX
// ===============================
function abrirCarrinho() {
    document.getElementById("carrinho").classList.add("ativo");
    document.getElementById("overlay").style.display = "block";
}

function fecharCarrinho() {
    document.getElementById("carrinho").classList.remove("ativo");
    document.getElementById("overlay").style.display = "none";
}

function mostrarTroco() {
    const pagamento = document.querySelector('input[name="pagamento"]:checked')?.value;
    document.getElementById("areaTroco").style.display = pagamento === "Dinheiro" ? "block" : "none";
}

function copiarPix() {
    const chave = document.getElementById("chavePix").textContent.trim();
    const msg = document.getElementById("msgPix");

    const textarea = document.createElement("textarea");
    textarea.value = chave;
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const sucesso = document.execCommand("copy");
        if (sucesso) {
            msg.textContent = "✅ Chave Pix copiada com sucesso!";
            msg.style.color = "green";
        } else {
            msg.textContent = "❌ Não foi possível copiar.";
            msg.style.color = "red";
        }
    } catch (err) {
        msg.textContent = "❌ Erro ao copiar.";
        msg.style.color = "red";
        console.error(err);
    }

    document.body.removeChild(textarea);
    setTimeout(() => { msg.textContent = ""; }, 3000);
}

// ===============================
// FINALIZAR PEDIDO
// ===============================
function finalizar() {
    if (!estaAberto()) return mostrarAviso("🚫 Estamos Fechados! Pedido bloqueado.");
    if (carrinho.length === 0) return mostrarAviso("Carrinho vazio!");

    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
    if (!pagamentoSelecionado) return mostrarAviso("Selecione a forma de pagamento!");

    const pagamento = pagamentoSelecionado.value;
    const troco = document.getElementById("trocoValor").value;

    let mensagem = "🛒 *PEDIDO - RJ AÇAÍ & HAMBURGUER* \n\n";

    carrinho.forEach((item) => {
        mensagem += `• ${item.nome}\nQtd: ${item.qtd}\nSubtotal: R$ ${(item.preco * item.qtd).toFixed(2)}\n\n`;
    });

    mensagem += `💰 Total: R$ ${total.toFixed(2)}\n💳 Pagamento: ${pagamento}\n`;
    if (pagamento === "Dinheiro" && troco) mensagem += `🪙 Troco para: R$ ${troco}\n`;

    const numero = "558694710453";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");

    setTimeout(() => {
        carrinho = [];
        total = 0;
        atualizarCarrinho();
        mostrarAviso("Pedido enviado com sucesso!");
    }, 500);
}


