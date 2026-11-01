// Banco de dados centralizado de candidatos e etapas
const bancoDadosUrna = {
    etapas: [
        {
            titulo: 'VEREADOR',
            numeros: 5,
            candidatos: [
                {
                    numero: '38111',
                    nome: 'Fulano de Tal',
                    partido: 'ABC',
                    fotos: [{ url: '2.jpg', legenda: 'Vereador', small: false }]
                },
                {
                    numero: '77222',
                    nome: 'Beltrano da Silva',
                    partido: 'DEFG',
                    fotos: [{ url: '1.jpg', legenda: 'Vereador', small: false }]
                },
                {
                    numero: '11111',
                    nome: 'Candidato Inovador',
                    partido: 'TECH',
                    fotos: [{ url: '1.jpg', legenda: 'Vereador', small: false }]
                },
                {
                    numero: '22333',
                    nome: 'Maria da Saúde',
                    partido: 'UNIÃO',
                    fotos: [{ url: '2.jpg', legenda: 'Vereador', small: false }]
                }
            ]
        },
        {
            titulo: 'PREFEITO',
            numeros: 2,
            candidatos: [
                {
                    numero: '99',
                    nome: 'Ciclano de Souza',
                    partido: 'ABC',
                    vice: 'Cicrano Jr',
                    fotos: [
                        { url: '3.jpg', legenda: 'Prefeito', small: false },
                        { url: '4.jpg', legenda: 'Vice-Prefeito', small: true }
                    ]
                },
                {
                    numero: '84',
                    nome: 'Zulano Pereira',
                    partido: 'QWERTY',
                    vice: 'Zulana Silva',
                    fotos: [
                        { url: '5.jpg', legenda: 'Prefeito', small: false },
                        { url: '6.png', legenda: 'Vice-Prefeito', small: true }
                    ]
                },
                {
                    numero: '50',
                    nome: 'Doutor Futuro',
                    partido: 'INOVA',
                    vice: 'Professora Ana',
                    fotos: [
                        { url: '1.jpg', legenda: 'Prefeito', small: false },
                        { url: '2.jpg', legenda: 'Vice-Prefeito', small: true }
                    ]
                }
            ]
        }
    ]
};

// Carregar candidatos salvos no localStorage (se houver cadastros feitos)
function carregarBancoComLocalStorage() {
    const salvos = localStorage.getItem('urna_candidatos_custom');
    if (salvos) {
        try {
            const customEtapas = JSON.parse(salvos);
            bancoDadosUrna.etapas.forEach((etapa, idx) => {
                if (customEtapas[idx] && customEtapas[idx].candidatos) {
                    customEtapas[idx].candidatos.forEach(novoCandidato => {
                        const existe = etapa.candidatos.some(c => c.numero === novoCandidato.numero);
                        if (!existe) {
                            etapa.candidatos.push(novoCandidato);
                        }
                    });
                }
            });
        } catch (e) {
            console.error('Erro ao carregar candidatos personalizados', e);
        }
    }
}

// Função utilitária para cadastrar novos candidatos direto no console ou via script
window.cadastrarCandidato = function(tituloEtapa, numero, nome, partido, vice = '', fotos = [{url: '1.jpg', legenda: tituloEtapa, small: false}]) {
    let etapasData = JSON.parse(localStorage.getItem('urna_candidatos_custom')) || JSON.parse(JSON.stringify(bancoDadosUrna.etapas));
    let etapa = etapasData.find(e => e.titulo.toUpperCase() === tituloEtapa.toUpperCase());
    if (etapa) {
        etapa.candidatos = etapa.candidatos.filter(c => c.numero !== numero);
        etapa.candidatos.push({ numero, nome, partido, vice, fotos });
        localStorage.setItem('urna_candidatos_custom', JSON.stringify(etapasData));
        alert(`Candidato ${nome} (${numero}) cadastrado com sucesso! Recarregue a página.`);
    } else {
        alert('Etapa não encontrada. Use "VEREADOR" ou "PREFEITO".');
    }
};

carregarBancoComLocalStorage();
const etapas = bancoDadosUrna.etapas;
