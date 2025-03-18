

class Tabelas{
    init(conexao){
        this.conexao = conexao;
        this.criarUsuarios()
        this.criarConfiguracoes()
        this.criarAlbuns()
        this.criarImagens()
    }
    criarUsuarios(){
        const sql = `CREATE TABLE IF NOT EXISTS usuarios (
                        idUsuario INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(100) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        senha_hash VARCHAR(255) NOT NULL,
                        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )`
        this.conexao.query(sql,erro =>{
            if(erro){
                console.log(erro);
                
            }else{
                console.log("Tabela Usuarios criada com sucesso");
                
            }
        })
    }
    criarConfiguracoes(){
        const sql = `CREATE TABLE IF NOT EXISTS configuracoes (
                        idConfiguracoes INT AUTO_INCREMENT PRIMARY KEY,
                        usuario_id INT NOT NULL,
                        caminho_padrao VARCHAR(255) NOT NULL,
                        permitir_escolha_local BOOLEAN DEFAULT TRUE,
                        formato_padrao VARCHAR(10) DEFAULT 'jpg',
                        qualidade INT DEFAULT 90,
                        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
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
                        usuario_id INT NOT NULL,
                        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
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
                        usuario_id INT NOT NULL,
                        album_id INT NULL,
                        nome_arquivo VARCHAR(255) NOT NULL,
                        categoria VARCHAR(100) NOT NULL,
                        dispositivo_origem VARCHAR(255),
                        data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        data_captura DATETIME,
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
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