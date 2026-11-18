import { runUtility } from "./_utility-engine.js";
export default { id: "regexescape", command: "regexescape", category: "Encoding", description: "Escape regular expressions", async execute({ args, reply }) { await runUtility("regexescape", args, reply); } };
