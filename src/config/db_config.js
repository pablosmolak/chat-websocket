import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const bancoUrl = process.env.DB_URL;

async function conectarBanco() {

    if (mongoose.connection.readyState === 1) return; // já está conectado

    if (!bancoUrl) {
        throw new Error("Impossível se conectar ao banco de dados. \nÉ necessário configurar a variável de ambiente DB_URL com a string de conexão do banco de dados.");
    }

    try {
        mongoose.set("strictQuery", true);

        if (process.env.DEBUGLOG === "true")
            console.log("Tentando conexão com banco...");

        mongoose.connection
            .on("open", () => {
                if (process.env.DEBUGLOG === "true")
                    console.log("Conexão com banco estabelecida com sucesso!");
            })
            .on("error", err => {
                console.log("Erro no banco de dados:", err);
            })
            .on("disconnected", () => {
                if (process.env.DEBUGLOG === "true")
                    console.log("Desconectou do banco de dados.");
            });

        await mongoose.connect(bancoUrl);
    } catch (error) {
        console.log("Erro ao conectar com banco " + error);
        throw error; // não iniciar o servidor se não conseguir se conectar com o banco
    }
}

await conectarBanco();

export async function desconetarBanco() {
    if (process.env.DEBUGLOG === "true") console.log("Solicitando encerramento da conexão com banco");

    await mongoose.connection.close();
}

async function callbackSigTerm() {
    try {
        await desconetarBanco();
    } finally {
        process.exit(); // como está interceptando o SIGINT e SIGTERM se não chamar exit o processo não é terminado.
    }
}

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", callbackSigTerm).on("SIGTERM", callbackSigTerm);

export default mongoose.connection;