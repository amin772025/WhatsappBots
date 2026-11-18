import { runUtility } from "./_utility-engine.js";
export default { id: "rhymehint", command: "rhymehint", category: "Fun", description: "Rhyme hints", async execute({ args, reply }) { await runUtility("rhymehint", args, reply); } };
