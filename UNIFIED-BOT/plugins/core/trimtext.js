import { runUtility } from "./_utility-engine.js";
export default { id: "trimtext", command: "trimtext", category: "Text", description: "Normalize whitespace", async execute({ args, reply }) { await runUtility("trimtext", args, reply); } };
