import { runUtility } from "./_utility-engine.js";
export default { id: "shortestword", command: "shortestword", category: "Info", description: "Find shortest word", async execute({ args, reply }) { await runUtility("shortestword", args, reply); } };
