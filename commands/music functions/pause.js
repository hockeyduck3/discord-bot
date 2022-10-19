const { SlashCommandBuilder } = require('@discordjs/builders');

const { serverMap } = require('../../external music functions/serverMap');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('pause')
            .setDescription('Pause the current playing song'),

    async execute(interaction) {
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

        if (server.audioStatus == 'paused') return interaction.reply({
            content: 'The music is already paused',
            ephemeral: true
        });


        const currentSong = server.currentSong.title;

        server.audioStatus = 'paused';
        server.audioPlayer.pause();

        interaction.reply(`⏸️ Paused ${currentSong}`);
    }
}