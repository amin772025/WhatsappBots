import test from "node:test";
import assert from "node:assert/strict";
import { evaluateArithmetic } from "../core/math/evaluator.js";

test("arithmetic evaluator respects precedence and parentheses", () => {
  assert.equal(evaluateArithmetic("2 + 3 * 4"), 14);
  assert.equal(evaluateArithmetic("(2 + 3) * 4"), 20);
  assert.equal(evaluateArithmetic("-5 + 2.5"), -2.5);
  assert.equal(evaluateArithmetic("10 % 4"), 2);
});

test("arithmetic evaluator rejects code, invalid tokens and division by zero", () => {
  assert.throws(() => evaluateArithmetic("process.exit()"), /Only numbers/);
  assert.throws(() => evaluateArithmetic("1 / 0"), /Division by zero/);
  assert.throws(() => evaluateArithmetic("2 +"), /Expected a number/);
  assert.throws(() => evaluateArithmetic("1".repeat(101)), /100 characters/);
});
