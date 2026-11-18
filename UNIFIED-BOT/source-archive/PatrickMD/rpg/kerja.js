import { getUser, formatMoney } from '../../lib/rpg.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

const COOLDOWN = 5 * 60 * 1000;

const JOBS = {
    kurir:   { name: 'Kurir Paket', emoji: '📦', minMoney: 2000, maxMoney: 5000, minXp: 10, maxXp: 20 },
    ojek:    { name: 'Tukang Ojek', emoji: '🏍️', minMoney: 2500, maxMoney: 6000, minXp: 12, maxXp: 25 },
    kuli:    { name: 'Kuli Bangunan', emoji: '🧱', minMoney: 3000, maxMoney: 7000, minXp: 15, maxXp: 30 },
    barista: { name: 'Barista Kafe', emoji: '☕', minMoney: 3500, maxMoney: 8000, minXp: 18, maxXp: 35 },
    montir:  { name: 'Montir Bengkel', emoji: '🔧', minMoney: 4000, maxMoney: 9000, minXp: 20, maxXp: 40 },
    petani:  { name: 'Petani Sayur', emoji: '🌾', minMoney: 1500, maxMoney: 4500, minXp: 8, maxXp: 15 }
};

export default {
    command: ['kerja', 'work'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { args, prefix }) => {
        const user = getUser(m.sender);
        const jobType = args[0]?.toLowerCase();

        if (!jobType) {
            let text = `╭───「 *D A F T A R  K E R J A* 」───╮\n\n`;
            for (const [id, job] of Object.entries(JOBS)) {
                text += `│ ${job.emoji} *${job.name}* (\`${prefix}kerja ${id}\`)\n`;
                text += `│    💰 Gaji: ${formatMoney(job.minMoney)} - ${formatMoney(job.maxMoney)}\n`;
            }
            text += `╰─────────────────\n\n`;
            text += `_Bekerja membutuhkan tenaga. Health akan berkurang 5-15 per kerja._`;
            return sendFakeQuoted(denn, m, text, { title: 'Pusat Lowongan Kerja', body: 'Pilih Profesimu' });
        }

        const job = JOBS[jobType];
        if (!job) {
            return sendFakeQuoted(denn, m, `❌ Profesi *${jobType}* tidak tersedia.\nKetik \`${prefix}kerja\` untuk melihat daftar profesi.`);
        }

        if ((user.health || 100) < 20) {
            return sendFakeQuoted(denn, m, `❌ Health kamu terlalu rendah (${user.health || 100}/100).\n_Beli ramuan di \`${prefix}shop\` untuk memulihkan._`);
        }

        const now = Date.now();
        const lastWork = user.lastKerja || 0;

        if (now - lastWork < COOLDOWN) {
            const sisa = Math.ceil((COOLDOWN - (now - lastWork)) / 60000);
            return sendFakeQuoted(denn, m, `⏳ Kamu masih kelelahan.\n\nTunggu *${sisa} menit* lagi sebelum bekerja.`);
        }

        const rewardMoney = Math.floor(Math.random() * (job.maxMoney - job.minMoney + 1)) + job.minMoney;
        const rewardXp = Math.floor(Math.random() * (job.maxXp - job.minXp + 1)) + job.minXp;
        const healthCost = Math.floor(Math.random() * 11) + 5;
        
        let rewardLimit = 0;
        if (Math.random() < 0.15) {
            rewardLimit = 1;
            user.limit = (user.limit || 0) + rewardLimit;
        }

        user.money = (user.money || 0) + rewardMoney;
        user.xp = (user.xp || 0) + rewardXp;
        user.health = Math.max(0, (user.health || 100) - healthCost);
        user.lastKerja = now;

        saveDatabase();

        let text = `✅ *PEKERJAAN SELESAI*\n\n`;
        text += `Kamu telah bekerja sebagai *${job.name}* ${job.emoji}\n\n`;
        text += `💰 *Gaji:* +${formatMoney(rewardMoney)}\n`;
        text += `✨ *EXP:* +${rewardXp}\n`;
        text += `❤️ *Health:* -${healthCost} (Sisa: ${user.health})\n`;
        
        if (rewardLimit > 0) {
            text += `🎟️ *Bonus:* +${rewardLimit} Limit!\n`;
        }

        text += `\n_Ketik \`${prefix}profile\` untuk melihat total hartamu._`;

        await sendFakeQuoted(denn, m, text, { title: 'Hasil Kerja', body: 'Gajian!' });
    }
};