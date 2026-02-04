/**
 * Configurações do Bot WhatsApp
 */

// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

const config = {
  // URL base da API WAHA (container Docker)
  wahaApiUrl: process.env.WAHA_API_URL || "http://localhost:3000",

  // Chave de API do WAHA
  wahaApiKey: process.env.WAHA_API_KEY || "",

  // Nome da sessão do WhatsApp
  sessionName: process.env.SESSION_NAME || "default",

  // Porta do servidor webhook
  webhookPort: process.env.WEBHOOK_PORT || 3001,

  // URL pública do webhook (172.17.0.1 é o IP do host no Docker bridge Linux)
  webhookUrl: process.env.WEBHOOK_URL || "http://172.17.0.1:3001/webhook",
};

module.exports = config;
