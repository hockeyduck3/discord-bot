const { SlashCommandBuilder } = require('@discordjs/builders');

const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('patchnotes')
            .setDescription('See what\'s been incuded in my latest update!'),

    async execute(interaction) {
        const patchMessage = new EmbedBuilder()
            .setColor([255, 0, 5])
            .setAuthor({
                name: 'Tilly Patch Notes'
            })
            .setTitle('10-?-22')
            .addFields(
                { name: 'Patch notes', value: 'Wanna know what features or bug fixes my amazing creator made for me? Well now you can read the latest patch notes! Which you are currently doing...'},
                { name:'\u200B', value: '\u200B' },
                { name: 'Music Playlists!', value: 'You can now add Youtube playlists to music queues! Just say /play and add the playlist link! PS. Make sure the playlist is an actual "playlist" and not a "mix", also make sure your playlist is either public or unlisted, if it\'s private then I won\'t be able to read it 🤷‍♀️'},
                { name:'\u200B', value: '\u200B' },
                { name: 'Loop the music queue', value: 'Listen I get it. You hate it when the music stops and you have to tell me to play new songs again. Well now just ask me to loop the queue with /loop and I\'ll make sure the music never ends! But just now that you won\'t be able to use the /previous function while the queue is looping'},
                { name:'\u200B', value: '\u200B' },
                { name: 'Quality of Life updates', value: 'In terms of smaller updates, my creator added some of the new features to the help section. That\'s about it.' }
            )

        interaction.reply({
            embeds: [patchMessage],
            ephemeral: true
        })
    }
}