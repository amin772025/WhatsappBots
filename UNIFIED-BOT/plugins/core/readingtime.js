import { runUtility } from "./_utility-engine.js";
export default { id: "readingtime", command: "readingtime", category: "Info", description: "Estimate reading time", async execute({ args, reply }) { await runUtility("readingtime", args, reply); } };
