const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const http = require("http")
const dotenv = require('dotenv');
const path = require("path")

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

const destino = path.join(__dirname,'..')

// conexao 
const conexao = require("./infraestrutura/conexao")
const Tabelas = require("./infraestrutura/Tabelas")


// importando rotas 
const rotaTratamentoImagem = require("./rotas/rotaTratamentoImagem")
const rotaConfig = require("./rotas/rotaConfig")


//usando rotas
app.use("/",rotaTratamentoImagem)
app.use("/",rotaConfig)

// usando modelos padrões 

const configuracoesModelo = require("./modelos/Configuracoes")


conexao.connect( (erro)=>{
    if(erro){
        console.log("Erro na conexão com banco de dados "+erro);
        
    }else{
     
        server.listen(PORTA, async()=>{
            console.log("Servidor aberto na porta "+ PORTA);
            Tabelas.init(conexao)

            try {

                await configuracoesModelo.criarCaminho(destino)
                // console.log(resultado);
                
              

            } catch (error) {
                console.log("Deu um pequeno errinho : "+ error);
                
            }
        })
    }
})

