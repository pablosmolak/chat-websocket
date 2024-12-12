import express from 'express';
import http from 'http';
import cors from 'cors';
import db from "./config/db_config.js";
import setupWebSocket from './websockets/websocket.js';

// Para teste
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

// Rota para retornar o front.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'front.html'));
});

app.get('/audios/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'pages', 'audios', filename)
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Arquivo de áudio não encontrado');
        }
    });
});

setupWebSocket(server);

export default server;