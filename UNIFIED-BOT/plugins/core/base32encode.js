import { runUtility } from "./_utility-engine.js";
export default { id: "base32encode", command: "base32encode", category: "Encoding", description: "Encode Base32", async execute({ args, reply }) { await runUtility("base32encode", args, reply); } };
