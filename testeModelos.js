const path = require('path');
const faceapi = require('face-api.js');
const fetch = require('node-fetch'); // Adicionando a dependência do node-fetch

// Configura o fetch para o ambiente Node.js
global.fetch = fetch;

async function testarCarregamento() {
    const modelsPath = path.join(__dirname, 'models');

    try {
        // Usando loadFromUri com fetch agora funcionando corretamente no Node.js
        await faceapi.nets.ssdMobilenetv1.loadFromUri(modelsPath);
        await faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath);
        await faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath);

        console.log("Modelos carregados com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar modelos:", error);
    }
}

testarCarregamento();
