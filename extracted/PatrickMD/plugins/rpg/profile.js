import { getUser as getRpgUser, formatMoney } from '../../lib/rpg.js';
import { getUser as getRegUser } from '../../lib/userdb.js';
import { items } from '../../lib/items.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';
import { getJadianGroup, fmtDate } from '../fun/jadian.js';

export default {
    command: ['profile', 'me', 'profil', 'inv', 'inventory', 'tas'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { prefix }) => {
        const rpgUser = getRpgUser(m.sender);
        const regUser = getRegUser(m.sender);

        const displayName = regUser?.name || m.pushName || 'Tanpa Nama';

        let regDate = '-', serial = '-', age = '-';

        if (regUser) {
            serial = regUser.serial;
            age = regUser.age + ' Tahun';
            regDate = new Date(regUser.registeredAt).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
        }

        let text = `╭───「 *USER PROFILE* 」───╮\n\n`;
        text += `👤 *Nama:* ${displayName}\n`;
        text += `🎂 *Umur:* ${age}\n`;
        text += `🆔 *Serial Number:* \`${serial}\`\n`;
        text += `📅 *Terdaftar:* ${regDate}\n\n`;

        text += `╭─────────────────\n`;
        text += `│ 📊 *Level:* ${rpgUser.level || 1}\n`;
        text += `│ ✨ *XP:* ${rpgUser.xp || 0} / ${(rpgUser.level || 1) * 100}\n`;
        text += `│ ❤️ *Health:* ${rpgUser.health || 100}/100\n`;
        text += `│ 💰 *Uang:* ${formatMoney(rpgUser.money || 0)}\n`;
        text += `│ 🏦 *Bank:* ${formatMoney(rpgUser.bank || 0)}\n`;
        text += `│ 🎟️ *Limit:* ${rpgUser.limit || 0}\n`;
        text += `╰─────────────────\n\n`;

        if (rpgUser.wanted && rpgUser.wanted.level > 0) {
            text += `╭───「 *W A N T E D* 」───╮\n`;
            text += `│ 🚨 *Status:* BURONAN\n`;
            text += `│ ⚠️ *Level:* ${rpgUser.wanted.level}\n`;
            text += `│ 💰 *Bounty Uang:* ${formatMoney(rpgUser.wanted.money)}\n`;
            text += `│ ✨ *Bounty XP:* ${rpgUser.wanted.xp}\n`;
            text += `╰─────────────────\n\n`;
        }

        const mentions = [];
        if (m.isGroup) {
            try {
                const jadianGroup = getJadianGroup(m.chat);
                const rel = jadianGroup[m.sender];
                if (rel) {
                    text += `╭───「 *S T A T U S* 」───╮\n`;
                    text += `│ 💑 *Jadian dengan:* @${rel.partner.split('@')[0]}\n`;
                    text += `│ 📅 *Sejak:* ${fmtDate(rel.since)}\n`;
                    text += `╰─────────────────\n\n`;
                    mentions.push(rel.partner);
                }
            } catch (_) {}
        }

        if (rpgUser.pet) {
            const pet = rpgUser.pet;
            const barLength = 10;
            const filled = Math.round(((pet.hunger || 0) / 100) * barLength);
            const hungerBar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

            text += `╭───「 *P E T* 」───╮\n`;
            text += `│ 📛 *Nama:* ${pet.name}\n`;
            text += `│ ${pet.emoji || '🐾'} *Spesies:* ${pet.type}\n`;
            text += `│ ⭐ *Level:* ${pet.level || 1}\n`;
            text += `│ ✨ *EXP:* ${pet.exp || 0} / ${(pet.level || 1) * 100}\n`;
            text += `│ 🍖 *Hunger:* [${hungerBar}] ${pet.hunger || 0}/100\n`;
            text += `╰─────────────────\n\n`;
        }

        text += `╭───「 *I N V E N T O R Y* 」───╮\n`;

        const invKeys = Object.keys(rpgUser.inventory || {});

        if (invKeys.length === 0) {
            text += `│ 🎒 Tas kamu masih kosong!\n`;
            text += `│ Beli barang di toko dengan *.shop*\n`;
        } else {
            let totalItem = 0;
            let itemLines = [];

            for (const [id, qty] of Object.entries(rpgUser.inventory)) {
                if (items[id] && qty > 0) {
                    itemLines.push(`│ 📦 ${items[id].name} (${qty}x)`);
                    totalItem += qty;
                }
            }

            if (itemLines.length > 0) {
                text += itemLines.join('\n') + '\n';
                text += `│\n│ _Total item: ${totalItem}_\n`;
            } else {
                text += `│ 🎒 Tas kamu masih kosong!\n`;
            }
        }

        text += `╰─────────────────\n\n`;
        text += `_Ketik \`${prefix}shop\` untuk membeli barang._`;

        await sendFakeQuoted(denn, m, text, {
            title: 'User Profile',
            body: 'Patrick MD RPG',
            mentions
        });
    }
};