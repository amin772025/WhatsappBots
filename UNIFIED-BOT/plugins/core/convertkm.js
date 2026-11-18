import { runUtility } from "./_utility-engine.js";
export default { id: "convertkm", command: "convertkm", category: "Math", description: "Kilometers to miles", async execute({ args, reply }) { await runUtility("convertkm", args, reply); } };
