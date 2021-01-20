const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));

for (const file of functions) {
    const command = require(`./functions/${file}`);

    bot.commands.set(command.name, command);
}

const prefix = '!util';

bot.once('ready', () => {
    console.log('Online');
});

bot.login(process.env.token);

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const command = message.content.slice(prefix.length).toLowerCase().replace(/[^a-zA-Z ]/g, "").trim();

	if (!bot.commands.has(command)) return;

	try {
		bot.commands.get(command).execute(message);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});
