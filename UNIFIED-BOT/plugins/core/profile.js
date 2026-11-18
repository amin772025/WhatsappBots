import { getUser } from "../../core/user-economy.js";
export default {
  id: "profile", command: "profile", aliases: ["me"], category: "Info",
  description: "Show your bot profile and activity",
  async execute({ message, reply, context }) {
    try {
      const user = getUser(context.runtime.store, message);
      const lines = [
        "╭─「 Your profile 」",
        `│ User: ${message.displayName || message.senderNumber || "WhatsApp user"}`,
        `│ Commands: ${Number(user.commands) || 0}`,
        `│ Virtual coins: ${Number(user.coins) || 0}`,
        `│ First seen: ${user.firstSeenAt ? new Date(user.firstSeenAt).toLocaleDateString() : "Today"}`,
        "╰────────────"
      ];
      await reply(lines.join("\n"));
    } catch (error) { await reply(error.message); }
  }
};
