// Source-derived ports from PatrickMD's original plugins.
// Adapted to Amin's unified plugin contract; original files remain unchanged.
// Sources:
// - extracted/PatrickMD/plugins/fun/apakah.js
// - extracted/PatrickMD/plugins/fun/bisakah.js
// - extracted/PatrickMD/plugins/fun/kapankah.js
// - extracted/PatrickMD/plugins/fun/pantun.js
// - extracted/PatrickMD/plugins/info/rules.js
// - extracted/PatrickMD/plugins/islamic/dzikir.js
// - extracted/NOX-BOT/NOX-BOT/plugins/بينج.js
// - extracted/NOX-BOT/NOX-BOT/plugins/deen-azan.js
// - extracted/HIROBOT/HIROBOT-main/plugins/group/grouplist.js

const pick = items => items[Math.floor(Math.random() * items.length)];
export default [
  {
    id: "src-patrick-apakah",
    command: "apakah",
    aliases: ["apa"],
    category: "Fun",
    description: "Random yes/no-style answer, ported from PatrickMD.",
    async execute({ args, reply }) {
      if (!args.length) return reply("Usage: .apakah <your question>");
      const answers = ["Ya", "Tidak", "Mungkin", "Sangat mungkin", "Belum tentu", "Coba tanya lagi", "Rahasia", "Pasti"];
      return reply(`🔮 ${pick(answers)}`);
    }
  },
  {
    id: "src-patrick-bisakah",
    command: "bisakah",
    aliases: ["bisa"],
    category: "Fun",
    description: "Random possibility answer, ported from PatrickMD.",
    async execute({ args, reply }) {
      if (!args.length) return reply("Usage: .bisakah <your question>");
      return reply(`✨ ${pick(["Bisa", "Tidak bisa", "Bisa banget", "Mungkin saja", "مع المحاولة ممكن", "الأفضل عدم التسرع"])}`);
    }
  },
  {
    id: "src-patrick-kapankah",
    command: "kapankah",
    aliases: ["kapan"],
    category: "Fun",
    description: "Random time-style answer, ported from PatrickMD.",
    async execute({ args, reply }) {
      if (!args.length) return reply("Usage: .kapankah <your question>");
      return reply(`⏳ ${pick(["قريبًا", "غدًا", "الأسبوع القادم", "بعد فترة", "عندما يحين الوقت", "بعد 3 أيام", "لا أحد يعلم"])}`);
    }
  },
  {
    id: "src-patrick-pantun",
    command: "pantun",
    category: "Fun",
    description: "Random short pantun, ported from PatrickMD.",
    async execute({ reply }) {
      const verses = [
        "Jalan pagi melihat mentari\nSinggah sebentar membeli jamu\nTerus belajar setiap hari\nPelan-pelan tercapai tujuanmu.",
        "Burung kecil terbang ke taman\nHinggap sebentar di atas dahan\nJangan lelah mengejar impian\nUsaha baik membawa perubahan.",
        "Pergi ke pasar membeli mangga\nPulangnya lewat tepi telaga\nJaga semangat dalam berkarya\nKebaikan tumbuh bersama-sama."
      ];
      return reply(`📜 *PANTUN*\n\n${pick(verses)}`);
    }
  },
  {
    id: "src-patrick-botrules",
    command: "botrules",
    aliases: ["peraturanbot"],
    category: "Info",
    description: "Displays basic bot usage rules, ported from PatrickMD.",
    async execute({ reply, config }) {
      return reply(`📜 *BOT RULES — ${config.botName}*\n\n1. Jangan spam perintah.\n2. Hormati anggota dan admin grup.\n3. Gunakan fitur secara bertanggung jawab.\n4. Fitur online bergantung pada layanan pihak ketiga.\n5. Patuhi aturan grup dan hukum yang berlaku.`);
    }
  },
  {
    id: "src-patrick-dzikir",
    command: "dzikir",
    aliases: ["zikir"],
    category: "Islamic",
    description: "Displays a short remembrance checklist, ported from PatrickMD.",
    async execute({ reply }) {
      return reply("📿 *أذكار مختصرة*\n\n• آية الكرسي.\n• سورة الإخلاص والفلق والناس.\n• سبحان الله.\n• الحمد لله.\n• الله أكبر.\n\nيمكنك قراءة الأذكار من مصحف أو مصدر موثوق للتأكد من النص والعدد.");
    }
  },
  {
    id: "src-nox-sysinfo",
    command: "sysinfo",
    aliases: ["systeminfo"],
    category: "Info",
    description: "Shows live process, memory and host information, ported from NOX.",
    ownerOnly: true,
    async execute({ reply }) {
      const os = await import("node:os");
      const used = process.memoryUsage();
      const total = os.totalmem();
      const free = os.freemem();
      const fmt = n => `${(n / 1024 / 1024).toFixed(1)} MB`;
      return reply(`🖥️ *SYSTEM STATUS*\nUptime: ${(process.uptime()/3600).toFixed(2)} hours\nRAM used: ${fmt(total-free)} / ${fmt(total)}\nNode heap: ${fmt(used.heapUsed)} / ${fmt(used.heapTotal)}\nCPU cores: ${os.cpus().length}\nPlatform: ${os.platform()} ${os.arch()}\nNode: ${process.version}`);
    }
  },
  {
    id: "src-nox-prayer-times",
    command: "prayer-times",
    aliases: ["awqat-salah"],
    category: "Islamic",
    description: "Fetches today's Cairo prayer times on demand; adapted from NOX's azan feature without group-wide auto-messaging.",
    async execute({ reply }) {
      const date = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date()).replaceAll("/", "-");
      const url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=Cairo&country=Egypt&method=5`;
      const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) return reply(`Prayer-time service returned HTTP ${response.status}.`);
      const payload = await response.json();
      const times = payload?.data?.timings;
      if (!times) return reply("Prayer times are unavailable right now.");
      return reply(`🕌 *مواقيت الصلاة — القاهرة*\nالفجر: ${times.Fajr}\nالظهر: ${times.Dhuhr}\nالعصر: ${times.Asr}\nالمغرب: ${times.Maghrib}\nالعشاء: ${times.Isha}\n\nالمصدر: AlAdhan API`);
    }
  },
  {
    id: "src-hirobot-groups",
    command: "groups",
    aliases: ["grouplist"],
    category: "Info",
    description: "Lists groups the linked bot account currently participates in, ported from HIROBOT.",
    ownerOnly: true,
    async execute({ reply, context }) {
      const socket = context?.runtime?.provider?.socket;
      if (typeof socket?.groupFetchAllParticipating !== "function") return reply("The connected WhatsApp provider does not expose group listing.");
      const groups = await socket.groupFetchAllParticipating();
      const entries = Object.entries(groups || {}).map(([jid, group]) => `${group.subject || "Unnamed group"} — ${jid}`);
      return reply(entries.length ? `*Joined groups (${entries.length})*\n\n${entries.slice(0, 60).join("\n")}` : "No joined groups found.");
    }
  }
];
