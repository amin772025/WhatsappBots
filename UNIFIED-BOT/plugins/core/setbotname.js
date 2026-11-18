export default {
  id: "setbotname", command: "setbotname", category: "Owner",
  description: "Change the bot display name", ownerOnly: true,
  async execute({ args, reply, context }) {
    const name = args.join(" ").trim().slice(0, 40);
    if (!name) { await reply("Usage: .setbotname New name"); return; }
    await context.runtime.store.transact(data => {
      data.settings ||= {};
      data.settings.botName = name;
    });
    context.runtime.config.botName = name;
    await reply(`Bot name changed to ${name}.`);
  }
};
