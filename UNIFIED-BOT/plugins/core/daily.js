import { updateUser } from "../../core/user-economy.js";
const DAY = 24 * 60 * 60 * 1000;
export default {
  id: "daily", command: "daily", category: "Money",
  description: "Claim free virtual coins once every 24 hours",
  async execute({ message, reply, context }) {
    try {
      const now = Date.now();
      const amount = 50 + Math.floor(Math.random() * 51);
      const result = await updateUser(context.runtime.store, message, user => {
        const last = Date.parse(user.lastDailyAt || 0);
        if (now - last < DAY) return { claimed: false, remaining: DAY - (now - last) };
        user.coins = (Number(user.coins) || 0) + amount;
        user.lastDailyAt = new Date(now).toISOString();
        return { claimed: true, amount, balance: user.coins };
      });
      if (!result.claimed) {
        const hours = Math.ceil(result.remaining / 3600000);
        await reply(`You already claimed today's reward. Try again in about ${hours} hour(s).`);
      } else await reply(`🎁 You received ${result.amount} coins. Balance: ${result.balance}`);
    } catch (error) { await reply(error.message); }
  }
};
