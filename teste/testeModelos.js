const faceapi = require('face-api.js');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage, ImageData } = require('canvas');

// Mock do ambiente para o face-api funcionar no Node.js
faceapi.env.monkeyPatch({ fetch, Canvas: createCanvas, Image: loadImage, ImageData });

// Função para carregar modelos a partir de arquivos locais
const loadModels = async () => {
    const MODEL_URL = path.join(__dirname, 'models');

    // Carregando os modelos necessários
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromDisk(MODEL_URL),
    ]);

    console.log('Modelos carregados com sucesso!');
};


// Função assíncrona para reconhecimento facial
const run = async () => {
    await loadModels();
   
    // Carregando a imagem de referência de Michael Jordan
    const refFace = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg');
    
    // Carregando a imagem que será verificada
    const facesToCheck = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/JordanSmithWorthy2.jpg/170px-JordanSmithWorthy2.jpg');
    
    
    // Detectando rostos nas imagens
    const refFaceAiData = await faceapi.detectAllFaces(refFace).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();
    const facesToCheckAiData = await faceapi.detectAllFaces(facesToCheck).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();

    console.log(refFaceAiData);
    console.log(facesToCheckAiData);
    
    

    // Criando um FaceMatcher com os dados da imagem de referência
    const faceMatcher = new faceapi.FaceMatcher(face => {
        const { age, gender, genderProbability } = face;

        const genderText = `${gender} - ${Math.round(genderProbability * 100)}%`;
        const ageText = `${Math.round(age)} anos`; 

        console.log(ageText+" "+genderText);
        
        
    });

    // Comparando os rostos detectados na imagem a ser verificada
    facesToCheckAiData.forEach((face, i) => {
        const { descriptor } = face;
        const label = faceMatcher.findBestMatch(descriptor).toString();
      
        
        console.log(`Rosto ${i + 1}: ${label}`); // Imprimindo o resultado no console
    });

};

// Executando a função
run().catch(err => console.error(err));