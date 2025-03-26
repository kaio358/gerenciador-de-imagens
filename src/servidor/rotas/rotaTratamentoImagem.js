const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const rota = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const config = require("../modelos/Configuracoes");

// Função para criar diretórios de forma segura
function criarDiretorio(diretorio) {
    if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio, { recursive: true });
    }
}

rota.post("/upload", upload.array("images"), async (req, res) => {
    try {
        const files = req.files;
        const categories = req.body.categories;

        // Obtém o caminho salvo no banco
        const resultado = await config.caminhoUnicoPadrao();
        
        // Extração correta do caminho (pega o primeiro item da resposta)
        const caminhoDoBanco = resultado[0]?.caminho_padrao; 

        if (!caminhoDoBanco || typeof caminhoDoBanco !== "string") {
            return res.status(500).send({ message: "Caminho do banco inválido." });
        }

        // Define a pasta principal de uploads
        const caminhoPasta = path.join(caminhoDoBanco, "uploads");
        criarDiretorio(caminhoPasta);

        if (!files || files.length === 0) {
            return res.status(400).send("Nenhuma imagem enviada.");
        }

     
        files.forEach((file, index) => {
            let categoria = categories[index].replace(/["']/g, "");

            // Caminho da categoria dentro de "uploads"
            const dir = path.join(caminhoPasta, categoria);
            criarDiretorio(dir); 

            // Caminho do arquivo final
            const filePath = path.join(dir, file.originalname);
            fs.writeFileSync(filePath, file.buffer);
        });

        res.status(200).send({ message: "Imagens organizadas com sucesso!" });
    } catch (error) {
        console.error("Erro no upload:", error);
        res.status(500).send({ message: "Erro interno no servidor." });
    }
});


module.exports = rota;
