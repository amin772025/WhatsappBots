import { runUtility } from "./_utility-engine.js";
export default { id: "definitioncard", command: "definitioncard", category: "Education", description: "Format definition card", async execute({ args, reply }) { await runUtility("definitioncard", args, reply); } };
