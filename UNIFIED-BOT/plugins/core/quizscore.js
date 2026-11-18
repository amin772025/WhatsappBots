import { runUtility } from "./_utility-engine.js";
export default { id: "quizscore", command: "quizscore", category: "Education", description: "Calculate quiz score", async execute({ args, reply }) { await runUtility("quizscore", args, reply); } };
