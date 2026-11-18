export default {
  id: "reverse", command: "reverse", aliases: ["عكس"], category: "Tools",
  description: "Reverse a text message",
  async execute({ reply, args }) {
    const value = args.join(" ");
    if (!value) { await reply("Usage: .reverse some text"); return; }
    await reply(Array.from(value).reverse().join(""));
  }
};
