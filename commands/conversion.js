const { SlashCommandBuilder } = require('@discordjs/builders');
const { evaluate, format } = require('mathjs')

module.exports = {
    data: new SlashCommandBuilder()
            .setName('conversion')
            .setDescription('Convert between feet or inchs or centimeters or etc etc...')
            .addStringOption(option => 
                option.setName('string')
                    .setDescription('What would you like converted?')
                    .setRequired(true)
            ),

    async execute(interaction) {
        let string = interaction.options.getString('string');

        try {
            const result = evaluate(string);

            interaction.reply({
                content: `The answer to ${string} is ${format(result,  {precision: 14})}`,
                ephemeral: true
            });
        } catch (err) {
            console.log(err);

            interaction.reply({
                content: 'looks like there was an error with that, please try again.',
                ephemeral: true
            });
        }
    }
}
