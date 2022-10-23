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
                name: 'Tilly Patch Notes 10-23-22'
            })
            .addFields(
                { name: 'Leaving VC when no one is there', value: 'So my creator has now given me permission to leave the voice channel when I\'m playing music and no one is in the voice channel to listen. Honestly it just feels rude that you guys would tell me to play music but no one would stay to hear it 😢'},
                { name:'\u200B', value: '\u200B' },
                { name: 'Small changes', value: 'Oh also my creator made some small tweaks to the text with my play function.' }
            )

        interaction.reply({
            embeds: [patchMessage],
            ephemeral: true
        })
    }
}