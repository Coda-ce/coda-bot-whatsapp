/**
 * Handler para processar mensagens recebidas
 */

const wahaClient = require("../waha-client");

// Cache para evitar processar mensagens duplicadas
const processedMessages = new Set();
const CACHE_TTL = 60000; // 1 minuto

/**
 * Processa uma mensagem recebida e decide a resposta
 * @param {object} message - Objeto da mensagem recebida
 */
async function handleMessage(message) {
  // Verifica se já processou esta mensagem (anti-duplicação)
  const messageId = message.id?._serialized || message.id;
  if (processedMessages.has(messageId)) {
    console.log("⚠️ Mensagem duplicada ignorada:", messageId);
    return;
  }

  // Adiciona ao cache e remove após TTL
  processedMessages.add(messageId);
  setTimeout(() => processedMessages.delete(messageId), CACHE_TTL);

  // Ignora mensagens enviadas pelo próprio bot
  if (message.fromMe) {
    console.log("📤 Mensagem própria ignorada");
    return;
  }

  const chatId = message.from;
  const text = message.body?.toLowerCase() || "";
  const senderName = message.notifyName || message.from.split("@")[0];

  console.log(`📩 Mensagem de ${senderName}: ${message.body}`);

  // Lógica de resposta baseada no conteúdo
  let response = null;

  // Comandos básicos
  if (text === "oi" || text === "olá" || text === "ola" || text === "hello") {
    response = `Olá ${senderName}! 👋\n\nEu sou um bot de teste. Como posso ajudar?\n\nDigite *menu* para ver as opções.`;
  } else if (text === "menu" || text === "ajuda" || text === "help") {
    response =
      `📋 *Menu de Opções*\n\n` +
      `1️⃣ Digite *oi* - Saudação\n` +
      `2️⃣ Digite *hora* - Hora atual\n` +
      `3️⃣ Digite *data* - Data atual\n` +
      `4️⃣ Digite *info* - Informações do bot\n` +
      `5️⃣ Digite *eco [mensagem]* - Repete sua mensagem\n\n` +
      `💡 Experimente digitar qualquer comando!`;
  } else if (text === "hora") {
    const hora = new Date().toLocaleTimeString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    response = `🕐 Agora são *${hora}*`;
  } else if (text === "data") {
    const data = new Date().toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    response = `📅 Hoje é *${data}*`;
  } else if (text === "info") {
    response =
      `ℹ️ *Informações do Bot*\n\n` +
      `🤖 Nome: Bot WAHA Test\n` +
      `📦 Versão: 1.0.0\n` +
      `⚡ Status: Online\n` +
      `🔧 Powered by: WAHA API`;
  } else if (text.startsWith("eco ")) {
    const echoText = message.body.substring(4);
    response = `🔊 *Echo:*\n${echoText}`;
  } else {
    // Resposta padrão para mensagens não reconhecidas
    response = `🤖 Não entendi sua mensagem.\n\nDigite *menu* para ver as opções disponíveis.`;
  }

  // Envia a resposta
  if (response) {
    try {
      await wahaClient.sendReply(chatId, response, messageId);
    } catch (error) {
      console.error("❌ Falha ao enviar resposta:", error.message);
    }
  }
}

module.exports = { handleMessage };
