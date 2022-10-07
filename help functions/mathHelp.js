const { EmbedBuilder } = require('discord.js');

module.exports = function musicHelp(interaction) {
    const answerArr = [
        '2 + 2 is 4',
        '1 + 1 is 2',
        '3 + 3 is 6',
        '3 - 2 is 1',
        '14,000,605 x 2 is 28,001,210',
        '5 + 5 is 10',
        '1 x 1 is 1',
        '2 x 2 is 4',
        '6 / 3 is 2',
        '10 / 2 is 5',
        '1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 is 10',
        'oof + skies is oofskies... I mean 1 + 2 is 3'
    ];

    const mathMessage = new EmbedBuilder()
        .setColor([255, 0, 5])
        .setAuthor({
            name: 'Tilly Help Center'
        })
        .setTitle('Math help')
        .setDescription('So you thought that just because I\'m some kind of AI that I could do math!? Well you would be right. I am a computer after all. If you wanna ask me a math question you just gotta say something like #math or #calc or #m and then give me a problem to calculate.')
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Here is an example of my math skills!', value: `The answer to ${answerArr[Math.floor(Math.random() * answerArr.length)]}. Duh.` },
            { name: '\u200B', value: '\u200B' }
        )
        .setFooter({
            text: 'I can do lots of basic math problems, and even some that you humans just can\'t comprehend! But there\'s also some stuff that even I don\'t understand so please go easy on me 🥺'
        })

        interaction.reply({
            embeds: [mathMessage],
            ephemeral: true
        });
}
