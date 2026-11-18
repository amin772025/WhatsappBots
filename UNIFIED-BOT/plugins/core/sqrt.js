import { runUtility } from "./_utility-engine.js";
export default { id: "sqrt", command: "sqrt", category: "Math", description: "Square root", async execute({ args, reply }) { await runUtility("sqrt", args, reply); } };
