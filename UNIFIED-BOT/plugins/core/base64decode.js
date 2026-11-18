export default {
  id: "base64decode", command: "base64decode", aliases: ["unbase64"], category: "Tools",
  description: "Decode Base64 text",
  async execute({ reply, args }) {
    const value = args.join("").trim();
    if (!value || value.length > 4000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
      await reply("Provide valid Base64 text (up to 4000 characters)."); return;
    }
    const decoded = Buffer.from(value, "base64").toString("utf8");
    if (decoded.includes("\uFFFD")) { await reply("Decoded data is not valid UTF-8 text."); return; }
    await reply(decoded.slice(0, 3500));
  }
};
