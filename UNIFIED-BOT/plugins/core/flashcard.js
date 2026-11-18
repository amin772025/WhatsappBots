import { runUtility } from "./_utility-engine.js";
export default { id: "flashcard", command: "flashcard", category: "Education", description: "Format flashcard", async execute({ args, reply }) { await runUtility("flashcard", args, reply); } };
