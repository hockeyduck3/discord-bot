const { SlashCommandBuilder } = require('@discordjs/builders');

const { queue } = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('loop')
            .setDescription('Set the current music queue to just keep looping'),

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

        if (!server.loop) {
            server.loop = true;

            interaction.reply({
                content: 'The queue has been set to loop ✌️'
            });

        } else {
            server.loop = false;

            interaction.reply({
                content: 'The queue is no longer looping'
            })
        }
    }
}