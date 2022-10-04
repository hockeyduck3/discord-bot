const fs = require('fs');

module.exports = (bot, Discord) => {
    const functions = fs.readdirSync('./functions/').filter(file => file.endsWith('.js'));

    for (const file of functions) {
        const command = require(`../functions/${file}`);
        
        if (typeof command.name === 'object') {
            command.name.forEach(name => {
                bot.commands.set(name, command);
            });
        } else {
            bot.commands.set(command.name, command);
        }
    
    }
}