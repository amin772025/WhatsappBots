const ENDPOINT = "https://text.pollinations.ai/openai";
const SYSTEM = "You are Amin Unified Bot assistant. Reply clearly and concisely. Match the user's language. Do not claim to have performed actions or accessed private data.";
const prompts = {
  ai: "Answer the user's request.",
  gpt: "Answer the user's request as a helpful general assistant.",
  deepseek: "Solve the user's request carefully, showing a concise explanation.",
  bing: "Answer using your general knowledge. If uncertain, say so and do not invent sources.",
  explain: "Explain the following topic simply, with an example when useful.",
  summarize: "Summarize the following text into clear key points.",
  translateai: "Translate the following text while preserving its meaning and tone."
};
export default Object.entries(prompts).map(([command, instruction]) => ({
  id: "ai-" + command, command,
  aliases: command === "translateai" ? ["aitranslate"] : command === "summarize" ? ["sumai"] : [],
  category: "AI", description: "AI assistant: " + command,
  async execute({ reply, args }) {
    const prompt = args.join(" ").trim();
    if (!prompt || prompt.length > 5000) { await reply("اكتب سؤالك بعد الأمر (حتى 5000 حرف)."); return; }
    await reply("⏳ جاري تجهيز الرد...");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [{ role: "system", content: SYSTEM + " " + instruction }, { role: "user", content: prompt }],
          temperature: 0.6
        }),
        signal: AbortSignal.timeout(45000)
      });
      if (!response.ok) throw new Error("خدمة الذكاء الاصطناعي غير متاحة حاليًا (" + response.status + ").");
      const data = await response.json();
      const answer = data?.choices?.[0]?.message?.content;
      if (typeof answer !== "string" || !answer.trim()) throw new Error("لم يصل رد صالح من الخدمة.");
      await reply(answer.trim().slice(0, 12000));
    } catch (error) {
      await reply(error.name === "TimeoutError" ? "انتهت مهلة طلب AI. حاول مرة أخرى." : error.message || "تعذر الاتصال بخدمة AI.");
    }
  }
}));