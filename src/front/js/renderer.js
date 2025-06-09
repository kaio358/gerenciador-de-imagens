// --- Configurações iniciais ---
const backendUrl = window.env?.BACKEND_URL; 

// Pegando elementos do HTML
const inputFile = document.getElementById('fileInput');
const caixaDeImagens = document.getElementById('caixa_imagens');
const loadingScreen = document.getElementById('loading');
const tooltip = document.getElementById('grafico-tooltip');

// Variáveis de controle
let mobilenetModel; // Modelo de IA
const imagemParaPredicoes = new Map(); // Mapeia imagem HTML -> predições MobileNet

// Limite de imagens
const MAX_IMAGENS = 25;

// Palavras que indicam que a imagem provavelmente contém uma pessoa
const CATEGORIAS_HUMANAS = ["man", "woman", "person", "boy", "girl", "human", "people"];

// --- Funções auxiliares ---

// Exibe a tela de carregamento com uma mensagem personalizada
function showLoading(message = "Carregando modelos...") {
    loadingScreen.style.display = "block";
    loadingScreen.innerText = message;
}

// Esconde a tela de carregamento
function hideLoading() {
    loadingScreen.style.display = "none";
}

// Carrega o modelo MobileNet para classificar imagens
async function carregarModelos() {
    showLoading("Carregando modelos de IA...");
    try {
        mobilenetModel = await mobilenet.load();
        console.log('Modelo MobileNet carregado com sucesso!');
    } catch (error) {
        console.error('Erro ao carregar MobileNet:', error);
        alert('Erro ao carregar o modelo. Verifique o console.');
    } finally {
        hideLoading();
    }
}

// Carrega o modelo automaticamente ao abrir a página
document.addEventListener('DOMContentLoaded', async () => {
    await carregarModelos();
});

// Envia as imagens e categorias detectadas para o back-end
async function enviarParaBackend(resultados) {
    const formData = new FormData();

    resultados.forEach((resultado, index) => {
        const file = inputFile.files[index];
        formData.append('images', file);
        formData.append('categories', JSON.stringify(resultado.classes));
    });

    try {
        const response = await fetch(`${backendUrl}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Imagens enviadas com sucesso:', data);
            alert('Imagens enviadas e organizadas com sucesso!');
        } else {
            console.error('Erro ao enviar imagens:', response.statusText);
            alert('Erro ao enviar imagens. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao enviar imagens:', error);
        alert('Erro ao enviar imagens. Verifique o console para mais detalhes.');
    }
}

// Evento ao selecionar imagens
inputFile.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGENS);
    if (files.length === 0) return;

    showLoading("Processando imagens...");

    // Processa cada imagem com MobileNet
    const promessas = files.map(file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const imagePath = event.target.result;
            const resultado = await processarImagem(imagePath);
            resolve(resultado);
        };
        reader.readAsDataURL(file);
    }));

    const resultados = await Promise.all(promessas);

    hideLoading();
    await enviarParaBackend(resultados);
});

// Cria uma seção no HTML para uma categoria se ainda não existir
function obterCategoria(nome) {
    let categoria = document.getElementById(`categoria_${nome}`);

    if (!categoria) {
        categoria = document.createElement('div');
        categoria.id = `categoria_${nome}`;
        categoria.classList.add('categoria');

        const titulo = document.createElement('h2');
        titulo.innerText = nome;
        categoria.appendChild(titulo);

        caixaDeImagens.appendChild(categoria);
    }

    return categoria;
}

// Processa uma imagem: classifica, organiza por categoria e ativa tooltip
async function processarImagem(imagePath) {
    return new Promise(resolve => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.classList.add('miniatura');

        img.onload = async () => {
            if (!mobilenetModel) {
                alert('Modelo ainda não carregado. Tente novamente.');
                return resolve(null);
            }

            try {
                // Classificação com IA (MobileNet)
                const mobilenetPredictions = await mobilenetModel.classify(img);

                // Se detectar pessoa, força categoria "Pessoa"
                let categoriaNome = mobilenetPredictions[0].className;
                for (const pred of mobilenetPredictions) {
                    if (CATEGORIAS_HUMANAS.some(h => pred.className.toLowerCase().includes(h))) {
                        categoriaNome = "Pessoa";
                        break;
                    }
                }

                // Organiza imagem na caixa correta
                const categoria = obterCategoria(categoriaNome);
                categoria.appendChild(img);

                // Associa imagem às predições para uso posterior
                imagemParaPredicoes.set(img, mobilenetPredictions);

                // Ativa a exibição do gráfico ao passar o mouse
                ativarTooltipEmMiniaturas();

                // Retorna dados para envio ao back-end
                resolve({
                    classes: categoriaNome,
                    predictions: mobilenetPredictions
                });

            } catch (error) {
                console.error('Erro ao processar a imagem:', error);
                alert('Erro ao processar uma das imagens.');
                resolve(null);
            }
        };
    });
}

// Move o tooltip junto com o mouse
document.addEventListener('mousemove', (e) => {
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
});

// Adiciona o gráfico de probabilidade ao passar o mouse nas imagens
function ativarTooltipEmMiniaturas() {
    const miniaturas = document.querySelectorAll('.miniatura');

    miniaturas.forEach(img => {
        // Evita adicionar o mesmo listener várias vezes
        if (!img.dataset.tooltipAtivado) {
            img.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';

                const predicoes = imagemParaPredicoes.get(img);

                if (predicoes) {
                    const labels = predicoes.map(p => p.className);
                    const valores = predicoes.map(p => p.probability);

                    desenharGrafico(labels, valores);
                }
            });

            img.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });

            img.dataset.tooltipAtivado = "true";
        }
    });
}

// Armazena a instância atual do gráfico (para destruir depois)
let graficoAtual = null;

// Cria um gráfico de barras com as predições da IA
function desenharGrafico(labels, dados) {
    const ctx = document.getElementById('graficoCanvas').getContext('2d');

    if (graficoAtual) {
        graficoAtual.destroy(); // Remove gráfico antigo
    }

    graficoAtual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Probabilidade',
                data: dados,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            },
            plugins: {
                legend: { display: false } // Remove legenda extra
            }
        }
    });
}
