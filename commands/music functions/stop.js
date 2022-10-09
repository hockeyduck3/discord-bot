const { SlashCommandBuilder } = require('@discordjs/builders');

const { queue } = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('stop')
            .setDescription('stop a playing song'),

    async execute (interaction) {
        interaction.reply('stop hit')

        let test = queue.get(interaction.guild.id)

        console.log(test)
    }
}