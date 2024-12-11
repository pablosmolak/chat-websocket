import express from 'express';
import http from 'http';
import cors from 'cors';
import db from "./config/db_config.js";
import setupWebSocket from './websockets/websocket.js';

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

setupWebSocket(server);


export default server;

