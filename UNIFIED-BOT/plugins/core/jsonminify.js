import { runUtility } from "./_utility-engine.js";
export default { id: "jsonminify", command: "jsonminify", category: "Encoding", description: "Minify JSON", async execute({ args, reply }) { await runUtility("jsonminify", args, reply); } };
