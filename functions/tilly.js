const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: ['tilly', 'hello', 'hi', 'help'],
    description: 'Send hello gifs',
    execute(message, args) {
        let command = message.content.substring(1).trim().split(/ +/).shift().toLowerCase();
        let helpArg = args.join(' ').toLowerCase();

        if (command == 'tilly' || command == 'hello' || command == 'hi') {
            const responseArr = ['hello', 'hi', 'how are ya', 'how\'s it going', 'what\'s up'];
    
            axios.get(`http://api.giphy.com/v1/gifs/search?q=${responseArr[Math.floor(Math.random() * responseArr.length)]}&api_key=${process.env.giphy}&limit=1`)
                .then(response => {
                    message.channel.send(response.data.data[0].url);
                })
                .catch(err => {
                    console.log(err);
                });
                return;
        } 
        
        if (command == 'help' && !helpArg) {
            const helpMessage = new MessageEmbed()
                .setColor([255, 0, 5])
                .setAuthor('Tilly Help Center')
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

            message.channel.send(helpMessage);
            return;
        }

        if (helpArg == 'dad') {
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

        if (helpArg == 'flip' || helpArg == 'flipcoin') {
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
    }
}
