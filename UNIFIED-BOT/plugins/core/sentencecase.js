import { runUtility } from "./_utility-engine.js";
export default { id: "sentencecase", command: "sentencecase", category: "Text", description: "Convert text to sentence case", async execute({ args, reply }) { await runUtility("sentencecase", args, reply); } };
