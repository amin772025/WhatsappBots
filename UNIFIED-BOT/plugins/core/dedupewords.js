import { runUtility } from "./_utility-engine.js";
export default { id: "dedupewords", command: "dedupewords", category: "Text", description: "Remove duplicate words", async execute({ args, reply }) { await runUtility("dedupewords", args, reply); } };
