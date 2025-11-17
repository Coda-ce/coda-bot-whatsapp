export const handleMessage = async (client, message) => {
  //   if (message.fromMe) return;

  const prefix = "!";
  if (!message.body.startsWith(prefix)) return;

  const args = message.body.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (client.commands.has(commandName)) {
    try {
      await client.commands.get(commandName).execute(message, args);
    } catch (error) {
      console.error(`Erro ao executar comando ${commandName}:`, error);
      message.reply("Ocorreu um erro ao executar esse comando.");
    }
  } else {
    console.log("Comando não encontrado:", commandName);
  }
};
