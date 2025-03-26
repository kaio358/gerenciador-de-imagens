const { ipcRenderer } = require('electron');


const escolherPastaBtn = document.getElementById('escolherPasta');

const pastaSelecionadaSpan = document.getElementById('pastaSelecionada');

require('dotenv').config();
const backendUrl = process.env.BACKEND_URL ;

let caminhoPasta = null; 


document.addEventListener("DOMContentLoaded",async ()=>{
    fetch(backendUrl+"/destino")
        .then(rest => rest.json())
        .then(dados=>  pastaSelecionadaSpan.innerText  = (dados[0].caminho_padrao))
        .catch(erro=> console.log(erro))

})


// Escolha da pasta pelo usuário
escolherPastaBtn.addEventListener('click', async () => {
    const pastaEscolhida = await ipcRenderer.invoke('escolher-pasta');
    if (pastaEscolhida) {

        caminhoPasta = pastaEscolhida;
        pastaSelecionadaSpan.innerText = `Pasta selecionada: ${pastaEscolhida}`;

        fetch(backendUrl+"/atualizar",{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                destino: pastaEscolhida.replace(/\\/g, "/") // tomar cuidado com injeção aqui (vou atualizar mais tarde)
            })
        })
    } else {
        pastaSelecionadaSpan.innerText = "Nenhuma pasta selecionada (Usando padrão).";
    }
});