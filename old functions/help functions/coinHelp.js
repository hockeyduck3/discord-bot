const { MessageEmbed } = require('discord.js');

module.exports = function coinHelp(message) {
    const num = Math.floor(Math.random() * 5);

    let result;

    if (num % 2 === 1) {
        result = 'heads';
    } else {
        result = 'tails';
    }

    const coinMessage = new MessageEmbed()
        .setColor([255, 0, 5])
        .setAuthor('Tilly Help Center')
        .setTitle('Flip a coin')
        .setDescription('So this one is pretty much a no-brainer. Say you and your friends can\'t decide between game "A" or game "B", you guys go to look for a coin but you guys can\'t find any. Well have no fear! For I am here! Just type in "#flip" or "#flipCoin" and I\'ll tell you guys whether it was heads or tails 😁👉🪙')
        .addFields(
            { name:'\u200B', value: '\u200B' },
            { name: 'Here is an example of the Flip Coin function', value: `I just flipped a coin and it\'s ${result} `},
            { name:'\u200B', value: '\u200B' }
        )
        .setFooter('Trust me, I\'m not biased towards heads or tails. I\'m lines of code for Pete\'s sake.')

        message.channel.send(coinMessage);
}
