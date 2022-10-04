const dotenv = require('dotenv');
dotenv.config();

module.exports = (Discord, bot, message) => {
    const prefix = process.env.prefix;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
	const userCommand = args.shift().toLowerCase();

    const command = bot.commands.get(userCommand);

    if (command) command.execute(bot, message, args, Discord);
}