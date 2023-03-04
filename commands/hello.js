const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const responseArr = ['hello', 'hi', 'how are ya', 'how\'s it going', 'what\'s up'];

const kittyArr = [
    'https://media.giphy.com/media/kZqbBT64ECtjy/giphy.gif', 
    'https://media.giphy.com/media/92YG8KKSjYhMc/giphy.gif', 
    'https://media.giphy.com/media/sUIR3O9BFIBna/giphy.gif', 
    'https://media.giphy.com/media/fx5e8vTQDs1Mc/giphy.gif', 
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('To easter egg? Or not to easter egg? 🤫. Too obvious?')
        .addStringOption(option => 
            option.setName('blank')
                .setDescription('Finish the sentence...')
                .setRequired(true)
        ),

        async execute(interaction) {
            let blank = interaction.options.getString('blank').toLowerCase();

            let reply;
            
            if (blank == 'there') {
                reply = 'https://media.giphy.com/media/8JTFsZmnTR1Rs1JFVP/giphy.gif'
            } 

            if (blank == 'kitty') {
                interaction.reply({
                    content: kittyArr[Math.floor(Math.random() * kittyArr.length)],
                    ephemeral: true
                });
            }

            if (blank == 'ms. doubtfire' || blank == 'ms doubtfire') {
                reply = 'https://media.giphy.com/media/wGksICMKpinyE/giphy.gif'
            }

            if (blank == 'tilly') {
                axios.get(`http://api.giphy.com/v1/gifs/search?q=${responseArr[Math.floor(Math.random() * responseArr.length)]}&api_key=${process.env.giphy}&limit=1`)
                .then(response => {
                    interaction.reply({
                        content: response.data.data[0].url,
                        ephemeral: true
                    });
                })
                .catch(err => {
                    console.log(err);
                    interaction.reply({
                        content: 'Sorry I had a little glitch, please try again',
                        ephemeral: true
                    });
                });
            }
            
            else {
                reply = 'Hmmm. Not quite what I was looking for... Try again!';
            }

            await interaction.reply({
                content: reply,
                ephemeral: true
            });
        }
}
