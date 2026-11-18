import { runUtility } from "./_utility-engine.js";
export default { id: "binaryencode", command: "binaryencode", category: "Encoding", description: "Encode binary", async execute({ args, reply }) { await runUtility("binaryencode", args, reply); } };
