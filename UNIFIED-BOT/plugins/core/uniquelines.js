import { runUtility } from "./_utility-engine.js";
export default { id: "uniquelines", command: "uniquelines", category: "Text", description: "Remove duplicate lines", async execute({ args, reply }) { await runUtility("uniquelines", args, reply); } };
