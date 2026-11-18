export default {
  id: "top", command: "top", aliases: ["leaderboard"], category: "Games",
  description: "Show the top ten virtual coin balances",
  async execute({ reply, context }) {
    const users = Object.entries(context.runtime.store.read().users || {})
      .map(([id, user]) => ({ id, coins: Number(user.coins) || 0 }))
      .sort((a, b) => b.coins - a.coins).slice(0, 10);
    if (!users.length) { await reply("No player data yet. Use .daily to start."); return; }
    await reply("🏆 Virtual coin leaderboard\n" + users.map((u, i) => `${i + 1}. ${u.id.replace(/@.*/, "")}: ${u.coins}`).join("\n"));
  }
};
