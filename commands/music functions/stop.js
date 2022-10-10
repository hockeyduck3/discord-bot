const { SlashCommandBuilder } = require('@discordjs/builders');

const { queue } = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('stop')
            .setDescription('stop a playing song'),

    async execute (interaction) {
        let server = queue.get(interaction.guild.id);

        if (!server) return interaction.reply({
            content: 'Nothing\'s playing right meow',
            ephemeral: true
        });

        server.connection.destroy();

        interaction.reply('Alright alright I\'m stopping the music');

        queue.delete(interaction.guild.id);
    }
}