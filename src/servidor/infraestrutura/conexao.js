const mysql = require("mysql")

const conexao = mysql.createConnection({
    host: "localhost",
    port:3306,
    user:"root",
    password:"",
    database:"classificador_imagens"
})


module.exports = conexao