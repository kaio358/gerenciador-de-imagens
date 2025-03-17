const express = require("express")
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rota = express.Router()
const upload = multer({ storage: multer.memoryStorage() })




function criarDiretorio(uploadsDir) {

    
    if (!fs.existsSync(uploadsDir)){
        fs.mkdirSync(uploadsDir,'uploads');
    }
}


rota.post('/upload', upload.array('images'), (req, res) => {
    const files = req.files; 
    const categories = req.body.categories; 

    const caminhoPasta = req.body.caminhoPasta || path.join(__dirname,'..','..','uploads');
   

    if (!files || files.length === 0) {
        return res.status(400).send('Nenhuma imagem enviada.');
    }
    criarDiretorio(caminhoPasta)

    // Processa cada imagem
    files.forEach((file, index) => {
        let categoria = categories[index].replace(/["']/g, ""); 
        const dir = path.join(caminhoPasta,'uploads/'+categoria);
        
        // Cria a pasta da categoria se não existir
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Salva a imagem na pasta da categoria
        const filePath = path.join(dir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
    });


    res.status(200).send({ message: 'Imagens organizadas com sucesso!' });
});

module.exports = rota