const fs = require('fs');

module.exports = (bot, Discord) => {
    const loadDir = (dir) => {
        const eventFiles = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../events/${dir}/${file}`);
            const eventName = file.split('.')[0];
            bot.on(eventName, event.bind(null, Discord, bot));
        }
    }

    ['client', 'guild'].forEach(e => {
        loadDir(e);
    });
}