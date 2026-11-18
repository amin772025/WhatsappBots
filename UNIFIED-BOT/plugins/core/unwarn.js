import { targetJid, protectGroupTarget } from "../../core/group-actions.js";

export default {
  id: "unwarn", command: "unwarn", category: "Group", adminOnly: true,
  description: "Remove the latest warning from a group member",
  async execute({ message, args, reply, context, config }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    let target;
    try { target = protectGroupTarget(targetJid(message, args), message, config, context); }
    catch (error) { return reply(error.message); }
    let remaining = 0;
    let removed = false;
    await context.runtime.store.transact(data => {
      const chat = data.chats?.[message.chatId];
      const records = chat?.warnings?.[target];
      if (records?.length) {
        records.pop();
        removed = true;
        remaining = records.length;
        if (!records.length) delete chat.warnings[target];
      }
    });
    await reply(removed ? `✅ Latest warning removed. Remaining: ${remaining}.` : "This member has no recorded warnings.");
  }
};
