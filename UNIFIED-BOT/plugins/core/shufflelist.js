import { runUtility } from "./_utility-engine.js";
export default { id: "shufflelist", command: "shufflelist", category: "Tools", description: "Shuffle lines", async execute({ args, reply }) { await runUtility("shufflelist", args, reply); } };
