export default {
  id: "idme", command: ["idme", "myid"], category: "Info",
  description: "Show your WhatsApp sender ID",
  async execute({ message, reply }) {
    await reply("Your WhatsApp ID:\n" + String(message.senderJid || message.senderNumber || "Unavailable"));
  }
};