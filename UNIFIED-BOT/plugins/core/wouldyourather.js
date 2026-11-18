import { runUtility } from "./_utility-engine.js";
export default { id: "wouldyourather", command: "wouldyourather", category: "Fun", description: "Would-you-rather prompt", async execute({ args, reply }) { await runUtility("wouldyourather", args, reply); } };
