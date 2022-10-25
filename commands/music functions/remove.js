const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { serverMap } = require('../../external music functions/serverMap');

const removeEmoji = ['😣', '😥', '😔', '😭', '🤫', '😿', '💩', '☠️'];

const allButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('1')
            .setLabel('Yes, delete it all')
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId('0')
            .setLabel('No, wait I changed my mind!')
            .setStyle(ButtonStyle.Danger)
        )

module.exports = {
    data: new SlashCommandBuilder()
            .setName('remove')
            .setDescription('Remove a song from the queue')
            .addSubcommand(song =>
                song.setName('song')
                    .setDescription('Remove a single song from the queue')
                    .addIntegerOption(option =>
                        option.setName('number')
                            .setDescription('The number of the song you want to remove.')
                            .setRequired(true)
                    )
            )
            .addSubcommand(all =>
                all.setName('all')
                    .setDescription('Remove all the songs from the queue, aka no more music lined up 😢')
            ),
            

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        let server = serverMap.get(interaction.guild.id);
        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId == '1') {
                server.songArray = [];

                await i.deferUpdate();

                await interaction.editReply({
                    content: 'As you wish', 
                    components: [],
                    ephemeral: true
                });

                interaction.followUp({
                    content: 'All songs have been removed from the queue'
                })
            }
        })

        const command = interaction.options.getSubcommand();

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

        if (command == 'all') {
            return interaction.reply({
                content: 'Are you sure you want to remove all the songs in the queue?? 😢',
                components: [allButtons],
                ephemeral: true
            });
            
        } else {

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
}
