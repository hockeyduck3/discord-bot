const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const dadHelp = require('../help functions/dadHelp');
const flipHelp = require('../help functions/coinHelp');
const musicHelp = require('../help functions/musicHelp');
const mathHelp = require('../help functions/mathHelp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with how to ask me things 😊')
        .addStringOption(options => 
            options.setName('function')
                .setDescription('Need help with a specific function?')
                .addChoices(
                    { name: 'music', value: 'music' },
				    { name: 'math', value: 'math' },
				    { name: 'dad', value: 'dad' },
                    { name: 'flip', value: 'flip' }
                )
        ),

        async execute(interaction) {
            const funcAnswer = interaction.options.getString('function');

            if (funcAnswer) {
                funcAnswer.toLowerCase();

                if (funcAnswer == 'music') return musicHelp(interaction);
                
                if (funcAnswer == 'math') return mathHelp(interaction);

                if (funcAnswer == 'dad') return dadHelp(interaction);

                if (funcAnswer == 'flip') return flipHelp(interaction);
            } else {
                const helpMessage = new EmbedBuilder()
                .setColor([255, 0, 5])
                .setAuthor({
                    name: 'Tilly Help Center'
                })
                .setTitle('Different Commands')
                .setDescription('Below are different functions that I have in my kit! For help with a specfic function type in "#help (function name)"')
                .addFields(
                    { name:'\u200B', value: '\u200B' },
                    { name: 'Dad Jokes', value: 'Type in "#help dad" for info on my wonderfully dumb Dad Jokes! 🤣'},
                    { name:'\u200B', value: '\u200B' },
                    { name: 'Flip a coin', value: 'Type in "#help flip" or "#help flipCoin" for info on my master coin flipping! 🪙'},
                    { name:'\u200B', value: '\u200B' },
                    { name: 'Math', value: 'Type in "#help math" for info on my amazing math skills! 🧮'},
                    { name:'\u200B', value: '\u200B' },
                    { name: 'Music', value: 'Type in "#help music" for more info on how I can be your server\'s personal DJ! 🎧'},
                )

            interaction.reply({
                embeds: [helpMessage],
                ephemeral: true
            });
            }
        }
}