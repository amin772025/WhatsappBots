import { getUser, formatMoney } from '../../lib/rpg.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

export default {
    command: ['bounty', 'tangkap', 'buronan'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { prefix }) => {
        const user = getUser(m.sender);
        
        if (user.jailUntil && user.jailUntil > Date.now()) {
            return sendFakeQuoted(denn, m, `🚔 Kamu masih di penjara! Ketik \`${prefix}tebus\` untuk bebas.`);
        }

        let target = m.mentionedJid?.[0] || m.quoted?.sender;
        
        if (!target) {
            let list = `╭───「 *D A F T A R  B U R O N A N* 」───╮\n\n`;
            const users = Object.keys(global.db.users || {});
            let count = 0;

            for (const jid of users) {
                const u = getUser(jid);
                if (u.wanted && u.wanted.level > 0) {
                    count++;
                    list += `│ 👤 @${jid.split('@')[0]}\n`;
                    list += `│    ⚠️ Level: ${u.wanted.level}\n`;
                    list += `│    💰 Bounty: ${formatMoney(u.wanted.money)} & ${u.wanted.xp} XP\n\n`;
                }
            }

            if (count === 0) {
                return sendFakeQuoted(denn, m, '✅ Tidak ada buronan saat ini. Grup aman terkendali.');
            }

            list += `╰─────────────────\n\n`;
            list += `_Tangkap buronan dengan:_\n\`${prefix}bounty @target\``;
            return sendFakeQuoted(denn, m, list, { title: 'Wanted List', body: 'Daftar Buronan' });
        }

        if (target === m.sender) {
            return sendFakeQuoted(denn, m, '❌ Kamu tidak bisa menangkap diri sendiri.');
        }

        const targetUser = getUser(target);
        
        if (!targetUser.wanted || targetUser.wanted.level <= 0) {
            return sendFakeQuoted(denn, m, `❌ @${target.split('@')[0]} bukan buronan.`, { mentions: [target] });
        }

        if (targetUser.jailUntil && targetUser.jailUntil > Date.now()) {
            return sendFakeQuoted(denn, m, `❌ @${target.split('@')[0]} sedang berada di penjara.`, { mentions: [target] });
        }

        const winChance = 0.5 + ((user.level || 1) - (targetUser.level || 1)) * 0.05;
        const finalChance = Math.max(0.1, Math.min(0.9, winChance));

        if (Math.random() < finalChance) {
            const rewardMoney = targetUser.wanted.money;
            const rewardXp = targetUser.wanted.xp;

            user.money = (user.money || 0) + rewardMoney;
            user.xp = (user.xp || 0) + rewardXp;

            targetUser.wanted = { level: 0, money: 0, xp: 0 };
            targetUser.jailUntil = Date.now() + (15 * 60 * 1000);
            targetUser.health = Math.max(10, (targetUser.health || 100) - 50);

            saveDatabase();

            await sendFakeQuoted(denn, m, 
                `🎯 *BURONAN TERTANGKAP!*\n\n` +
                `Kamu berhasil mengalahkan @${target.split('@')[0]}!\n\n` +
                `💰 *Bounty Uang:* ${formatMoney(rewardMoney)}\n` +
                `✨ *Bounty XP:* ${rewardXp}\n\n` +
                `_Target dimasukkan ke penjara selama 15 menit._`,
                { mentions: [target], title: 'Bounty Claimed', body: 'Sukses' }
            );
        } else {
            user.jailUntil = Date.now() + (10 * 60 * 1000);
            user.health = Math.max(10, (user.health || 100) - 50);
            saveDatabase();

            await sendFakeQuoted(denn, m, 
                `💀 *GAGAL MENANGKAP!*\n\n` +
                `@${target.split('@')[0]} terlalu kuat untukmu. Kamu malah dipenjara selama *10 menit*.\n\n` +
                `_Ketik \`${prefix}tebus\` untuk bebas._`,
                { mentions: [target], title: 'Bounty Failed', body: 'Gagal' }
            );
        }
    }
};