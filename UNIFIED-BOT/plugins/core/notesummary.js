import { runUtility } from "./_utility-engine.js";
export default { id: "notesummary", command: "notesummary", category: "Education", description: "Format study notes", async execute({ args, reply }) { await runUtility("notesummary", args, reply); } };
