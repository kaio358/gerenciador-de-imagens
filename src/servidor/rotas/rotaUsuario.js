const express = require("express")
const rota = express.Router()


rota.post("/cadastrar",(req,res)=>{
    const formulario = req.body
    console.log(formulario);
    
    
})

module.exports = rota