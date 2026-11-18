import { runUtility } from "./_utility-engine.js";
export default { id: "paragraphcount", command: "paragraphcount", category: "Text", description: "Count paragraphs", async execute({ args, reply }) { await runUtility("paragraphcount", args, reply); } };
