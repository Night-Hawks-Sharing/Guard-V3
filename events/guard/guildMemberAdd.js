const { isSafe, punishUser } = require('../../utils/guardUtils');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        if (!client.config.guardEnabled) return;
        if (!member.user.bot) return;
        
        // Check if bot is whitelisted
        if (client.config.whitelistedBots.includes(member.id)) return;
        
        try {
            const auditLogs = await member.guild.fetchAuditLogs({
                type: 28, // BOT_ADD
                limit: 1
            });
            
            const botAddLog = auditLogs.entries.first();
            if (!botAddLog) return;
            
            const executor = botAddLog.executor;
            const executorMember = await member.guild.members.fetch(executor.id).catch(() => null);
            
            // Her zaman log at
            await client.logger.logBotAdd(member.guild, member, executor);
            
            if (isSafe(executorMember, client.config)) return;
            
            // Kick the bot
            await member.kick('[GUARD V3] Yetkisiz bot ekleme').catch(() => {});
            
            // Punish the user who added the bot
            await punishUser(member.guild, executor.id, 'Yetkisiz bot ekleme girişimi', client.config);
            
            await client.logger.logSpamDetection(member.guild, executor, 'bot', 1);
        } catch (error) {
            console.error('Bot koruma hatası:', error);
        }
    }
};
