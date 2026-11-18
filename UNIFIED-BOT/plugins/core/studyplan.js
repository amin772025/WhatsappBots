import { runUtility } from "./_utility-engine.js";
export default { id: "studyplan", command: "studyplan", category: "Education", description: "Simple study plan", async execute({ args, reply }) { await runUtility("studyplan", args, reply); } };
