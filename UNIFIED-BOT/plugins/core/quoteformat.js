import { runUtility } from "./_utility-engine.js";
export default { id: "quoteformat", command: "quoteformat", category: "Encoding", description: "Format as a quote", async execute({ args, reply }) { await runUtility("quoteformat", args, reply); } };
