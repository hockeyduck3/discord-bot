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
                name: 'Tilly Patch Notes 4-23-23'
            })
            .addFields(
                { name: 'BUGS SQUASHED', value: 'HEY GUYS! Been awhile since my last update. I know I\'ve been a little grumpy lately and haven\'t wanted to DJ a lot for y\'all, but I got some therapy with my creator and we worked through some bugs so I\'m feeling a lot better now and ready to DJ for you guys ALL NIGHT LONG! 😎'},
                { name:'\u200B', value: '\u200B' },
                { name: 'Leave timer', value: 'Well... I say I\'m ready to party all night long, but as soon as you guys leave I\'m packing my bags and going home! 😤 But if you guys invite me to the party I won\'t try to leave every minute and 30 seconds like I used to. I\'ll just stay with you guys till the last person leaves 😁' },
                { name:'\u200B', value: '\u200B' },
                { name:'Future updates', value: 'While this update was mostly fixing stuff, I\'ve had a chat with my creator and he agrees that it\'s time for me to learn some new tricks. So stay tuned for that!' },
            )

        interaction.reply({
            embeds: [patchMessage],
            ephemeral: true
        })
    }
}