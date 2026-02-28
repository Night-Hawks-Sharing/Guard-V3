const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { addUser, removeUser } = require('../utils/whitelistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Güvenli kullanıcı yönetimi')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ekle')
                .setDescription('Kullanıcıyı güvenli listeye ekler')
                .addUserOption(option =>
                    option
                        .setName('kullanıcı')
                        .setDescription('Eklenecek kullanıcı')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('çıkar')
                .setDescription('Kullanıcıyı güvenli listeden çıkarır')
                .addUserOption(option =>
                    option
                        .setName('kullanıcı')
                        .setDescription('Çıkarılacak kullanıcı')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('liste')
                .setDescription('Güvenli kullanıcı listesini gösterir')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction, client) {
        // Only owner can use this command
        if (interaction.user.id !== client.config.ownerId) {
            return interaction.reply({
                content: '❌ Bu komutu sadece sunucu sahibi kullanabilir!',
                ephemeral: true
            });
        }
        
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'ekle') {
            const user = interaction.options.getUser('kullanıcı');
            
            const result = addUser(user.id, client.config.safeUsers);
            
            if (!result.success) {
                return interaction.reply({
                    content: `⚠️ ${user.tag} zaten güvenli listede!`,
                    ephemeral: true
                });
            }
            
            // Update in-memory config
            client.config.safeUsers = result.list;
            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Whitelist - Kullanıcı Eklendi')
                .setDescription(`${user.tag} güvenli listeye eklendi!`)
                .addFields(
                    { name: 'Kullanıcı ID', value: user.id },
                    { name: 'Kullanıcı Adı', value: user.tag },
                    { name: 'Ekleme Zamanı', value: new Date().toLocaleString('tr-TR') }
                )
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: 'Night Hawk ❤️ discord.gg/excode' })
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
        
        if (subcommand === 'çıkar') {
            const user = interaction.options.getUser('kullanıcı');
            
            if (!client.config.safeUsers.includes(user.id)) {
                return interaction.reply({
                    content: `⚠️ ${user.tag} güvenli listede değil!`,
                    ephemeral: true
                });
            }
            
            client.config.safeUsers = client.config.safeUsers.filter(id => id !== user.id);
            
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Whitelist - Kullanıcı Çıkarıldı')
                .setDescription(`${user.tag} güvenli listeden çıkarıldı!`)
                .addFields(
                    { name: 'Kullanıcı ID', value: user.id },
                    { name: 'Kullanıcı Adı', value: user.tag },
                    { name: 'Çıkarma Zamanı', value: new Date().toLocaleString('tr-TR') }
                )
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: 'Night Hawk ❤️ discord.gg/excode' })
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
        
        if (subcommand === 'liste') {
            if (client.config.safeUsers.length === 0) {
                return interaction.reply({
                    content: '📋 Güvenli listede kimse yok!',
                    ephemeral: true
                });
            }
            
            const userList = client.config.safeUsers.map((id, index) => 
                `${index + 1}. <@${id}> (${id})`
            ).join('\n');
            
            const embed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('📋 Whitelist - Güvenli Kullanıcılar')
                .setDescription(userList)
                .setFooter({ text: `Night Hawk ❤️ discord.gg/excode | Toplam ${client.config.safeUsers.length} kullanıcı` })
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
    }
};
