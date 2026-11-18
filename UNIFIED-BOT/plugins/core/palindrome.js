import { runUtility } from "./_utility-engine.js";
export default { id: "palindrome", command: "palindrome", category: "Text", description: "Check palindrome", async execute({ args, reply }) { await runUtility("palindrome", args, reply); } };
