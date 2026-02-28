const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guard')
        .setDescription('Guard sistemi yönetimi')
        .addSubcommand(subcommand =>
            subcommand
                .setName('durum')
                .setDescription('Guard sisteminin durumunu gösterir')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('aç')
                .setDescription('Guard sistemini açar')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('kapat')
                .setDescription('Guard sistemini kapatır')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        
        // Check if user is owner or has admin role
        const isOwner = interaction.user.id === client.config.ownerId;
        const hasAdminRole = client.config.adminRoles.some(roleId => 
            interaction.member.roles.cache.has(roleId)
        );
        
        if (!isOwner && !hasAdminRole) {
            return interaction.reply({
                content: '❌ Bu komutu kullanmak için yetkiniz yok!',
                ephemeral: true
            });
        }

        if (subcommand === 'durum') {
            const embed = new EmbedBuilder()
                .setColor(client.config.guardEnabled ? '#00FF00' : '#FF0000')
                .setTitle('🛡️ Guard V3 - Sistem Durumu')
                .setDescription(client.config.guardEnabled ? '✅ Guard sistemi aktif ve sunucunuzu koruyor!' : '❌ Guard sistemi şu anda pasif!')
                .addFields(
                    { name: 'Durum', value: client.config.guardEnabled ? '✅ Aktif' : '❌ Pasif', inline: true },
                    { name: 'Log Kanalı', value: client.config.logChannelId ? `<#${client.config.logChannelId}>` : '❌ Ayarlanmamış', inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: '📊 Koruma Limitleri', value: '10 saniye içinde:', inline: false },
                    { name: 'Rol Oluşturma', value: `${client.config.limits.roleCreate}`, inline: true },
                    { name: 'Rol Silme', value: `${client.config.limits.roleDelete}`, inline: true },
                    { name: 'Kanal Oluşturma', value: `${client.config.limits.channelCreate}`, inline: true },
                    { name: 'Kanal Silme', value: `${client.config.limits.channelDelete}`, inline: true },
                    { name: 'Yasaklama', value: `${client.config.limits.ban}`, inline: true },
                    { name: 'Atma', value: `${client.config.limits.kick}`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: '💬 Mesaj Korumaları', value: `Mesaj: ${client.config.limits.messageSpam} | URL: ${client.config.limits.urlSpam} | Mention: ${client.config.limits.mentionSpam}`, inline: false },
                    { name: '🎨 Sunucu Korumaları', value: `Emoji: ${client.config.limits.emojiDelete} | Sticker: ${client.config.limits.stickerDelete} | Webhook: ${client.config.limits.webhookCreate}`, inline: false }
                )
                .setFooter({ text: 'Night Hawk ❤️ discord.gg/excode' })
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
        
        if (subcommand === 'aç') {
            if (client.config.guardEnabled) {
                return interaction.reply({
                    content: '⚠️ Guard sistemi zaten aktif!',
                    ephemeral: true
                });
            }
            
            client.config.guardEnabled = true;
            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🛡️ Guard V3 - Sistem Açıldı')
                .setDescription('Guard koruma sistemi başarıyla aktif edildi!')
                .addFields(
                    { name: '✅ Durum', value: 'Aktif' },
                    { name: '🛡️ Koruma Türü', value: '17 farklı koruma' },
                    { name: '⏰ Aktif Edilme', value: new Date().toLocaleString('tr-TR') }
                )
                .setFooter({ text: 'Night Hawk ❤️ discord.gg/excode' })
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
        
        if (subcommand === 'kapat') {
            if (!client.config.guardEnabled) {
                return interaction.reply({
                    content: '⚠️ Guard sistemi zaten pasif!',
                    ephemeral: true
                });
            }
            
            client.config.guardEnabled = false;
            
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🛡️ Guard V3 - Sistem Kapatıldı')
                .setDescription('Guard koruma sistemi devre dışı bırakıldı!')
                .addFields(
                    { name: '❌ Durum', value: 'Pasif' },
                    { name: '⚠️ Uyarı', value: 'Sunucu artık korumasız!' },
                    { name: '⏰ Kapatılma', value: new Date().toLocaleString('tr-TR') }
                )
                .setFooter({ text: 'Night Hawk ❤️ discord.gg/excode' })
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
    }
};
