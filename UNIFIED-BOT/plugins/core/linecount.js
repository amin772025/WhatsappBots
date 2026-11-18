import { runUtility } from "./_utility-engine.js";
export default { id: "linecount", command: "linecount", category: "Text", description: "Count lines", async execute({ args, reply }) { await runUtility("linecount", args, reply); } };
