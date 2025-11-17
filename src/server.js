import express from "express";
import { client } from "./bot/client.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Rota simples para verificar se o servidor está ativo
app.get("/", (req, res) => {
  res.send("Bot do WhatsApp ativo!");
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Opcional: manter o cliente ativo
client.on("ready", () => {
  console.log("WhatsApp client está pronto!");
});
