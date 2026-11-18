import fs from "node:fs/promises";
import path from "node:path";

const clone = value => structuredClone(value);

export async function createJsonStore({ filePath, initialValue = {} }) {
  if (!filePath) throw new TypeError("A store filePath is required");
  const target = path.resolve(filePath);
  await fs.mkdir(path.dirname(target), { recursive: true });

  let data;
  try {
    data = JSON.parse(await fs.readFile(target, "utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new TypeError("Stored JSON root must be an object");
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw new Error(`Could not load data store at ${target}: ${error.message}`);
    data = clone(initialValue);
  }

  let queue = Promise.resolve();

  async function persist() {
    const temporary = `${target}.${process.pid}.tmp`;
    const serialized = JSON.stringify(data, null, 2) + "\n";
    await fs.writeFile(temporary, serialized, { encoding: "utf8", mode: 0o600 });
    await fs.rename(temporary, target);
  }

  function flush() {
    const operation = queue.then(persist);
    queue = operation.catch(() => {});
    return operation;
  }

  function transact(mutator) {
    if (typeof mutator !== "function") throw new TypeError("Transaction mutator must be a function");
    const operation = queue.then(async () => {
      const result = await mutator(data);
      await persist();
      return result;
    });
    queue = operation.catch(() => {});
    return operation;
  }

  return Object.freeze({
    get filePath() { return target; },
    read() { return clone(data); },
    flush,
    transact
  });
}
