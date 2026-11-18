import { runUtility } from "./_utility-engine.js";
export default { id: "hexencode", command: "hexencode", category: "Encoding", description: "Encode hexadecimal", async execute({ args, reply }) { await runUtility("hexencode", args, reply); } };
