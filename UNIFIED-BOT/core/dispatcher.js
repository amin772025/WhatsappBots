export function createDispatcher({ config, permissions, registry, send }) {
  if (!config || !permissions || !registry || typeof send !== "function") {
    throw new TypeError("Dispatcher requires config, permissions, registry and send()");
  }

  return async function dispatch(message, context = {}) {
    if (!message || typeof message.text !== "string") return { status: "ignored" };
    if (!permissions.canUseBot(message)) return { status: "private-mode" };

    const prefix = config.prefix;
    if (!message.text.startsWith(prefix)) return { status: "not-command" };
    const body = message.text.slice(prefix.length).trim();
    if (!body) return { status: "empty-command" };

    const [rawCommand, ...args] = body.split(/\s+/);
    const command = rawCommand.toLocaleLowerCase();
    const plugin = registry.resolve(command);
    if (!plugin) return { status: "unknown-command", command };

    if (plugin.ownerOnly && !permissions.isOwner(message)) return { status: "forbidden" };
    if (plugin.adminOnly && !permissions.canUseAdminCommand(message)) return { status: "forbidden" };

    await plugin.execute({
      message, args, command, config, permissions, context,
      reply: text => send(message.chatId, String(text), message)
    });
    return { status: "executed", plugin: plugin.id };
  };
}
