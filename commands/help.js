const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const dadHelp = require('../help functions/dadHelp');
const flipHelp = require('../help functions/coinHelp');
const musicHelp = require('../help functions/musicHelp');
const calcHelp = require('../help functions/calcHelp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with how to ask me things 😊')
        .addStringOption(options => 
            options.setName('function')
                .setDescription('Need help with a specific function?')
                .addChoices(
                    { name: 'music', value: 'music' },
				    { name: 'calc', value: 'calc' },
				    { name: 'dad', value: 'dad' },
                    { name: 'flip', value: 'flip' }
                )
        ),

        async execute(interaction) {
            const funcAnswer = interaction.options.getString('function');

            if (funcAnswer) {
                funcAnswer.toLowerCase();

                if (funcAnswer == 'music') return musicHelp(interaction);
                
                if (funcAnswer == 'calc') return calcHelp(interaction);

                if (funcAnswer == 'dad') return dadHelp(interaction);

                if (funcAnswer == 'flip') return flipHelp(interaction);

            } else {
                const helpMessage = new EmbedBuilder()
                .setColor([255, 0, 5])
                .setAuthor({
                    name: 'Tilly Help Center'
                })
                .setTitle('Different Commands')
                .setDescription('Below are different functions that I have in my kit! For help with a specfic function type in "/help (function name)"')
                .addFields(
                    { name:'\u200B', value: '\u200B' },
                    { name: 'Dad Jokes', value: 'Type "/help dad" for info on my wonderfully dumb Dad Jokes! 🤣', inline: true},
                    { name: 'Flip a coin', value: 'Type "/help flip" for info on my master coin flipping! 🪙', inline: true},
                    { name: 'Calculator', value: 'Type "/help calc" for info on my built in calculator! 🧮', inline: true},
                    { name:'\u200B', value: '\u200B' },
                    { name: 'Music', value: 'Type "/help music" for more info on how I can be your server\'s personal DJ! 🎧', inline: true},
                    { name: 'Length Conversion', value: 'Coming soon', inline: true },
                    { name: 'Google it', value: 'Coming soon', inline: true }

                )

            interaction.reply({
                embeds: [helpMessage],
                ephemeral: true
            });
            }
        }
}