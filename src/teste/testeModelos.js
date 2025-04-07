// const faceapi = require("face-api.js");

async function loadModels() {
    console.log("Carregando modelos...");

    await faceapi.nets.ssdMobilenetv1.loadFromUri("./models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("./models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("./models");

    console.log("Modelos carregados com sucesso!");
}

async function detectFaces(imageElement) {
    const detections = await faceapi.detectAllFaces(imageElement)
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length > 0) {
        alert("Rosto encontrado! ✅");
    } else {
        alert("Nenhum rosto encontrado! ❌");
    }
}

document.getElementById("imageInput").addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = document.getElementById("displayImage");
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
        await detectFaces(img);
    };
});

loadModels();


