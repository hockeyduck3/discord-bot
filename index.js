const Discord = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();

const bot = new Discord.Client();

bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

['functionHandle', 'eventHandle'].forEach(handle => {
	require(`./handlers/${handle}`)(bot, Discord);
})

bot.login(process.env.token);

