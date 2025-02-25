const express = require("express")
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rota = express.Router()
const upload = multer({ storage: multer.memoryStorage() })




function criarDiretorio() {

    const uploadsDir = path.join(__dirname,'..','..','uploads');
    if (!fs.existsSync(uploadsDir)){
        fs.mkdirSync(uploadsDir);
    }
}


rota.post('/upload', upload.array('images'), (req, res) => {
    const files = req.files; 
    const categories = req.body.categories; 

    if (!files || files.length === 0) {
        return res.status(400).send('Nenhuma imagem enviada.');
    }
    criarDiretorio()

    // Processa cada imagem
    files.forEach((file, index) => {
        let categoria = categories[index].replace(/["']/g, ""); // Remove aspas desnecessárias
        const dir = path.join(__dirname,'..','..' ,'uploads', categoria);
        
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