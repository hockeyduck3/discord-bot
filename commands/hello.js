const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const responseArr = ['hello', 'hi', 'how are ya', 'how\'s it going', 'what\'s up'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Wanna say hi? I get lonely sometimes. 🥺')
        .addStringOption(option => 
            option.setName('extra')
                .setDescription('Got anything else to add? Wink wink, hint hint...')
        ),

        async execute(interaction) {
            let extra = interaction.options.getString('extra');

            if (extra) extra.toLowerCase();
            

            if (extra == 'there') {
                interaction.reply({
                    content: 'https://media.giphy.com/media/8JTFsZmnTR1Rs1JFVP/giphy.gif',
                    ephemeral: false
                });
            } else {
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
                        ephemeral: false
                    });
                });
                return;
            }
        }
}