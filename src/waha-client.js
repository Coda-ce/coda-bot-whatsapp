/**
 * Cliente para comunicação com a API WAHA
 */

const axios = require("axios");
const config = require("./config");

class WahaClient {
  constructor() {
    this.api = axios.create({
      baseURL: config.wahaApiUrl,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": config.wahaApiKey,
      },
    });
  }

  /**
   * Envia uma mensagem de texto
   * @param {string} chatId - ID do chat (ex: 5511999999999@c.us)
   * @param {string} text - Texto da mensagem
   */
  async sendMessage(chatId, text) {
    try {
      const response = await this.api.post(`/api/sendText`, {
        session: config.sessionName,
        chatId: chatId,
        text: text,
      });
      console.log(`✅ Mensagem enviada para ${chatId}`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Erro ao enviar mensagem:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Envia uma mensagem respondendo a outra
   * @param {string} chatId - ID do chat
   * @param {string} text - Texto da mensagem
   * @param {string} messageId - ID da mensagem original
   */
  async sendReply(chatId, text, messageId) {
    try {
      const response = await this.api.post(`/api/sendText`, {
        session: config.sessionName,
        chatId: chatId,
        text: text,
        reply_to: messageId,
      });
      console.log(`✅ Resposta enviada para ${chatId}`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Erro ao enviar resposta:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Configura o webhook atualizando a sessão
   */
  async configureWebhook() {
    try {
      // Atualiza a sessão com o webhook configurado
      const response = await this.api.put(
        `/api/sessions/${config.sessionName}`,
        {
          config: {
            webhooks: [
              {
                url: config.webhookUrl,
                events: ["message"],
              },
            ],
          },
        },
      );
      console.log(`✅ Webhook configurado: ${config.webhookUrl}`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Erro ao configurar webhook:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Lista todas as sessões
   */
  async listSessions() {
    try {
      const response = await this.api.get("/api/sessions");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Erro ao listar sessões:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Verifica o status da sessão
   */
  async getSessionStatus() {
    try {
      const response = await this.api.get(
        `/api/sessions/${config.sessionName}`,
      );
      return response.data;
    } catch (error) {
      // Se 404, a sessão pode não existir
      if (error.response?.status === 404) {
        return null;
      }
      console.error(
        "❌ Erro ao obter status da sessão:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Inicia a sessão se não estiver ativa
   */
  async startSession() {
    try {
      const response = await this.api.post(
        `/api/sessions/${config.sessionName}/start`,
      );
      console.log(`✅ Sessão iniciada: ${config.sessionName}`);
      return response.data;
    } catch (error) {
      // Sessão pode já estar ativa
      if (error.response?.status === 422) {
        console.log(`ℹ️ Sessão já está ativa: ${config.sessionName}`);
        return null;
      }
      console.error(
        "❌ Erro ao iniciar sessão:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

module.exports = new WahaClient();
