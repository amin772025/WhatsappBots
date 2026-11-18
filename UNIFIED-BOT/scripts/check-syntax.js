import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ignored = new Set(["node_modules", "sessions", "data"]);
async function walk(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (item.isDirectory() && !ignored.has(item.name)) files.push(...await walk(path.join(directory, item.name)));
    else if (item.isFile() && /\.m?js$/i.test(item.name)) files.push(path.join(directory, item.name));
  }
  return files;
}
const files = await walk(".");
let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(`\\nSyntax error: ${file}\\n${result.stderr || result.stdout}`);
  }
}
if (failed) process.exit(1);
console.log(`Syntax OK: ${files.length} JavaScript files`);
