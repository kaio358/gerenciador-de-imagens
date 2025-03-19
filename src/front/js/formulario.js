require('dotenv').config();

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
console.log(config.backend_url);

const backendUrl = process.env.BACKEND_URL
console.log(backendUrl);
