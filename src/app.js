import express from 'express';
import http from 'http';
import cors from 'cors';
import db from "./config/db_config.js";
import setupWebSocket from './websockets/websocket.js';

//para teste
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App setup
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Conectado ao banco de dados.");
});

// Servir arquivos estáticos (se necessário, como CSS ou imagens no futuro)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para retornar o front.html
app.use(express.static(path.join(__dirname, 'public')));

app.use('/pages', express.static(path.join(__dirname, 'src', 'pages')));

// Rota para retornar o front.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'front.html'));
});

setupWebSocket(server);


export default server;

