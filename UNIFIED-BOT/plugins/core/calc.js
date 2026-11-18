import { evaluateArithmetic } from "../../core/math/evaluator.js";

export default {
  id: "calc",
  command: "calc",
  aliases: ["math"],
  category: "Tools",
  description: "Calculate a basic arithmetic expression",
  async execute({ reply, args, config }) {
    try {
      const result = evaluateArithmetic(args.join(" "));
      const text = config.language === "ar" ? `الناتج: ${result}` : `Result: ${result}`;
      await reply(text);
    } catch (error) {
      await reply(config.language === "ar"
        ? `عملية غير صالحة: ${error.message}`
        : `Invalid expression: ${error.message}`);
    }
  }
};
