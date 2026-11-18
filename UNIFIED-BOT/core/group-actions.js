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
