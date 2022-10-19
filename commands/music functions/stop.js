const { SlashCommandBuilder } = require('@discordjs/builders');

const { serverMap } = require('../../external music functions/serverMap');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('stop')
            .setDescription('stop a playing song'),

    async execute (interaction) {
        const vc = interaction.member.voice.channel;
        let server = serverMap.get(interaction.guild.id);

        if (!vc) return interaction.reply({
            content: 'You gotta be in a voice channel',
            ephemeral: true
        });

        if (!server) return interaction.reply({
            content: 'Nothing\'s playing right meow',
            ephemeral: true
        });

        try {
            await server.nowPlaying.delete()
        } catch (err) {
            console.log(err);
        }

        server.connection.destroy();

        interaction.reply('Alright alright I\'m stopping the music');

        queue.delete(interaction.guild.id);
    }
}