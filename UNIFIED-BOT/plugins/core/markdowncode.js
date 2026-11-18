import { runUtility } from "./_utility-engine.js";
export default { id: "markdowncode", command: "markdowncode", category: "Encoding", description: "Wrap Markdown code", async execute({ args, reply }) { await runUtility("markdowncode", args, reply); } };
