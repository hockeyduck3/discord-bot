const {Collection, GatewayIntentBits, Client} = require('discord.js');

require('dotenv').config();
const fs = require('fs');

const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildVoiceStates
	]
});

const commandFiles = fs.readdirSync('./commands');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

const commands = [];

bot.commands = new Collection();

for (const file of commandFiles) {
	if (!file.endsWith('.js')) {
		const subFiles = fs.readdirSync(`./commands/${file}`).filter(subFile => subFile.endsWith('.js'));
		
		for (const i of subFiles) {
			const command = require(`./commands/${file}/${i}`);
			commands.push(command.data.toJSON());
			bot.commands.set(command.data.name, command);
		} 
	} else {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
		bot.commands.set(command.data.name, command);
	}
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args, commands));
	} else {
		bot.on(event.name, (...args) => event.execute(...args, commands));
	}
}

bot.login(process.env.token);
