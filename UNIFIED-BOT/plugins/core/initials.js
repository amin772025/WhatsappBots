import { runUtility } from "./_utility-engine.js";
export default { id: "initials", command: "initials", category: "Text", description: "Extract initials", async execute({ args, reply }) { await runUtility("initials", args, reply); } };
