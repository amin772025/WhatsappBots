import { runUtility } from "./_utility-engine.js";
export default { id: "acrostic", command: "acrostic", category: "Fun", description: "Create acrostic", async execute({ args, reply }) { await runUtility("acrostic", args, reply); } };
