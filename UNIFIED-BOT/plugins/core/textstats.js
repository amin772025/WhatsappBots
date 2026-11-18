import { runUtility } from "./_utility-engine.js";
export default { id: "textstats", command: "textstats", category: "Info", description: "Text statistics", async execute({ args, reply }) { await runUtility("textstats", args, reply); } };
