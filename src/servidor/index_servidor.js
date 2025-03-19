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

// conexao 
const conexao = require("./infraestrutura/conexao")
const Tabelas = require("./infraestrutura/Tabelas")

// importando rotas 
const rotaTratamentoImagem = require("./rotas/rotaTratamentoImagem")
const rotaUsuario = require("./rotas/rotaUsuario")


//usando rotas
app.use("/",rotaTratamentoImagem)
app.use("/",rotaUsuario)


conexao.connect((erro)=>{
    if(erro){
        console.log("Erro na conexão com banco de dados "+erro);
        
    }else{
        Tabelas.init(conexao)
        server.listen(PORTA,()=>{
            console.log("Servidor aberto na porta "+ PORTA);
            
        })
    }
})

