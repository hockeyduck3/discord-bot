const { SlashCommandBuilder } = require('@discordjs/builders');

const { serverMap } = require('../../external music functions/serverMap');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('previous')
            .setDescription('Go back to the previous song'),

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

        if (server.loop) {
            interaction.reply({
                content: 'Sorry, can\'t use the previous function while the queue is looping',
                ephemeral: true
            });
        } else if (server.previousSongs[0] != server.currentSong && server.previousSongs.length != 0) {
            server.songArray.unshift(server.currentSong)
            server.songArray.unshift(server.previousSongs[0]);
            server.previousSongs.shift();
            server.prevCalled = true;

            interaction.deferReply();
            interaction.deleteReply();
            
            server.resource.playStream.end();
        } else {
            interaction.reply({
                content: 'You\'ve got no songs to go back to',
                ephemeral: true
            })
        }
    
        return;
    }
}