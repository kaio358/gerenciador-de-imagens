const { ipcRenderer } = require('electron');


const escolherPastaBtn = document.getElementById('escolherPasta');

const pastaSelecionadaSpan = document.getElementById('pastaSelecionada');
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

let caminhoPasta = null; 


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