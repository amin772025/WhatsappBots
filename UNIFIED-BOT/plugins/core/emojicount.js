import { runUtility } from "./_utility-engine.js";
export default { id: "emojicount", command: "emojicount", category: "Info", description: "Count non-ASCII symbols", async execute({ args, reply }) { await runUtility("emojicount", args, reply); } };
