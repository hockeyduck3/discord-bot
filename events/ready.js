const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();

let token;

module.exports = {
    name: 'ready',
    once: true,
    execute (bot, commands) {
        if (!process.env.devMode) {
            token = process.env.token;
        } else {
            token = process.env.devToken;
        }

        const rest = new REST({
            version: '10'
        }).setToken(token);

        (async () => {
            try {
                if (!process.env.devMode) {
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

        console.log((!process.env.devMode ? 'Tilly Online and ready to go!' : 'Dev Mode online and ready to test!'));
    }
}