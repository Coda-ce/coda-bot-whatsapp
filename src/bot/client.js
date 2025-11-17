import pkg from "whatsapp-web.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { handleMessage } from "./handlers/messageHandler.js";
import { logger } from "../utils/logger.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

// Carregando comandos automaticamente
client.commands = new Map();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.name, command.default);
  console.log(`[INFO] Comando carregado: ${command.default.name}`);
}

// Eventos
client.on("qr", (qr) => {
  console.log("[INFO] QR code gerado, escaneie com o WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () =>
  console.log("[INFO] Autenticado com sucesso!")
);
client.on("auth_failure", (msg) =>
  console.error("[ERROR] Falha na autenticação:", msg)
);
client.on("ready", () => console.log("[INFO] WhatsApp client está pronto!"));

client.on("message_create", (message) => {
  handleMessage(client, message);
});

client.initialize();
logger.info("Cliente do WhatsApp inicializado.");
