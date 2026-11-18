import { runUtility } from "./_utility-engine.js";
export default { id: "wordfrequency", command: "wordfrequency", category: "Info", description: "Word frequency", async execute({ args, reply }) { await runUtility("wordfrequency", args, reply); } };
