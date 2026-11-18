import { runUtility } from "./_utility-engine.js";
export default { id: "roman", command: "roman", category: "Math", description: "Convert number to Roman numerals", async execute({ args, reply }) { await runUtility("roman", args, reply); } };
