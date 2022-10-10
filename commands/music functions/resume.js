const { SlashCommandBuilder } = require('@discordjs/builders');

const { queue } = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('resume')
            .setDescription('Resume the current playing song'),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        let server = queue.get(interaction.guild.id);

        if (!vc) return interaction.reply({
            content: 'You gotta be in a voice channel',
            ephemeral: true
        });

        if (!server) return interaction.reply({
            content: 'Nothing\'s playing right meow',
            ephemeral: true
        });

        const currentSong = server.currentSong.title;

        server.audioPlayer.unpause();

        interaction.reply(`▶️ Resuming ${currentSong}`);
    }
}