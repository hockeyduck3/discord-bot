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
                name: 'Tilly Patch Notes 5-21-23'
            })
            .addFields(
                { name: 'Fixes for the music loop', value: 'You guys might be wondering, what was wrong with the looping function? Well, my creator noticed that it wasn\'t quite working right. Like if you added a song to the queue, but it would play an old song before getting to the new one. But that\'s been fixed now! 😁👍'},
                { name:'\u200B', value: '\u200B' },
                { name: 'Remove all', value: 'So let me guess. One of your buddies put on a playlist with 658 songs on it. But going in and removing those songs one by one is not really ideal. So now you can just ask me to "/remove all" and I\'ll get rid of EVERYTHING.' },
                { name:'\u200B', value: '\u200B' },
                { name:'Play next', value: 'Did you want to show your mates this cool new song that you found but don\'t want to suffer through 23 other songs to get to your song? Well now you can tell me "/playnext" and I\'ll move that song to the front of the queue! You can consider it a bribe.' },
            )

        interaction.reply({
            embeds: [patchMessage],
            ephemeral: true
        })
    }
}