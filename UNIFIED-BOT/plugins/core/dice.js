export default {
  id: "dice", command: "dice", aliases: ["roll"], category: "Games",
  description: "Roll a six-sided die",
  async execute({ reply }) { await reply("🎲 " + (1 + Math.floor(Math.random() * 6))); }
};
