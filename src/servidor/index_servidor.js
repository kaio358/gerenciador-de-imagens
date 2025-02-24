const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const http = require("http")
const dotenv = require('dotenv');
// implementações do servidor
const app = express()
const server = http.createServer(app)


// configurações
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())
dotenv.config();

const PORTA = process.env.PORTA|| 3000

// importando rotas 
const rotaTratamentoImagem = require("./rotas/rotaTratamentoImagem")

//usando rotas
app.use("/",rotaTratamentoImagem)

server.listen(PORTA,()=>{
    console.log("Servidor aberto na porta "+ PORTA);
    
})

