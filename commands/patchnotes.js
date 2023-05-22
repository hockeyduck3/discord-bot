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
                { name: 'BUGS SQUASHED', value: 'Soooo good news and bad news... So my last update did killed some bugs, but not ALL of the bugs were killed. This time around more bugs should\'ve been squatched! So hopefully no more issues for the time being 😣'},
                { name:'\u200B', value: '\u200B' },
                { name: '/stop is now /leave', value: 'This change is pretty simple. Instead of telling me to /stop just tell me to /leave and I may or may not leave the VC 😎' },
                { name:'\u200B', value: '\u200B' },
                { name:'Times in queue', value: 'Something that I know some of you wanted to know was how much time was left on the current song. Well now if you hit /queue I will show you the time for each song and the time until the current song ends! Sooner or later I\;ll be able to tell you how much time is left until the current queue ends... Just not right now 😁' },
                { name:'\u200B', value: '\u200B' },
                { name: '/resume has been removed!', value: 'One major UI thing that happened in this update. You can no longer use the command /resume. Instead you just use /play to resume a song! Makes sense right? Pause, play. Yeah I think y\'all get it.'},
                { name:'\u200B', value: '\u200B' },
                { name: 'Better song selection', value: 'The final thing that got update was my song selecting. What do I mean by that? Well you know how sometimes you\'d ask me to play a song and I play the wrong song? Well while that won\'t be going away completely... My creator changed how I find music for you guys so I should be at least a little more accurate? Hopefully???'},
                { name:'\u200B', value: '\u200B' },
                { name: '/remove last', value: 'Speaking of better song selection. The final final thing that got added was the ability to now tell me "/remove last" JUST in case if I didn\'t get the song you wanted you now have an easier and faster way of letting me know!'},
            )

        interaction.reply({
            embeds: [patchMessage],
            ephemeral: true
        })
    }
}