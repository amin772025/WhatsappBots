import { runUtility } from "./_utility-engine.js";
export default { id: "pomodoro", command: "pomodoro", category: "Education", description: "Pomodoro guide", async execute({ args, reply }) { await runUtility("pomodoro", args, reply); } };
