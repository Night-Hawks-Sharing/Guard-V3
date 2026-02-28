const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function loadCommands(client) {
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    
    if (!fs.existsSync(commandsPath)) {
        fs.mkdirSync(commandsPath, { recursive: true });
    }
    
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`✅ Komut yüklendi: ${command.data.name}`);
        } else {
            console.log(`⚠️ Hatalı komut dosyası: ${file}`);
        }
    }
    
    // Register slash commands
    if (commands.length > 0) {
        const rest = new REST().setToken(client.config.token);
        
        try {
            console.log(`🔄 ${commands.length} slash komut kaydediliyor...`);
            
            const data = await rest.put(
                Routes.applicationGuildCommands(client.config.clientId, client.config.guildId),
                { body: commands }
            );
            
            console.log(`✅ ${data.length} slash komut başarıyla kaydedildi!`);
        } catch (error) {
            console.error('Slash komut kayıt hatası:', error);
        }
    }
}

module.exports = { loadCommands };
