const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const blazeface = require('@tensorflow-models/blazeface');

const inputFile = document.getElementById('fileInput');
const caixaDeImagens = document.getElementById('caixa_imagens');
const loadingScreen = document.getElementById('loading');

let mobilenetModel;
let blazefaceModel;
const MAX_IMAGENS = 25;

function showLoading(message = "Carregando modelos...") {
    loadingScreen.style.display = "block";
    loadingScreen.innerText = message;
}

function hideLoading() {
    loadingScreen.style.display = "none";
}

// Carregar modelos
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

// Processar múltiplas imagens
inputFile.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGENS);
    
    if (files.length === 0) return;

    caixaDeImagens.innerHTML = ''; // Limpar imagens anteriores
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

    // Mostrar um resumo dos resultados no alert
    const resumo = resultados
        .filter(res => res !== null)
        .map((res, index) => 
            `Imagem ${index + 1}:\nRostos detectados: ${res.faces}\nClassificação:\n${res.classes}`
        ).join("\n\n");

    alert(`Resultados:\n\n${resumo}`);
});

// Processar cada imagem individualmente
async function processarImagem(imagePath) {
    return new Promise(resolve => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.classList.add('miniatura');
    

        caixaDeImagens.appendChild(img);

        img.onload = async () => {
            if (!blazefaceModel || !mobilenetModel) {
                console.log('Modelos ainda não carregados!');
                alert('Modelos ainda não carregados. Tente novamente.');
                hideLoading();
                return resolve(null);
            }

            try {
                const facePredictions = await blazefaceModel.estimateFaces(img, false);
                const mobilenetPredictions = await mobilenetModel.classify(img);

                const classificacoes = mobilenetPredictions
                    .map(p => `${p.className} (${(p.probability * 100).toFixed(2)}%)`)
                    .join('\n');

                resolve({ 
                    faces: facePredictions.length, 
                    classes: classificacoes 
                });

            } catch (error) {
                console.error('Erro ao processar a imagem:', error);
                alert('Erro ao processar uma das imagens.');
                resolve(null);
            }
        };
    });
}
