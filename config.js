module.exports = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    ownerId: process.env.OWNER_ID,
    adminRoles: process.env.ADMIN_ROLES?.split(',').filter(Boolean) || [],
    safeUsers: process.env.SAFE_USERS?.split(',').filter(Boolean) || [],
    guardEnabled: process.env.GUARD_ENABLED === 'true',
    logChannelId: process.env.LOG_CHANNEL_ID,
    limits: {
        roleCreate: parseInt(process.env.MAX_ROLE_CREATE) || 3,
        roleDelete: parseInt(process.env.MAX_ROLE_DELETE) || 3,
        channelCreate: parseInt(process.env.MAX_CHANNEL_CREATE) || 5,
        channelDelete: parseInt(process.env.MAX_CHANNEL_DELETE) || 5,
        ban: parseInt(process.env.MAX_BAN) || 3,
        kick: parseInt(process.env.MAX_KICK) || 3,
        messageSpam: parseInt(process.env.MAX_MESSAGE_SPAM) || 5,
        urlSpam: parseInt(process.env.MAX_URL_SPAM) || 3,
        mentionSpam: parseInt(process.env.MAX_MENTION_SPAM) || 2,
        emojiSpam: parseInt(process.env.MAX_EMOJI_SPAM) || 3,
        inviteSpam: parseInt(process.env.MAX_INVITE_SPAM) || 2,
        webhookCreate: parseInt(process.env.MAX_WEBHOOK_CREATE) || 2,
        guildUpdate: parseInt(process.env.MAX_GUILD_UPDATE) || 3,
        emojiDelete: parseInt(process.env.MAX_EMOJI_DELETE) || 3,
        stickerDelete: parseInt(process.env.MAX_STICKER_DELETE) || 3
    },
    whitelistedBots: process.env.WHITELISTED_BOTS?.split(',').filter(Boolean) || [],
    trackDuration: 10000 // 10 seconds
};
