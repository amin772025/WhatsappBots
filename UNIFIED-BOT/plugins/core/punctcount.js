import { runUtility } from "./_utility-engine.js";
export default { id: "punctcount", command: "punctcount", category: "Info", description: "Count punctuation", async execute({ args, reply }) { await runUtility("punctcount", args, reply); } };
