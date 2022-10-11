const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dad')
        .setDescription('Get a random Dad joke!')
        .addBooleanOption(op => 
            op.setName('private')
                .setDescription('Would you like to be the only one who can see this joke?')
        ),

        async execute(interaction) {
            let option = interaction.options.getBoolean('private');

            if (option == null) {
                option = false
            }

            axios({
                method: 'get',
                url: 'https://icanhazdadjoke.com/',
                headers: {
                    accept: 'application/json',
                    'User-Agent': 'axios 0.21.1'
                }
            }).then(response => {
                interaction.reply({
                    content: response.data.joke,
                    ephemeral: option
                })
            }).catch(err => {
                console.log(err);
                interaction.reply('Looks like there was an error with that request. Please try again later');
            });
        }
}