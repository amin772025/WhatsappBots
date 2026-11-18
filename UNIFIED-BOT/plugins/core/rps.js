const beats = { rock: "scissors", paper: "rock", scissors: "paper" };
export default {
  id: "rps", command: "rps", aliases: ["sps"], category: "Games",
  description: "Play rock-paper-scissors (no betting)",
  async execute({ reply, args }) {
    const choice = String(args[0] || "").toLowerCase();
    if (!Object.hasOwn(beats, choice)) { await reply("Usage: .rps rock|paper|scissors"); return; }
    const choices = Object.keys(beats);
    const bot = choices[Math.floor(Math.random() * choices.length)];
    const result = choice === bot ? "Draw!" : beats[choice] === bot ? "You win!" : "I win!";
    await reply(`You: ${choice}\nBot: ${bot}\n${result}`);
  }
};
