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
            )
            .addSubcommand(last => 
                last.setName('last')
                    .setDescription('Remove the last song from the queue')
            ),
            

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        let server = serverMap.get(interaction.guild.id);
        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId == '1') {
                server.songArray = [];

                await interaction.editReply({
                    content: 'Removing all songs from the queue', 
                    components: [],
                    ephemeral: true
                });

                interaction.followUp({
                  content: `${interaction.user.username} has requested that all the songs in the queue be removed.`,
                  components: [],
                  ephemeral: false  
                });

            } else {

                await interaction.editReply({
                    content: 'Alright I won\'t remove anything from the queue',
                    components: [],
                    ephemeral: true
                });
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
            
        } else if (command == 'last') {
            let songName = server.songArray[server.songArray.length - 1].title;
    
            server.songArray.pop();
    
            interaction.reply(`${songName} has been removed from the queue  ${removeEmoji[Math.floor(Math.random() * removeEmoji.length)]}`);
    
            return;

        } else {

            let option = interaction.options.getInteger('number');

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
