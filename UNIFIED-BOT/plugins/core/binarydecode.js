import { runUtility } from "./_utility-engine.js";
export default { id: "binarydecode", command: "binarydecode", category: "Encoding", description: "Decode binary", async execute({ args, reply }) { await runUtility("binarydecode", args, reply); } };
