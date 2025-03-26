

class Tabelas{
    init(conexao){
        this.conexao = conexao;

        this.criarConfiguracoes()
        this.criarAlbuns()
        this.criarImagens()
    }
 
    criarConfiguracoes(){
        const sql = `CREATE TABLE IF NOT EXISTS configuracoes (
                        idConfiguracoes INT AUTO_INCREMENT PRIMARY KEY,
                        caminho_padrao VARCHAR(255) NOT NULL,
                        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )`

        this.conexao.query(sql,erro=>{
            if(erro){
                console.log(erro);
                
            }else{
                console.log("Tabela configuracoes criada com sucesso");
                
            }
        })
    }
    criarAlbuns(){
        const sql = `CREATE TABLE IF NOT EXISTS albuns (
                        idAlbum INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(100) NOT NULL,
                        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );`

        this.conexao.query(sql,erro=>{
            if(erro){
                console.log(erro);
                
            }else{
                console.log("Tabela albuns criada com sucesso");
                
            }
        })
    }
    criarImagens(){
        const sql = `CREATE TABLE IF NOT EXISTS imagens (
                        idImagens INT AUTO_INCREMENT PRIMARY KEY,
                        album_id INT NULL,
                        nome_arquivo VARCHAR(255) NOT NULL,
                        categoria VARCHAR(100) NOT NULL,
                        dispositivo_origem VARCHAR(255),
                        data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        data_captura DATETIME,
                        FOREIGN KEY (album_id) REFERENCES albuns(idAlbum) ON DELETE SET NULL
                    )`
        this.conexao.query(sql,erro=>{
            if(erro){
                console.log(erro);
                
            }else{
                console.log("Tabela Imagens criada com sucesso");
                
            }
        })
    }
}

module.exports = new Tabelas;