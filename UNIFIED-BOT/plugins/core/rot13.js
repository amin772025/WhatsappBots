import { runUtility } from "./_utility-engine.js";
export default { id: "rot13", command: "rot13", category: "Encoding", description: "Apply ROT13", async execute({ args, reply }) { await runUtility("rot13", args, reply); } };
