import { getUser, formatMoney } from '../../lib/rpg.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

const COOLDOWN = 5 * 60 * 1000; // 5 Menit

export default {
    command: ['hunt', 'huntpet', 'berburu'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m) => {
        const user = getUser(m.sender);

        if (!user.pet) {
            return sendFakeQuoted(denn, m, '❌ Kamu belum punya peliharaan. Ketik `.adoptpet` dulu.');
        }

        if (user.pet.hunger < 20) {
            return sendFakeQuoted(denn, m, `❌ *${user.pet.name}* kelaparan dan tidak punya tenaga untuk berburu.\n_Beri makan dulu dengan \`.feed\`_`);
        }

        const now = Date.now();
        const timePassed = now - (user.pet.lastHunt || 0);

        if (timePassed < COOLDOWN) {
            const sisa = Math.ceil((COOLDOWN - timePassed) / 60000);
            return sendFakeQuoted(denn, m, `⏳ *${user.pet.name}* masih kelelahan.\n\nTunggu *${sisa} menit* lagi.`);
        }

        user.pet.lastHunt = now;
        user.pet.hunger -= 20;

        const minMoney = user.pet.level * 500;
        const maxMoney = user.pet.level * 1500;
        const rewardMoney = Math.floor(Math.random() * (maxMoney - minMoney + 1)) + minMoney;
        
        const rewardExp = Math.floor(Math.random() * 20) + 10;

        user.money = (user.money || 0) + rewardMoney;
        user.pet.exp += rewardExp;

        let levelUpText = '';
        let expNeeded = user.pet.level * 100;
        
        if (user.pet.exp >= expNeeded) {
            user.pet.level += 1;
            user.pet.exp -= expNeeded;
            levelUpText = `\n\n🎊 *LEVEL UP!* ${user.pet.name} naik ke Level ${user.pet.level}!`;
        }

        saveDatabase();

        const text = 
            `🌲 *BERBURU SELESAI!*\n\n` +
            `*${user.pet.name}* ${user.pet.emoji} berhasil menemukan harta karun!\n\n` +
            `💰 *Dapat Uang:* ${formatMoney(rewardMoney)}\n` +
            `✨ *Dapat EXP:* ${rewardExp}\n` +
            `🍖 *Hunger sisa:* ${user.pet.hunger}/100` +
            levelUpText;

        await sendFakeQuoted(denn, m, text, { title: 'Berburu Pet', body: 'Hasil Berburu' });
    }
};