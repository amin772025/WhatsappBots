import { runUtility } from "./_utility-engine.js";
export default { id: "examcountdown", command: "examcountdown", category: "Education", description: "Exam countdown", async execute({ args, reply }) { await runUtility("examcountdown", args, reply); } };
