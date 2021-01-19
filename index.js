const Discord = require('discord.js');
const bot = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

bot.once('ready', () => {
    console.log('Online');
});

bot.login(process.env.token);
