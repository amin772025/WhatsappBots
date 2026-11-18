import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const COMMAND_RE = /^[\p{L}\p{N}_-]{1,40}$/u;

function normalizeCommands(value, { allowEmpty = false } = {}) {
  const list = Array.isArray(value) ? value : [value];
  const commands = list.map(item => String(item).trim().toLocaleLowerCase()).filter(Boolean);
  if ((!allowEmpty && !commands.length) || commands.some(command => !COMMAND_RE.test(command))) {
    throw new TypeError("Plugin commands must be 1–40 letters, digits, _ or -");
  }
  return [...new Set(commands)];
}

export class PluginRegistry {
  #plugins = new Map();
  #aliases = new Map();

  get size() { return this.#plugins.size; }

  register(plugin, source = "builtin") {
    if (!plugin || typeof plugin !== "object" || typeof plugin.execute !== "function") {
      throw new TypeError("Plugin must export an object with an execute function");
    }
    const commands = normalizeCommands(plugin.command);
    const id = String(plugin.id || commands[0]).trim();
    if (!id) throw new TypeError("Plugin id is required");
    if (this.#plugins.has(id)) throw new Error(`Duplicate plugin id: ${id}`);

    const aliases = normalizeCommands(plugin.aliases ?? [], { allowEmpty: true });
    for (const command of [...commands, ...aliases]) {
      if (this.#aliases.has(command)) throw new Error(`Duplicate command: ${command}`);
    }
    const entry = Object.freeze({
      id, commands, aliases,
      category: String(plugin.category || "general"),
      description: String(plugin.description || ""),
      ownerOnly: Boolean(plugin.ownerOnly),
      adminOnly: Boolean(plugin.adminOnly),
      execute: plugin.execute,
      source
    });
    this.#plugins.set(id, entry);
    for (const command of [...commands, ...aliases]) this.#aliases.set(command, entry);
    return entry;
  }

  resolve(command) {
    return this.#aliases.get(String(command ?? "").toLocaleLowerCase()) ?? null;
  }

  list() {
    return [...this.#plugins.values()];
  }

  async loadDirectory(directory) {
    const root = path.resolve(directory);
    const discovered = [];
    async function walk(current) {
      for (const item of await readdir(current, { withFileTypes: true })) {
        const full = path.resolve(current, item.name);
        if (!full.startsWith(root + path.sep)) continue;
        if (item.isDirectory()) await walk(full);
        else if (item.isFile() && !item.name.startsWith("_") && /\.m?js$/i.test(item.name)) discovered.push(full);
      }
    }
    await walk(root);
    discovered.sort();
    const loaded = [];
    for (const file of discovered) {
      const module = await import(pathToFileURL(file).href);
      const plugin = module.default;
      if (Array.isArray(plugin)) {
        for (const item of plugin) loaded.push(this.register(item, file));
      } else {
        loaded.push(this.register(plugin, file));
      }
    }
    return loaded;
  }
}
