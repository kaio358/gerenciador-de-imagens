const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const blazeface = require('@tensorflow-models/blazeface');
const { ipcRenderer } = require('electron');

const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

const inputFile = document.getElementById('fileInput');
const caixaDeImagens = document.getElementById('caixa_imagens');
const loadingScreen = document.getElementById('loading');
const escolherPastaBtn = document.getElementById('escolherPasta');
const pastaSelecionadaSpan = document.getElementById('pastaSelecionada');

let mobilenetModel;
let blazefaceModel;
let caminhoPasta = null; 

const MAX_IMAGENS = 25;
const CATEGORIAS_HUMANAS = ["man", "woman", "person", "boy", "girl", "human", "people"];

function showLoading(message = "Carregando modelos...") {
    loadingScreen.style.display = "block";
    loadingScreen.innerText = message;
}

function hideLoading() {
    loadingScreen.style.display = "none";
}

async function carregarModelos() {
    showLoading("Carregando modelos de IA...");
    try {
        mobilenetModel = await mobilenet.load();
        blazefaceModel = await blazeface.load();
        console.log('Modelos carregados com sucesso!');
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        alert('Erro ao carregar modelos. Verifique o console para mais detalhes.');
    } finally {
        hideLoading();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await carregarModelos();
});

// Escolha da pasta pelo usuário
escolherPastaBtn.addEventListener('click', async () => {
    const pastaEscolhida = await ipcRenderer.invoke('escolher-pasta');
    if (pastaEscolhida) {
        caminhoPasta = pastaEscolhida;
        pastaSelecionadaSpan.innerText = `Pasta selecionada: ${pastaEscolhida}`;
    } else {
        pastaSelecionadaSpan.innerText = "Nenhuma pasta selecionada (Usando padrão).";
    }
});

// Função para enviar imagens e categorias para o backend
async function enviarParaBackend(resultados) {
    const formData = new FormData();
    formData.append('caminhoPasta', caminhoPasta || ''); 

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

// Processamento de múltiplas imagens
inputFile.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGENS);

    if (files.length === 0) return;

    showLoading("Processando imagens...");

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

    // Envia os resultados para o backend
    await enviarParaBackend(resultados);
});

// Criar ou obter uma categoria
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

// Processar imagem e classificar
async function processarImagem(imagePath) {
    return new Promise(resolve => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.classList.add('miniatura');

        img.onload = async () => {
            if (!blazefaceModel || !mobilenetModel) {
                console.log('Modelos ainda não carregados!');
                alert('Modelos ainda não carregados. Tente novamente.');
                return resolve(null);
            }

            try {
                const facePredictions = await blazefaceModel.estimateFaces(img, false);
                const mobilenetPredictions = await mobilenetModel.classify(img);

                let categoriaNome = mobilenetPredictions[0].className; // Melhor classificação

                // Se houver rostos na imagem, categorizar como "Pessoa"
                if (facePredictions.length > 0) {
                    categoriaNome = "Pessoa";
                } else {
                    // Se a classificação contiver palavras associadas a humanos, categorizamos como "Pessoa"
                    for (const pred of mobilenetPredictions) {
                        if (CATEGORIAS_HUMANAS.some(human => pred.className.toLowerCase().includes(human))) {
                            categoriaNome = "Pessoa";
                            break;
                        }
                    }
                }

                const categoria = obterCategoria(categoriaNome);
                categoria.appendChild(img);

                resolve({
                    faces: facePredictions.length,
                    classes: categoriaNome
                });

            } catch (error) {
                console.error('Erro ao processar a imagem:', error);
                alert('Erro ao processar uma das imagens.');
                resolve(null);
            }
        };
    });
}
