import { runUtility } from "./_utility-engine.js";
export default { id: "riddle", command: "riddle", category: "Fun", description: "Riddle", async execute({ args, reply }) { await runUtility("riddle", args, reply); } };
