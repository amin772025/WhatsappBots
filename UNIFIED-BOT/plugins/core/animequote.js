const quotes = [
  "Small steps every day can lead to big changes.",
  "Courage is not the absence of fear; it is moving forward with purpose.",
  "Your future is shaped by what you practice today.",
  "A true friend helps you become a better version of yourself."
];
export default {
  id: "animequote", command: ["animequote", "inspire"], category: "Fun",
  description: "Share an original anime-style inspirational line",
  async execute({ reply }) {
    await reply("✨ " + quotes[Math.floor(Math.random() * quotes.length)]);
  }
};