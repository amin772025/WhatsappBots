import { runUtility } from "./_utility-engine.js";
export default { id: "acronym", command: "acronym", category: "Text", description: "Build an acronym", async execute({ args, reply }) { await runUtility("acronym", args, reply); } };
