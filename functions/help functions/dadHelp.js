const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = function dadHelp(message) {
    axios({
        method: 'get',
        url: 'https://icanhazdadjoke.com/',
        headers: {
            accept: 'application/json',
            'User-Agent': 'axios 0.21.1'
        }
    }).then(response => {
        const dadMessage = new MessageEmbed()
        .setColor([255, 0, 5])
        .setAuthor('Tilly Help Center')
        .setTitle('Dad Jokes')
        .setDescription('Ohhhh so you wanna hear a really bad dad joke? Well look no futher! For this function all you need to do is type in "#dad" or "dadJoke" and I\'ll tell you a dad joke! 😁')
        .addFields(
            { name:'\u200B', value: '\u200B' },
            { name: 'Here is an example of the Dad Joke function', value: `${response.data.joke}`},
            { name:'\u200B', value: '\u200B' }
        )
        .setFooter('These dad jokes are not guaranteed to make you or anyone else laugh. Any and all dad jokes are subject to boo\'s and general disgust with the joke. If you tell any of these dad jokes in public and you lose all your friends, family and anyone you ever loved, I, Tilly, am not responsible for ruining your life. If you actually read all of this, congrats! You get a cookie! 🍪 (this cookie is not real, do not try to eat the cookie off the monitor or else you will look like and idiot an ruin your life further)')

        message.channel.send(dadMessage);
    }).catch(err => {
        console.log(err);
        message.reply('Looks like there was an error with that request. Please try again later');
    });
}
