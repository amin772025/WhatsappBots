import { runUtility } from "./_utility-engine.js";
export default { id: "swapcase", command: "swapcase", category: "Text", description: "Swap letter case", async execute({ args, reply }) { await runUtility("swapcase", args, reply); } };
