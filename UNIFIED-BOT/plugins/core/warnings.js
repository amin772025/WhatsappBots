import { targetJid } from "../../core/group-actions.js";

export default {
  id: "warnings", command: "warnings", category: "Admin",
  description: "Show recorded warnings for a group member",
  async execute({ message, args, reply, context }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    let target;
    try { target = targetJid(message, args); }
    catch { target = message.senderJid; }
    const records = context.runtime.store.read().chats?.[message.chatId]?.warnings?.[target] || [];
    if (!records.length) return reply("No warnings are recorded for this member.");
    const list = records.slice(-10).map((item, index) => `${index + 1}. ${item.reason} — ${new Date(item.at).toLocaleDateString()}`);
    await reply(`⚠️ Warnings for @${String(target).split("@")[0]}: ${records.length}\n\n${list.join("\n")}`);
  }
};
