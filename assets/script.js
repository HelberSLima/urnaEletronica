// Elementos do DOM
const seuVoto = document.querySelector('.d-1-1 span');
const cargo = document.querySelector('.d-1-2 span');
const descricao = document.querySelector('.d-1-4');
const aviso = document.querySelector('.d-2');
const lateral = document.querySelector('.d-1-right');
const numeros = document.querySelector('.d-1-3');
const lateralImage = document.querySelector('.d-1-image');

// Variáveis de estado
let etapaAtual = 0;
let numero = '';
let votoBranco = false;
let votos = [];
let confirmando = false;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    comecarEtapa();
    setupKeyboard();
});

function comecarEtapa() {
    const etapa = etapas[etapaAtual];

    numero = '';
    votoBranco = false;
    confirmando = false;

    seuVoto.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';

    atualizaInterface();
}

function atualizaInterface() {
    const etapa = etapas[etapaAtual];

    // Renderiza os quadrados de números
    let numeroHtml = '';
    if (votoBranco) {
        for (let i = 0; i < etapa.numeros; i++) {
            numeroHtml += '<div class="numero"></div>';
        }
    } else {
        for (let i = 0; i < etapa.numeros; i++) {
            if (i < numero.length) {
                numeroHtml += `<div class="numero">${numero[i]}</div>`;
            } else {
                if (i === numero.length) {
                    numeroHtml += '<div class="numero pisca"></div>';
                } else {
                    numeroHtml += '<div class="numero"></div>';
                }
            }
        }
    }
    numeros.innerHTML = numeroHtml;

    // Verifica voto branco
    if (votoBranco) {
        seuVoto.style.display = 'block';
        cargo.innerHTML = etapa.titulo;
        descricao.innerHTML = 'VOTO EM BRANCO';
        aviso.style.display = 'block';
        lateral.innerHTML = '';
        return;
    }

    // Verifica se o número está incompleto
    if (numero.length < etapa.numeros) {
        seuVoto.style.display = 'none';
        descricao.innerHTML = '';
        lateral.innerHTML = '';
        return;
    }

    // Busca candidato
    const candidato = etapa.candidatos.find(item => item.numero === numero);

    if (candidato) {
        // Candidato encontrado
        seuVoto.style.display = 'block';
        aviso.style.display = 'block';

        const viceInfo = candidato.vice
            ? `<br/>Vice-Prefeito: ${candidato.vice}`
            : '';

        descricao.innerHTML = `Nome: <strong>${candidato.nome}</strong><br/>Partido: ${candidato.partido}${viceInfo}`;

        // Fotos
        let fotosHtml = '';
        for (const foto of candidato.fotos) {
            fotosHtml += foto.small
                ? `<div class="d-1-image small"><img src="./assets/images/${foto.url}" alt="">${foto.legenda}</div>`
                : `<div class="d-1-image"><img src="./assets/images/${foto.url}" alt="">${foto.legenda}</div>`;
        }
        lateral.innerHTML = fotosHtml;

    } else {
        // Candidato não encontrado - voto nulo
        seuVoto.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<span style="color: red;">VOTO NULO</span>';
        lateral.innerHTML = '';
    }
}

function clicou(n) {
    if (confirmando) return;

    const etapa = etapas[etapaAtual];
    if (numero.length >= etapa.numeros) return;

    numero += n;
    atualizaInterface();
}

function branco() {
    if (confirmando) return;
    if (numero.length > 0) return;

    votoBranco = true;
    atualizaInterface();
}

function corrige() {
    if (confirmando) return;
    comecarEtapa();
}

// Objeto de áudio para o som de confirmação
const somConfirma = new Audio('./assets/sound/confirma-urna.mp3');

function confirma() {
    const etapa = etapas[etapaAtual];

    // Valida se foi digitado o número completo ou voto em branco/nulo
    if (!votoBranco && numero.length < etapa.numeros) {
        return;
    }

    confirmando = true;

    // Toca o som de confirmação
    somConfirma.currentTime = 0;
    somConfirma.play().catch(e => console.log('Áudio aguardando interação do usuário', e));

    // Animação de confirmação
    numeros.style.opacity = '0';

    setTimeout(() => {
        let voto = {};

        if (votoBranco) {
            voto = { etapa: etapa.titulo, tipo: 'branco', numero: '' };
        } else if (numero.length === etapa.numeros) {
            const candidato = etapa.candidatos.find(item => item.numero === numero);
            if (candidato) {
                voto = {
                    etapa: etapa.titulo,
                    tipo: 'candidato',
                    numero: numero,
                    nome: candidato.nome,
                    partido: candidato.partido
                };
            } else {
                voto = { etapa: etapa.titulo, tipo: 'nulo', numero: numero };
            }
        }

        votos.push(voto);

        etapaAtual++;

        if (etapaAtual < etapas.length) {
            numeros.style.opacity = '1';
            comecarEtapa();
        } else {
            numeros.style.opacity = '1';
            mostrarApuracao();
        }

        confirmando = false;
    }, 500);
}

function mostrarApuracao() {
    const contagem = {};
    let votosBrancos = 0;
    let votosNulos = 0;

    for (const v of votos) {
        if (v.tipo === 'branco') {
            votosBrancos++;
        } else if (v.tipo === 'nulo') {
            votosNulos++;
        } else if (v.tipo === 'candidato') {
            const chave = `${v.numero}-${v.nome}`;
            contagem[chave] = (contagem[chave] || 0) + 1;
        }
    }

    let html = `
        <div class="apuracao">
            <h2>🗳️ RESULTADO DA ELEIÇÃO</h2>
            <div class="apuracao-totais">
                <div class="total-item">
                    <span class="total-numero">${votosBrancos}</span>
                    <span class="total-label">Brancos</span>
                </div>
                <div class="total-item">
                    <span class="total-numero">${votosNulos}</span>
                    <span class="total-label">Nulos</span>
                </div>
                <div class="total-item">
                    <span class="total-numero">${votos.length - votosBrancos - votosNulos}</span>
                    <span class="total-label">Válidos</span>
                </div>
            </div>
            <div class="apuracao-detalhes">
                <h3>Votos por Candidato:</h3>
    `;

    for (const etapaV of etapas) {
        html += `<h4>${etapaV.titulo}</h4>`;

        for (const cand of etapaV.candidatos) {
            const chave = `${cand.numero}-${cand.nome}`;
            const qtd = contagem[chave] || 0;
            if (qtd > 0) {
                html += `<div class="candidato-resultado">
                    <span>${cand.numero} - ${cand.nome} (${cand.partido})</span>
                    <strong>${qtd} voto${qtd > 1 ? 's' : ''}</strong>
                </div>`;
            }
        }
    }

    html += `
            </div>
            <button class="botao-reiniciar" onclick="reiniciarEleicao()">🔄 Nova Eleição</button>
        </div>
    `;

    document.querySelector('.tela').innerHTML = html;
}

function reiniciarEleicao() {
    location.reload();
}

// Suporte a teclado físico
function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (confirmando) return;

        const key = e.key;

        if (/^[0-9]$/.test(key)) {
            clicou(key);
        } else if (key === 'Enter') {
            confirma();
        } else if (key === 'Backspace') {
            if (numero.length > 0) {
                numero = numero.slice(0, -1);
                atualizaInterface();
            }
        } else if (key === 'Escape') {
            corrige();
        } else if (key.toLowerCase() === 'b') {
            branco();
        }
    });
}

window.clicou = clicou;
window.branco = branco;
window.corrige = corrige;
window.confirma = confirma;
window.reiniciarEleicao = reiniciarEleicao;