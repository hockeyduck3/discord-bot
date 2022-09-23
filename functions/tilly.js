const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const dadHelp = require('./help functions/dadHelp');
const coinHelp = require('./help functions/coinHelp');

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
            dadHelp(message);
        }

        if (helpArg == 'flip' || helpArg == 'flipcoin') {
            coinHelp(message);
        }
    }
}
