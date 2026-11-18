const questions = [
  ["What planet is known as the Red Planet?", "Mars"],
  ["How many sides does a hexagon have?", "6"],
  ["What is the largest ocean on Earth?", "Pacific"],
  ["Which gas do plants absorb?", "Carbon dioxide"],
  ["What is the chemical symbol for gold?", "Au"],
  ["How many minutes are in two hours?", "120"],
  ["What is the capital of Japan?", "Tokyo"],
  ["Which star is closest to Earth?", "The Sun"]
];
export default {
  id: "trivia", command: ["trivia", "quiz"], category: "Games",
  description: "Get a random general-knowledge question",
  async execute({ reply }) {
    const [question, answer] = questions[Math.floor(Math.random() * questions.length)];
    await reply("🧠 Quick quiz\n" + question + "\n\nAnswer: " + answer);
  }
};