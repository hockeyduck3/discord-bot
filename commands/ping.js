const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong or something')
        .addBooleanOption(option => 
            option.setName('test')
                .setDescription('testing')
        ),

        async execute(interaction) {
            let option = interaction.options.getBoolean('test');

            if (option == null) {
                option = false
            }

            interaction.reply({
                content: 'BOIIIIIIIII',
                ephemeral: option
            });
        }
}