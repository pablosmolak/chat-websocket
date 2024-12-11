import server from "./src/app.js"
//import swaggerUI from 'swagger-ui-express'; 
//import swaggerJsDoc from 'swagger-jsdoc';  
//import swaggerOptions from './src/docs/config/head.js'; 
import * as dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 3010;

//app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerOptions)));

server.listen(PORT, () => {
    console.log(`Servidor Rodando em http://localhost:${PORT}`)
});
