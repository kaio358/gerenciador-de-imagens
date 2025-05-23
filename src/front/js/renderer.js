// Carrega a URL do backend a partir do preload.js
const backendUrl = window.env?.BACKEND_URL ;


// Elementos do index.html
const inputFile = document.getElementById('fileInput');
const caixaDeImagens = document.getElementById('caixa_imagens');
const loadingScreen = document.getElementById('loading');

let mobilenetModel;
let blazefaceModel;

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

        await faceapi.nets.ssdMobilenetv1.loadFromUri(`${backendUrl}/models`);
        await faceapi.nets.faceLandmark68Net.loadFromUri(`${backendUrl}/models`);
        await faceapi.nets.faceRecognitionNet.loadFromUri(`${backendUrl}/models`);

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

    await enviarParaBackend(resultados);
});

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

async function processarImagem(imagePath) {
    return new Promise(resolve => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.classList.add('miniatura');

        img.onload = async () => {
            if (!mobilenetModel) {
                console.log('Modelos ainda não carregados!');
                alert('Modelos ainda não carregados. Tente novamente.');
                return resolve(null);
            }

            try {
                const facePredictions = await faceapi.detectAllFaces(img);
                console.log("oi ?",facePredictions);   
                const mobilenetPredictions = await mobilenetModel.classify(img);
           
                let categoriaNome = mobilenetPredictions[0].className;

                // if (facePredictions.length > 0) {
                //     categoriaNome = "Pessoa";
                // } else {
                //     for (const pred of mobilenetPredictions) {
                //         if (CATEGORIAS_HUMANAS.some(human => pred.className.toLowerCase().includes(human))) {
                //             categoriaNome = "Pessoa";
                //             break;
                //         }
                //     }
                // }

                // const categoria = obterCategoria(categoriaNome);
                // categoria.appendChild(img);

                // resolve({
                //     faces: facePredictions.length,
                //     classes: categoriaNome
                // });

            } catch (error) {
                console.error('Erro ao processar a imagem:', error);
                alert('Erro ao processar uma das imagens.');
                resolve(null);
            }
        };
    });
}
