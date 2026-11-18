import { runUtility } from "./_utility-engine.js";
export default { id: "titlecase", command: "titlecase", category: "Text", description: "Convert text to title case", async execute({ args, reply }) { await runUtility("titlecase", args, reply); } };
