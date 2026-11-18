export default {
  id: "coin", command: "coin", aliases: ["flip"], category: "Games",
  description: "Flip a coin",
  async execute({ reply, config }) {
    const heads = Math.random() < 0.5;
    await reply(config.language === "ar" ? (heads ? "🪙 صورة!" : "🪙 كتابة!") : (heads ? "🪙 Heads!" : "🪙 Tails!"));
  }
};
