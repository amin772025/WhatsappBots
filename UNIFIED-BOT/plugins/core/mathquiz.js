export default {
  id: "mathquiz", command: "mathquiz", category: "Games",
  description: "Generate a quick arithmetic challenge",
  async execute({ reply }) {
    const a = Math.floor(Math.random() * 40) + 10;
    const b = Math.floor(Math.random() * 30) + 1;
    const op = Math.random() < 0.5 ? "+" : "×";
    const answer = op === "+" ? a + b : a * b;
    await reply("🧮 Math challenge\n" + a + " " + op + " " + b + " = ?\n\nAnswer: " + answer);
  }
};