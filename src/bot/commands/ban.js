import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  name: "ban",
  description: "Banir um usuário do grupo (Temporário ou Permanente).",
  async execute(message, args) {
    const chat = await message.getChat();

    // 0. Validações Iniciais (Segurança)
    if (!chat.isGroup) {
      return message.reply("Este comando só funciona em grupos.");
    }

    // Verifica se o BOT é Admin (Necessário para remover usuários)
    // Nota: O bot precisa ser Admin para banir qualquer um.
    const botId = message.client.info.wid._serialized;
    const botIsAdmin = chat.participants.find(
      (p) => p.id._serialized === botId
    )?.isAdmin;

    if (!botIsAdmin) {
      return message.reply(
        "Eu preciso ser Administrador do grupo para banir usuários."
      );
    }

    // 1. Requer permissão moderator/admin (Quem enviou o comando)
    const authorId = message.author || message.from;
    const authorIsAdmin = chat.participants.find(
      (p) => p.id._serialized === authorId
    )?.isAdmin;

    if (!authorIsAdmin) {
      return message.reply(
        "Apenas administradores podem usar o comando de ban."
      );
    }

    // 2. Validar menção (Quem será banido)
    const mentions = await message.getMentions();
    if (mentions.length === 0) {
      return message.reply(
        "Mencione o usuário a ser banido.\nEx: !ban @usuario [tempo] [motivo]"
      );
    }
    const targetContact = mentions[0];

    // Proteção: Não banir o próprio bot ou outros admins (opcional, mas recomendado)
    if (targetContact.id._serialized === botId)
      return message.reply("Eu não posso me banir!");

    const targetIsAdmin = chat.participants.find(
      (p) => p.id._serialized === targetContact.id._serialized
    )?.isAdmin;
    if (targetIsAdmin) {
      // Decisão de projeto: Geralmente bots evitam banir outros admins para evitar guerras de bot,
      // mas se você quiser permitir, remova este bloco.
      return message.reply(
        "Por segurança, não posso banir outros administradores."
      );
    }

    // 3. Processar Argumentos (Tempo e Motivo)
    // args[0] é a menção. Vamos olhar o resto.
    let reason = "";
    let expiresAt = null;
    let durationText = "Permanente";

    // Remove a menção dos argumentos para processar o texto limpo
    const argsWithoutMention = args.filter((arg) => !arg.includes("@"));

    if (argsWithoutMention.length === 0) {
      // 4. Motivo obrigatório
      return message.reply(
        "O motivo do banimento é obrigatório.\nEx: !ban @usuario Spam de links"
      );
    }

    // Verifica se o primeiro argumento restante é um tempo (ex: 10m, 1h, 2d)
    // Regex simples para capturar numero + letra (m/h/d)
    const timeRegex = /^(\d+)([mhd])$/;
    const firstArg = argsWithoutMention[0];
    const match = firstArg.match(timeRegex);

    if (match) {
      // É um Ban Temporário
      const amount = parseInt(match[1]);
      const unit = match[2];
      const now = new Date();

      if (unit === "m") now.setMinutes(now.getMinutes() + amount);
      if (unit === "h") now.setHours(now.getHours() + amount);
      if (unit === "d") now.setDate(now.getDate() + amount);

      expiresAt = now;
      durationText = firstArg;

      // O motivo é o resto da frase depois do tempo
      reason = argsWithoutMention.slice(1).join(" ");
    } else {
      // É um Ban Permanente
      reason = argsWithoutMention.join(" ");
    }

    if (!reason) {
      return message.reply("O motivo do banimento é obrigatório.");
    }

    // 5. Executar o Banimento e Salvar
    try {
      // A. Remover usuário do grupo
      await chat.removeParticipants([targetContact.id._serialized]);

      // B. Salvar ban no banco
      // Usamos upsert para atualizar o ban caso ele já exista (ex: mudar motivo)
      await prisma.bannedUser.upsert({
        where: {
          contactId_groupId: {
            contactId: targetContact.id._serialized,
            groupId: chat.id._serialized,
          },
        },
        update: {
          reason: reason,
          expiresAt: expiresAt,
          bannedBy: authorId,
          bannedAt: new Date(),
        },
        create: {
          contactId: targetContact.id._serialized,
          groupId: chat.id._serialized,
          reason: reason,
          expiresAt: expiresAt,
          bannedBy: authorId,
        },
      });

      // C. Logs/Confirmação
      await message.reply(
        `🔨 **BANIDO**\n\n` +
          `👤 **Usuário:** @${targetContact.id.user}\n` +
          `⏳ **Duração:** ${durationText}\n` +
          `📝 **Motivo:** ${reason}`,
        null,
        { mentions: [targetContact] }
      );
    } catch (error) {
      console.error("Erro ao banir:", error);
      await message.reply(
        "Ocorreu um erro ao tentar banir o usuário. Verifique se tenho permissões ou se ele já saiu."
      );
    }
  },
};
