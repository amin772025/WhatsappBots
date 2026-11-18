// Source-derived ports from PatrickMD's original plugins.
// Adapted to Amin's unified plugin contract; original files remain unchanged.
// Sources:
// - extracted/PatrickMD/plugins/fun/apakah.js
// - extracted/PatrickMD/plugins/fun/bisakah.js
// - extracted/PatrickMD/plugins/fun/kapankah.js
// - extracted/PatrickMD/plugins/fun/pantun.js
// - extracted/PatrickMD/plugins/info/rules.js
// - extracted/PatrickMD/plugins/islamic/dzikir.js

const pick = items => items[Math.floor(Math.random() * items.length)];
const needsPrompt = (reply, command, args) => args.length
  ? null
  : reply(`Usage: .${command} <your question>`);

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
        "Jalan pagi melihat mentari\\nSinggah sebentar membeli jamu\\nTerus belajar setiap hari\\nPelan-pelan tercapai tujuanmu.",
        "Burung kecil terbang ke taman\\nHinggap sebentar di atas dahan\\nJangan lelah mengejar impian\\nUsaha baik membawa perubahan.",
        "Pergi ke pasar membeli mangga\\nPulangnya lewat tepi telaga\\nJaga semangat dalam berkarya\\nKebaikan tumbuh bersama-sama."
      ];
      return reply(`📜 *PANTUN*\\n\\n${pick(verses)}`);
    }
  },
  {
    id: "src-patrick-botrules",
    command: "botrules",
    aliases: ["peraturanbot"],
    category: "Info",
    description: "Displays basic bot usage rules, ported from PatrickMD.",
    async execute({ reply, config }) {
      return reply(`📜 *BOT RULES — ${config.botName}*\\n\\n1. Jangan spam perintah.\\n2. Hormati anggota dan admin grup.\\n3. Gunakan fitur secara bertanggung jawab.\\n4. Fitur online bergantung pada layanan pihak ketiga.\\n5. Patuhi aturan grup dan hukum yang berlaku.`);
    }
  },
  {
    id: "src-patrick-dzikir",
    command: "dzikir",
    aliases: ["zikir"],
    category: "Islamic",
    description: "Displays a short remembrance checklist, ported from PatrickMD.",
    async execute({ reply }) {
      return reply("📿 *أذكار مختصرة*\\n\\n• آية الكرسي.\\n• سورة الإخلاص والفلق والناس.\\n• سبحان الله.\\n• الحمد لله.\\n• الله أكبر.\\n\\nيمكنك قراءة الأذكار من مصحف أو مصدر موثوق للتأكد من النص والعدد.");
    }
  }
];
