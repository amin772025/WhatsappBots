export default {
  id: "ping",
  command: ["ping", "alive"],
  aliases: ["p"],
  category: "General",
  description: "Check that the bot is responding",
  async execute({ reply }) {
    await reply("Pong! The bot is online.");
  }
};
