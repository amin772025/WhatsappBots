import { runUtility } from "./_utility-engine.js";
export default { id: "reversewords", command: "reversewords", category: "Text", description: "Reverse word order", async execute({ args, reply }) { await runUtility("reversewords", args, reply); } };
