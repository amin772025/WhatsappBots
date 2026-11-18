import { runUtility } from "./_utility-engine.js";
export default { id: "unmorse", command: "unmorse", category: "Encoding", description: "Decode Morse code", async execute({ args, reply }) { await runUtility("unmorse", args, reply); } };
