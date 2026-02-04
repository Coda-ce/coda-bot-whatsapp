/**
 * Bot WhatsApp usando WAHA API
 *
 * Este arquivo inicia o servidor webhook que recebe as mensagens
 * e processa as respostas automaticamente.
 */

const express = require("express");
const config = require("./config");
const wahaClient = require("./waha-client");
const { handleMessage } = require("./handlers/message-handler");

const app = express();
app.use(express.json());

// Endpoint de saúde
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoint webhook para receber eventos do WAHA
app.post("/webhook", async (req, res) => {
  try {
    const event = req.body;

    console.log("\n📨 Evento recebido:", event.event);

    // Processa apenas eventos de mensagem (não message.any para evitar duplicação)
    if (event.event === "message") {
      const message = event.payload;

      // Processa apenas mensagens de texto
      if (message.body) {
        await handleMessage(message);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    res.status(500).json({ error: error.message });
  }
});

// Inicializa o servidor
async function start() {
  try {
    console.log("🚀 Iniciando Bot WhatsApp...\n");
    console.log("📋 Configurações:");
    console.log(`   WAHA API: ${config.wahaApiUrl}`);
    console.log(
      `   API Key: ${config.wahaApiKey ? "***" + config.wahaApiKey.slice(-4) : "NÃO CONFIGURADA"}`,
    );
    console.log(`   Sessão: ${config.sessionName}`);
    console.log(`   Webhook Port: ${config.webhookPort}`);
    console.log(`   Webhook URL: ${config.webhookUrl}\n`);

    // Lista sessões disponíveis
    try {
      const sessions = await wahaClient.listSessions();
      console.log(`📱 Sessões encontradas: ${sessions.length}`);
      sessions.forEach((s) => {
        console.log(`   - ${s.name}: ${s.status}`);
      });
    } catch (error) {
      console.log(`⚠️ Não foi possível listar sessões: ${error.message}`);
    }

    // Verifica conexão com WAHA
    try {
      const status = await wahaClient.getSessionStatus();
      if (status) {
        console.log(
          `\n✅ Sessão "${config.sessionName}" status: ${status.status}`,
        );
      } else {
        console.log(`\n⚠️ Sessão "${config.sessionName}" não encontrada.`);
        console.log(`   Acesse ${config.wahaApiUrl} e crie a sessão primeiro.`);
      }
    } catch (error) {
      console.log(`⚠️ Não foi possível verificar sessão: ${error.message}`);
      console.log(
        "   Certifique-se que o WAHA está rodando e a sessão foi criada.\n",
      );
    }

    // Configura webhook
    try {
      await wahaClient.configureWebhook();
    } catch (error) {
      console.log(`⚠️ Não foi possível configurar webhook automaticamente.`);
      console.log(
        `   Configure manualmente no dashboard: ${config.wahaApiUrl}`,
      );
      console.log(`   URL do webhook: ${config.webhookUrl}\n`);
    }

    // Inicia o servidor
    app.listen(config.webhookPort, () => {
      console.log(
        `\n🌐 Servidor webhook rodando em http://localhost:${config.webhookPort}`,
      );
      console.log(`📡 Aguardando mensagens...\n`);
      console.log("─".repeat(50));
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar bot:", error);
    process.exit(1);
  }
}

start();
