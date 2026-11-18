import { getUser, saveUser } from '../../lib/rpg.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

export default {
    command: ['afk'],
    category: 'rpg',
    execute: async (denn, m, { text }) => {
        const user = getUser(m.sender);
        const reason = text ? text.trim() : 'Tanpa Alasan';
        
        // Simpan timestamp dan alasan
        user.afk = true;
        user.afkTime = Date.now();
        user.afkReason = reason;
        saveUser(m.sender, user);

        const caption = `😴 *@${m.sender.split('@')[0]} sekarang sedang AFK!*\n\n` +
                        `📝 *Alasan:* ${reason}\n` +
                        `💤 _Jangan tag dia sampai kembali online ya!_`;

        await sendFakeQuoted(denn, m, caption, {
            title: 'AFK Mode Aktif',
            body: `Alasan: ${reason}`,
            mentions: [m.sender]
        });
    }
};