const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');

const { serverMap } = require('../../external music functions/serverMap');

const queueEmoji = ['👍', '🤖', '👊', '👏', '🫶', '👌', '💪', '😎', '🫡', '👽', '▶️'];

module.exports = {
    data: new SlashCommandBuilder()
            .setName('playnext')
            .setDescription('Move a song to the front of the line in the queue')
            .addStringOption(song =>
                song.setName('input')
                    .setDescription('Give me a song name or a Youtube link')
                    .setRequired(true)
            ),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        const server = serverMap.get(interaction.guild.id);

        if (!vc) return interaction.reply({
            content: 'You gotta be in a voice channel',
            ephemeral: true
        });

        const user = interaction.member;

        if (!user.permissions.has(PermissionsBitField.Flags.Connect)) return interaction.reply({
            content: 'You\'re missing the CONNECT permission',
            ephemeral: true
        });

        if (!user.permissions.has(PermissionsBitField.Flags.Speak)) return interaction.reply({
            content: 'You\'re missing the SPEAK permission',
            ephemeral: true
        });

        if (!server) {
            interaction.reply({
                content: 'Looks like you don\'t have any music playing.',
                ephemeral: true
            });
        } else {
            let video;

            const findVideo = async (query) => {
                const result = await youtube.search(query);
    
                return (result.videos.length >= 1) ? result.videos[0] : null;
            }

            const song = interaction.options.getString('input');

            let checkArg = ytdl.validateURL(song);

            if (checkArg) {
                let info = await ytdl.getBasicInfo(song);

                video = {
                    title: info.videoDetails.title,
                    thumbnail: info.videoDetails.thumbnails[0].url,
                    link: info.videoDetails.video_url
                }
            } else {
                let foundVideo = await findVideo(`${song} audio`);

                video = {
                    title: foundVideo.title,
                    thumbnail: foundVideo.thumbnail,
                    link: foundVideo.link
                }
            }

            server.songArray.unshift(video);
            
            const queueEmbed = new EmbedBuilder()
                    .setColor([2, 150, 255])
                    .setAuthor({
                        name: 'Tilly Music Player',
                        iconURL: 'https://i.pinimg.com/474x/80/3a/1f/803a1f2849f12dde465ab9143f50187e.jpg'
                    })
                    .setDescription(`Title [${video.title}](${video.link}) has been added to the front of the queue ${queueEmoji[Math.floor(Math.random() * queueEmoji.length)]}`)
                    .setThumbnail(video.thumbnail)


            interaction.reply({
                embeds: [queueEmbed]
            });
        }
    }
}
