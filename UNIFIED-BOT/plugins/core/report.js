export default {
  id: "report", command: "report", category: "General",
  description: "Send feedback to the configured bot owner",
  async execute({ message, args, reply, config, context }) {
    const text = args.join(" ").trim();
    if (!text || text.length > 1000) { await reply("Usage: .report describe the issue (max 1000 characters)"); return; }
    try {
      const target = config.ownerNumber + "@s.whatsapp.net";
      const sender = message.senderNumber || "unknown";
      await context.runtime.provider.sendMessage(target, {
        text: `Bot feedback\nFrom: ${sender}\nChat: ${message.isGroup ? "group" : "private"}\n\n${text}`
      });
      await reply("Your feedback was sent to the bot owner. Thank you.");
    } catch {
      await reply("Could not send the report. Please contact the bot owner directly.");
    }
  }
};
