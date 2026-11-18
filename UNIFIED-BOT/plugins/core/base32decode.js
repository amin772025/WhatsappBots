import { runUtility } from "./_utility-engine.js";
export default { id: "base32decode", command: "base32decode", category: "Encoding", description: "Decode Base32", async execute({ args, reply }) { await runUtility("base32decode", args, reply); } };
