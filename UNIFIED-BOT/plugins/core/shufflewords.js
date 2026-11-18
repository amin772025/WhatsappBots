import { runUtility } from "./_utility-engine.js";
export default { id: "shufflewords", command: "shufflewords", category: "Text", description: "Shuffle words", async execute({ args, reply }) { await runUtility("shufflewords", args, reply); } };
