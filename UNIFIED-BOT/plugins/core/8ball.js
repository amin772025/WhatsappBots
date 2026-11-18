const answers = ["It looks promising.", "Try again later.", "The signs point to yes.", "Not enough information yet.", "Focus on what you can control.", "A thoughtful plan will help more than a guess."];
export default {
  id: "8ball", command: "8ball", aliases: ["askball"], category: "Games",
  description: "Get a playful random answer",
  async execute({ reply, args }) {
    if (!args.length) { await reply("Ask a question after .8ball"); return; }
    await reply("🎱 " + answers[Math.floor(Math.random() * answers.length)]);
  }
};
