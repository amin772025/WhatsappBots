export function requireGroup(message) {
  if (!message?.isGroup) throw new Error("This command works in groups only.");
}
export function requireBotAdmin(message) {
  requireGroup(message);
  if (!message.botIsAdmin) throw new Error("Make the bot a group admin first.");
}
export function targetJid(message, args = []) {
  const quoted = message?.quotedParticipantJid || message?.mentionedJids?.[0];
  if (quoted) return quoted;
  const value = args.find(x => /^\+?[\d\s()-]{8,20}$/.test(x));
  if (!value) throw new Error("Reply to a member or provide an international phone number.");
  const number = value.replace(/\D/g, "");
  if (number.length < 8 || number.length > 15) throw new Error("Invalid phone number.");
  return number + "@s.whatsapp.net";
}
export async function groupMetadata(context, message) {
  requireGroup(message);
  return context.runtime.provider.socket.groupMetadata(message.chatId);
}

export function protectGroupTarget(target, message, config, context) {
  const targetDigits = String(target).split("@")[0].split(":")[0].replace(/\D/g, "");
  if (target === message.senderJid || (message.senderNumber && targetDigits === message.senderNumber)) {
    throw new Error("You cannot target your own account with this command.");
  }
  if (targetDigits && targetDigits === config.ownerNumber) {
    throw new Error("The configured bot owner is protected from group moderation commands.");
  }
  const socket = context.runtime.provider?.socket;
  const normalizeJid = jid => String(jid || "").replace(/:\d+(?=@)/, "");
  const botIds = [socket?.user?.id, socket?.user?.lid].filter(Boolean).map(normalizeJid);
  if (botIds.includes(normalizeJid(target))) throw new Error("The bot account is protected.");
  return target;
}
