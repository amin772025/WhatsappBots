import { requireBotAdmin, targetJid } from "../../core/group-actions.js";

export default {
  id: "add",
  command: "add",
  category: "Group",
  description: "Add a member to the current group by reply, mention or international number",
  adminOnly: true,
  async execute({ message, args, reply, context }) {
    try {
      requireBotAdmin(message);
      const target = targetJid(message, args);
      if (!target.endsWith("@s.whatsapp.net") && !target.endsWith("@lid")) {
        throw new Error("Use a WhatsApp member mention, reply, or international phone number.");
      }
      const result = await context.runtime.provider.socket.groupParticipantsUpdate(
        message.chatId,
        [target],
        "add"
      );
      const item = Array.isArray(result) ? result[0] : null;
      if (item?.status === "200" || item?.status === 200) {
        return reply("Member added to the group.");
      }
      if (item?.status === "403" || item?.status === 403) {
        return reply("WhatsApp did not allow a direct add. Ask the member to join using the group invite link.");
      }
      await reply("Add request submitted. WhatsApp may require the member to accept an invitation.");
    } catch (error) {
      await reply(error.message || "Could not add this member.");
    }
  }
};
