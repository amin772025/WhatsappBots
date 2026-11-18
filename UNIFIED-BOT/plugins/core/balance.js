import { getUser } from "../../core/user-economy.js";
export default {
  id: "balance", command: "balance", aliases: ["wallet"], category: "Games",
  description: "Show your virtual coin balance",
  async execute({ message, reply, context }) {
    try { await reply(`🪙 Your balance: ${Number(getUser(context.runtime.store, message).coins) || 0} coins`); }
    catch (error) { await reply(error.message); }
  }
};
