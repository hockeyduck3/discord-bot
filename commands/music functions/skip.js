const { SlashCommandBuilder } = require('@discordjs/builders');

const { serverMap } = require('../../external music functions/serverMap');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('skip')
            .setDescription('Skip to the next song in the queue'),

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

        const currentSong = server.currentSong.title;

        if (server.songArray.length == 0) {
            interaction.reply({
                content: 'There are no other songs to skip',
                ephemeral: true
            });
        } else {
            server.resource.playStream.end();
            interaction.reply(`${currentSong} has been skipped ⏭️`);
        }
    }
}