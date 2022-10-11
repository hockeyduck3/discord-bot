const { SlashCommandBuilder } = require('@discordjs/builders');

const { queue } = require('./play');

const removeEmoji = ['😣', '😥', '😔', '😭', '🤫', '😿', '💩', '☠️'];

module.exports = {
    data: new SlashCommandBuilder()
            .setName('remove')
            .setDescription('Remove a song from the queue')
            .addIntegerOption(option => 
                option.setName('song')
                    .setDescription('The number of the song you want to remove. If you don\'t know the number run /queue')
                    .setRequired(true)
            ),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        let server = queue.get(interaction.guild.id);

        let option = interaction.options.getInteger('song');

        if (!vc) return interaction.reply({
            content: 'You gotta be in a voice channel',
            ephemeral: true
        });

        if (!server) return interaction.reply({
            content: 'Nothing\'s playing right meow',
            ephemeral: true
        });

        if (server.songArray.length <= 0) return interaction.reply({
            content: 'There\'s nothing for me to remove',
            ephemeral: true
        });

        if (server.songArray[option - 1] == undefined) return interaction.reply({
            content: 'It doesn\'t look like that song exists in the queue. Please try a different song number.',
            ephemeral: true
        })

        let songName = server.songArray[option - 1].title;

        server.songArray.splice(option - 1, 1);

        interaction.reply(`${songName} has been removed from the queue  ${removeEmoji[Math.floor(Math.random() * removeEmoji.length)]}`);

        return;
    }
}