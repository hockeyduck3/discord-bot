const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    execute (bot, commands) {
        const rest = new REST({
            version: '10'
        }).setToken(process.env.devToken);

        (async () => {
            try {
                if (process.env.guildOnly == 'false') {
                    await rest.put(Routes.applicationCommands(process.env.clientId), {
                        body: commands
                    });

                    console.log('Slash commands have been sent to the Discord API 👍');
                } 
                
                else {
                    await rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), {
                        body: commands
                    });

                    console.log('Slash commands are ready to test 👍');
                }
            } catch (err) {
                console.log(err);
            }
        })();

        console.log('Dev ready and online');
    }
}