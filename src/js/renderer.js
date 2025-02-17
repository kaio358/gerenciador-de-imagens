

const inputFile = document.getElementById('fileInput'); // Input de arquivo
const caixaDeImagens = document.getElementById('caixa_imagens'); // Contêiner para exibir a imagem

let mobilenetModel; // Variável para armazenar o modelo MobileNet
let blazefaceModel; // Variável para armazenar o modelo BlazeFace

// Função para carregar os modelos
async function carregarModelos() {
    console.log('Carregando modelos...');
    try {
        mobilenetModel = await mobilenet.load();
        blazefaceModel = await blazeface.load();
        console.log('Modelos carregados com sucesso!');
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        alert('Erro ao carregar modelos. Verifique o console para mais detalhes.');
    }
}

// Carregar os modelos quando a página for carregada
document.addEventListener('DOMContentLoaded', async () => {
    await carregarModelos();
});

// Evento para quando o usuário selecionar uma imagem
inputFile.addEventListener('change', (e) => {
    const file = e.target.files[0]; // Arquivo selecionado
    if (file) {
        const reader = new FileReader(); // Leitor de arquivos
        reader.onload = function(event) {
            const imagePath = event.target.result; // Caminho da imagem
            processarImagem(imagePath); // Chamar função para processar a imagem
        };
        reader.readAsDataURL(file); // Ler o arquivo como URL de dados
    }
});

// Função para processar a imagem
async function processarImagem(imagePath) {
    const img = document.createElement('img'); // Criar elemento de imagem
    img.src = imagePath; // Definir o caminho da imagem
    caixaDeImagens.innerHTML = ''; // Limpar o contêiner de imagens
    caixaDeImagens.appendChild(img); // Adicionar a imagem ao contêiner

    // Quando a imagem for carregada, processá-la
    img.onload = async () => {
        if (!blazefaceModel || !mobilenetModel) {
            console.log('Modelos ainda não carregados!');
            alert('Modelos ainda não carregados. Tente novamente.');
            return;
        }

        try {
            // Detectar rostos na imagem
            const facePredictions = await blazefaceModel.estimateFaces(img, false);
            console.log(`Rostos detectados: ${facePredictions.length}`);

            // Classificar a imagem usando MobileNet
            const mobilenetPredictions = await mobilenetModel.classify(img);
            console.log('Classificação da imagem:', mobilenetPredictions);

            // Exibir os resultados
            alert(`Rostos detectados: ${facePredictions.length}\n\nClassificação: ${mobilenetPredictions.map(p => `${p.className} (${(p.probability * 100).toFixed(2)}%)`).join('\n')}`);
        } catch (error) {
            console.error('Erro ao processar a imagem:', error);
            alert('Ocorreu um erro ao processar a imagem. Verifique o console para mais detalhes.');
        }
    };
}