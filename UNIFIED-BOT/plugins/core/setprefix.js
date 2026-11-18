export default {
  id: "setprefix", command: "setprefix", category: "Owner",
  description: "Change the bot command prefix", ownerOnly: true,
  async execute({ args, reply, context }) {
    const prefix = String(args[0] || "");
    if (!prefix || prefix.length > 4 || /\s/.test(prefix)) {
      await reply("Usage: .setprefix <1–4 non-space characters>"); return;
    }
    await context.runtime.store.transact(data => {
      data.settings ||= {};
      data.settings.prefix = prefix;
    });
    context.runtime.config.prefix = prefix;
    await reply(`Prefix changed to: ${prefix}`);
  }
};
