const express = require("express")
const rota = express.Router()

const config = require("../modelos/Configuracoes")

rota.get("/destino",async (req,res)=>{
    const resultado = await config.caminhoUnicoPadrao()
    res.json(resultado)
})

rota.put("/atualizar", async (req,res)=>{
    const destino = req.body.destino
    const resultado = await config.atualizaCaminhoUnico(destino)
    res.json(resultado);
    
})
module.exports = rota