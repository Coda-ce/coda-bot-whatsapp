export default {
  name: "ping", // o nome do comando
  description: "Responde com pong.", // descrição opcional
  async execute(message, args) {
    await message.reply("pong");
  },
};
