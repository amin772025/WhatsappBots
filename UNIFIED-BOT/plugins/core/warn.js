import { targetJid, protectGroupTarget } from "../../core/group-actions.js";

export default {
  id: "warn", command: "warn", category: "Group", adminOnly: true,
  description: "Record a group moderation warning for a member",
  async execute({ message, args, reply, context, config }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    let target;
    try { target = protectGroupTarget(targetJid(message, args), message, config, context); }
    catch (error) { return reply(error.message); }
    const reason = args.filter(value => !/^\\+?[\\d\\s()-]{8,20}$/.test(value)).join(" ").trim().slice(0, 300);
    let count = 0;
    await context.runtime.store.transact(data => {
      data.chats ||= {};
      data.chats[message.chatId] ||= {};
      const chat = data.chats[message.chatId];
      chat.warnings ||= {};
      const records = chat.warnings[target] || (chat.warnings[target] = []);
      records.push({ reason: reason || "No reason provided", by: message.senderJid || message.senderNumber || "admin", at: new Date().toISOString() });
      if (records.length > 20) records.shift();
      count = records.length;
    });
    await reply(`⚠️ Warning recorded for @${target.split("@")[0]}. Total: ${count}. Reason: ${reason || "No reason provided"}`);
  }
};
