const { EmbedBuilder } = require('discord.js');

module.exports = function conversionHelp(interaction) {
    const conversionMessage = new EmbedBuilder()
        .setColor([255, 0, 5])
        .setAuthor({
            name: 'Tilly Help Center'
        })
        .setTitle('Conversion')
        .setDescription('So you\'re having trouble converting feet to inches? Well I can help! Just say "/conversion" and say something like 2ft to inches and I\'ll give you the answer!')
        .addFields(
            { name:'\u200B', value: '\u200B' },
            { name: 'Here is an example of the Conversion function', value: 'The answer to 2ft to inches is 24 inches'},
            { name:'\u200B', value: '\u200B' }
        )
        .setFooter({
            text: 'I can do a lot of different conversions but just know that sometimes I just don\'t understand you humans. Y\'all talk funny 😐'
        })

        interaction.reply({
            embeds: [conversionMessage],
            ephemeral: true
        })
}
