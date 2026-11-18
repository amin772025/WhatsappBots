import { runUtility } from "./_utility-engine.js";
export default { id: "triviafact", command: "triviafact", category: "Fun", description: "General knowledge fact", async execute({ args, reply }) { await runUtility("triviafact", args, reply); } };
