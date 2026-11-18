import { runUtility } from "./_utility-engine.js";
export default { id: "lowercase", command: "lowercase", category: "Text", description: "Convert text to lowercase", async execute({ args, reply }) { await runUtility("lowercase", args, reply); } };
