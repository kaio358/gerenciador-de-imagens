// require('dotenv').config();
// const backendUrl = process.env.BACKEND_URL
// console.log(backendUrl);

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const backend_url = config.backend_url

const formulario_cadastro = document.getElementById("formulario_cadastro")
formulario_cadastro.action = backend_url+"/cadastrar"