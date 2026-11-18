import { updateUser } from "../../core/user-economy.js";
const COOLDOWN = 60 * 60 * 1000;
const jobs = ["helped organize a library", "watered a community garden", "fixed a bicycle", "helped a neighbor carry books", "sorted a collection of old games"];
export default {
  id: "work", command: "work", category: "Money",
  description: "Earn virtual coins with a short cooldown",
  async execute({ message, reply, context }) {
    try {
      const now = Date.now();
      const amount = 20 + Math.floor(Math.random() * 41);
      const result = await updateUser(context.runtime.store, message, user => {
        const last = Date.parse(user.lastWorkAt || 0);
        if (now - last < COOLDOWN) return { worked: false, remaining: COOLDOWN - (now - last) };
        user.coins = (Number(user.coins) || 0) + amount;
        user.lastWorkAt = new Date(now).toISOString();
        return { worked: true, amount, balance: user.coins };
      });
      if (!result.worked) await reply(`Take a break. You can work again in about ${Math.ceil(result.remaining / 60000)} minute(s).`);
      else await reply(`🧰 You ${jobs[Math.floor(Math.random() * jobs.length)]} and earned ${result.amount} coins. Balance: ${result.balance}`);
    } catch (error) { await reply(error.message); }
  }
};
