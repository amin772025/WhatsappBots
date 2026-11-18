export default {
  id: "setlang", command: "setlang", category: "Owner",
  description: "Change bot language between Arabic and English", ownerOnly: true,
  async execute({ args, reply, context }) {
    const language = String(args[0] || "").toLowerCase();
    if (!["ar", "en"].includes(language)) { await reply("Usage: .setlang ar|en"); return; }
    await context.runtime.store.transact(data => {
      data.settings ||= {};
      data.settings.language = language;
    });
    context.runtime.config.language = language;
    await reply(`Language changed to ${language}.`);
  }
};
