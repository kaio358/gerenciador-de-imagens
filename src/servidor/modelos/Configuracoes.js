const conexao = require("../infraestrutura/conexao")

class Configuracoes{

    // pegar valores
    caminhoPadrao(idUsuario){
        const sql = `select caminho_padrao from configuracoes where usuario_id = ${idUsuario};`

        return new Promise((resolve,reject)=>{
            conexao.query(sql,(erro,resultado)=>{
                if(erro){
                    reject(erro)
                }else{
                    resolve(resultado)
                }
            })
        })
      
    }
}

module.exports = new Configuracoes;