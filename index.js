const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));

for (const file of functions) {
	const command = require(`./functions/${file}`);
	
	if (typeof command.name === 'object') {
		command.name.forEach(name => {
			bot.commands.set(name, command);
		});
	} else {
		bot.commands.set(command.name, command);
	}

}

bot.once('ready', () => {
	console.log('Online');
});

bot.login(process.env.devToken);

const prefix = '!';

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!bot.commands.has(command)) return;

	try {
		bot.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});
