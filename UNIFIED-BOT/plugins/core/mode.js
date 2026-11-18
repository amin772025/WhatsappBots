export default {
  id: "mode", command: "mode", category: "Owner",
  description: "Switch between public and private command access", ownerOnly: true,
  async execute({ args, reply, context }) {
    const mode = String(args[0] || "").toLowerCase();
    if (!["public", "private"].includes(mode)) { await reply("Usage: .mode public|private"); return; }
    await context.runtime.store.transact(data => {
      data.settings ||= {};
      data.settings.mode = mode;
    });
    context.runtime.config.mode = mode;
    await reply(`Bot mode changed to ${mode}.`);
  }
};
