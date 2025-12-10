import express from "express";
import { client } from "./bot/client.js";

const app = express();
const PORT = process.env.PORT || 3000;
const serverStartTime = Date.now();

// Middleware de logging de requisições
app.use((req, res, next) => {
  const startTime = Date.now();

  // Captura quando a resposta é finalizada
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${req.method} ${req.url} - Status: ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});

// Rota simples para verificar se o servidor está ativo
app.get("/", (req, res) => {
  res.send("Bot do WhatsApp ativo!");
});

// Rota de status
app.get("/status", (req, res) => {
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000); // uptime em segundos
  const isConnected = client.info ? true : false; // verifica se o cliente está conectado

  res.json({
    botStatus: isConnected ? "conectado" : "desconectado",
    uptime: uptime,
    timestamp: new Date().toISOString(),
  });
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Opcional: manter o cliente ativo
client.on("ready", () => {
  console.log("WhatsApp client está pronto!");
});
