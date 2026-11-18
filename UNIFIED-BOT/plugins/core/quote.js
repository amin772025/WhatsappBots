const quotes = [
  "Small steps, repeated consistently, create meaningful progress.",
  "Curiosity turns questions into opportunities to learn.",
  "A mistake is useful when you take time to understand it.",
  "Good ideas become stronger when you test them.",
  "Progress is built through patience, practice, and reflection.",
  "Be generous with credit and careful with assumptions.",
  "The best time to learn something new is when you can give it your attention.",
  "A clear goal makes the next step easier to choose."
];

export default {
  id: "quote",
  command: "quote",
  aliases: ["inspire"],
  category: "General",
  description: "Share a short original motivational quote",
  async execute({ reply }) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    await reply(`✦ ${quote}`);
  }
};
