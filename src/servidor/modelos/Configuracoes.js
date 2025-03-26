const conexao = require("../infraestrutura/conexao")

class Configuracoes{

    // pegar valores
    caminhosPadroes(){
        const sql = `select caminho_padrao from configuracoes;`
        return this.executarQuery(sql)
      
    }
    caminhoUnicoPadrao(){
        const sql = `select caminho_padrao from configuracoes LIMIT 1;`
        return new Promise((resolve,reject)=>{
            conexao.query(sql, (erro, resultado) => {
                if (erro) {
                    reject({ erro: "Erro ao buscar caminho" });
                } else {
                    if (resultado.length > 0) {
                     
                        resultado[0].caminho_padrao = resultado[0].caminho_padrao.replace(/\//g, "\\");
                    }
                    resolve(resultado);
                }
            });
        })
    }

    criarCaminho(destino) {
        return new Promise((resolve, reject) => {
            const selectSQL = `SELECT caminho_padrao FROM configuracoes WHERE idConfiguracoes = 1`;
    
            conexao.query(selectSQL, (erro, resultado) => {
                if (erro) return reject(erro);
    
                if (resultado.length > 0) {
                    resolve({ message: "Caminho já definido pelo usuário, nenhuma alteração feita.", caminho: resultado[0].caminho_padrao });
                } else {
                    const insertSQL = `INSERT INTO configuracoes (idConfiguracoes, caminho_padrao) VALUES (1, ?)`;
                    conexao.query(insertSQL, [destino], (erroInsert, resultadoInsert) => {
                        if (erroInsert) return reject(erroInsert);
                        resolve({ message: "Caminho padrão inserido com sucesso.", caminho: destino });
                    });
                }
            });
        });
    }
    

    atualizaCaminhoUnico(destino){
        const sql = `UPDATE configuracoes SET caminho_padrao = '${destino}' where idConfiguracoes = 1 `

        return this.executarQuery(sql)

    }

    executarQuery(sql){
        return new Promise((resolve,reject)=>{
            conexao.query(sql,(erro,resultado)=>{
                if(erro) return reject(erro)
                resolve(resultado)
            })
        })
    }
}

module.exports = new Configuracoes;