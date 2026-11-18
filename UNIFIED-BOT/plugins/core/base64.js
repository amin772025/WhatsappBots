export default {
  id: "base64", command: "base64", category: "Tools",
  description: "Encode text as Base64",
  async execute({ reply, args }) {
    const value = args.join(" ");
    if (!value) { await reply("Usage: .base64 text"); return; }
    await reply(Buffer.from(value, "utf8").toString("base64"));
  }
};
