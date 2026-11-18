export function evaluateArithmetic(expression) {
  const source = String(expression ?? "").replace(/\s+/g, "");
  if (!source || source.length > 100) throw new TypeError("Expression must contain 1–100 characters");

  const tokens = source.match(/(?:\d+(?:\.\d*)?|\.\d+|[()+\-*/%])/g) || [];
  if (tokens.join("") !== source) throw new SyntaxError("Only numbers and basic arithmetic operators are allowed");

  let index = 0;
  function primary() {
    const token = tokens[index++];
    if (token === "(") {
      const value = expressionValue();
      if (tokens[index++] !== ")") throw new SyntaxError("Missing closing parenthesis");
      return value;
    }
    if (token === undefined || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token)) {
      throw new SyntaxError("Expected a number");
    }
    const value = Number(token);
    if (!Number.isFinite(value)) throw new RangeError("Number is outside the supported range");
    return value;
  }
  function unary() {
    if (tokens[index] === "+") { index++; return unary(); }
    if (tokens[index] === "-") { index++; return -unary(); }
    return primary();
  }
  function term() {
    let value = unary();
    while (["*", "/", "%"].includes(tokens[index])) {
      const operator = tokens[index++];
      const right = unary();
      if ((operator === "/" || operator === "%") && right === 0) {
        throw new RangeError("Division by zero is not allowed");
      }
      value = operator === "*" ? value * right
        : operator === "/" ? value / right
        : value % right;
    }
    return value;
  }
  function expressionValue() {
    let value = term();
    while (tokens[index] === "+" || tokens[index] === "-") {
      const operator = tokens[index++];
      const right = term();
      value = operator === "+" ? value + right : value - right;
    }
    if (!Number.isFinite(value)) throw new RangeError("Result is outside the supported range");
    return value;
  }

  const result = expressionValue();
  if (index !== tokens.length) throw new SyntaxError("Unexpected token");
  if (!Number.isFinite(result)) throw new RangeError("Result is outside the supported range");
  return result;
}
