import { runUtility } from "./_utility-engine.js";
export default { id: "passwordgen", command: "passwordgen", category: "Tools", description: "Generate random password", async execute({ args, reply }) { await runUtility("passwordgen", args, reply); } };
