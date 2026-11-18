import { runUtility } from "./_utility-engine.js";
export default { id: "vowelcount", command: "vowelcount", category: "Info", description: "Count vowels", async execute({ args, reply }) { await runUtility("vowelcount", args, reply); } };
