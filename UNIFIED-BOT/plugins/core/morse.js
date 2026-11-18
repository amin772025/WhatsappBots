import { runUtility } from "./_utility-engine.js";
export default { id: "morse", command: "morse", category: "Encoding", description: "Encode Morse code", async execute({ args, reply }) { await runUtility("morse", args, reply); } };
