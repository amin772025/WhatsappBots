import { runUtility } from "./_utility-engine.js";
export default { id: "sentencecount", command: "sentencecount", category: "Info", description: "Count sentences", async execute({ args, reply }) { await runUtility("sentencecount", args, reply); } };
