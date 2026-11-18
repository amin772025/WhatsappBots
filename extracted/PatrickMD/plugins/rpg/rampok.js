import { getUser, formatMoney } from '../../lib/rpg.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

export default {
    command: ['rampok', 'rob'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { prefix }) => {
        const user = getUser(m.sender);
        
        if (user.jailUntil && user.jailUntil > Date.now()) {
            const sisa = Math.ceil((user.jailUntil - Date.now()) / 60000);
            return sendFakeQuoted(denn, m, `🚔 Kamu masih di penjara!\n\nTunggu *${sisa} menit* lagi atau ketik \`${prefix}tebus\` untuk menyuap polisi (Rp 50.000).`);
        }

        let target = m.mentionedJid?.[0] || m.quoted?.sender;
        
        if (!target) {
            return sendFakeQuoted(denn, m, `❌ Tag atau reply orang yang mau kamu rampok.\n\nContoh: \`${prefix}rampok @user\``);
        }

        if (target === m.sender) {
            return sendFakeQuoted(denn, m, '❌ Kamu tidak bisa merampok diri sendiri.');
        }

        if (target === denn.user.id || target === denn.user.lid) {
            return sendFakeQuoted(denn, m, '❌ Kamu tidak bisa merampok bot.');
        }

        const targetUser = getUser(target);
        const targetMoney = targetUser.money || 0;

        if (targetMoney < 1000) {
            return sendFakeQuoted(denn, m, `❌ @${target.split('@')[0]} terlalu miskin untuk dirampok (Uang di dompet < Rp 1.000).`, { mentions: [target] });
        }

        if (Math.random() < 0.5) {
            const stolen = Math.floor(targetMoney * (Math.random() * 0.15 + 0.1));
            
            user.money = (user.money || 0) + stolen;
            targetUser.money -= stolen;

            if (!user.wanted) user.wanted = { level: 0, money: 0, xp: 0 };
            user.wanted.level += 1;
            user.wanted.money += 10000;
            user.wanted.xp += 50;

            saveDatabase();

            await sendFakeQuoted(denn, m, 
                `🚔 *PERAMPOKAN BERHASIL!*\n\n` +
                `Kamu berhasil merampok @${target.split('@')[0]}!\n\n` +
                `💰 *Uang didapat:* ${formatMoney(stolen)}\n` +
                `💳 *Uangmu sekarang:* ${formatMoney(user.money)}\n\n` +
                `⚠️ *WANTED LEVEL:* ${user.wanted.level}\n` +
                `_Bounty kamu sekarang: ${formatMoney(user.wanted.money)} & ${user.wanted.xp} XP_`,
                { mentions: [target], title: 'Aksi Rampok', body: 'Sukses' }
            );
        } else {
            user.jailUntil = Date.now() + (10 * 60 * 1000);
            saveDatabase();

            await sendFakeQuoted(denn, m, 
                `🚨 *PERAMPOKAN GAGAL!*\n\n` +
                `Aksimu ketahuan warga! Kamu ditangkap polisi dan dipenjara selama *10 menit*.\n\n` +
                `💸 *Opsi Bebas:* Ketik \`${prefix}tebus\` untuk menyuap polisi sebesar *Rp 50.000*.\n\n` +
                `_Selama di penjara, kamu tidak bisa menggunakan fitur RPG._`,
                { title: 'Aksi Rampok', body: 'Gagal & Dipenjara' }
            );
        }
    }
};