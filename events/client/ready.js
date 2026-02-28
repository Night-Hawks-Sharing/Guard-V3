module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ ${client.user.tag} aktif!`);
        console.log(`🛡️ Guard V3 Sistemi: ${client.config.guardEnabled ? 'Aktif' : 'Pasif'}`);
        console.log(`📊 ${client.commands.size} komut yüklendi`);
        console.log(`🌐 ${client.guilds.cache.size} sunucuda aktif`);
        
        client.user.setPresence({
            activities: [{ name: 'Night Hawk ❤️ Excode Altyapıları' }],
            status: 'dnd'
        });
    }
};
