const jokes = [
  "Why did the programmer bring a ladder? To reach the high-level language.",
  "I told my computer I needed a break. It said: no problem, I'll go to sleep.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "A clean desk is a sign of a cluttered drawer.",
  "Why was the math book sad? It had too many problems."
];
export default {
  id: "joke", command: "joke", aliases: ["نكتة"], category: "General",
  description: "Share a clean, family-friendly joke",
  async execute({ reply }) { await reply(jokes[Math.floor(Math.random() * jokes.length)]); }
};
