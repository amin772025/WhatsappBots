import { runUtility } from "./_utility-engine.js";
export default { id: "uppercase", command: "uppercase", category: "Text", description: "Convert text to uppercase", async execute({ args, reply }) { await runUtility("uppercase", args, reply); } };
