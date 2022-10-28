const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice')
const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');
const playlist = require('youtube-sr').default;

const { serverMap } = require('../../external music functions/serverMap');
const playSong = require('../../external music functions/playSong');

const queueEmoji = ['👍', '🤖', '👊', '👏', '🫶', '👌', '💪', '😎', '🫡', '👽', '▶️'];

module.exports = {
    data: new SlashCommandBuilder()
            .setName('play')
            .setDescription('Play a song from Youtube or Youtube Playlist')
            .addStringOption(song => 
                song.setName('input')
                    .setDescription('Give me a song name or a Youtube link or a Youtube Playlist')
                    .setRequired(true)    
            ),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        const song = interaction.options.getString('input');

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

        let queue = serverMap.get(interaction.guild.id);

        let checkArg;

        if (song.includes('playlist?')) {
            checkArg = 'playlist';
        } else {
            checkArg = ytdl.validateURL(song);
        }

        let video;
        let playlistArr = [];
        let reply = false;

        const findVideo = async (query) => {
            const result = await youtube.search(query);

            return (result.videos.length >= 1) ? result.videos[0] : null;
        }

        if (checkArg == 'playlist') {
            await playlist.getPlaylist(song, {fetchAll: true})
            .then(vid => {
                if (vid != null) {
                    for (let i = 0; i < vid.videos.length; i++) {
                        video = {
                            title: vid.videos[i].title,
                            thumbnail: vid.videos[i].thumbnail.url,
                            link: `https://www.youtube.com/watch?v=${vid.videos[i].id}`
                        }
    
                        playlistArr.push(video);
                    }
                } else {
                    interaction.reply({
                        content: 'Looks like that playlist is set to private. Please make sure it\'s either public or unlisted',
                        ephemeral: true
                    });  
                    reply = true;
                }
            })
            .catch(err => {
                console.log(err);
            })

        } else if (checkArg) {
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

        if (!queue){
            const songObj = {
                audioStatus: null,
                connection: null,
                audioPlayer: null,
                resource: null,
                text: interaction.channel,
                currentSong: null,
                nowPlaying: null,
                songArray: [],
                previousSongs: [],
                loopArray: [],
                prevSong: null,
                prevCalled: false,
                loop: false
            };

            serverMap.set(interaction.guild.id, songObj);
            if (checkArg != 'playlist') {
                songObj.songArray.push(video);
            } else {
                playlistArr.forEach(vid => songObj.songArray.push(vid));
            }

            playlistArr = [];
            await interaction.deferReply();
            await interaction.deleteReply();

            try {
                songObj.connection = await joinVoiceChannel({
                    channelId: vc.id,
	                guildId: interaction.guild.id,
	                adapterCreator: interaction.guild.voiceAdapterCreator
                })

                playSong(interaction.guild.id, songObj.songArray[0]);

            } catch (error) {
                serverMap.delete(interaction.guild.id);
                await interaction.channel.send('Had trouble joining the voice channel');
                throw error;
            }
        } else if (queue.audioStatus == 'stopped') {
            queue.songArray.push(video);

            playSong(interaction.guild.id, queue.songArray[0]);

            await interaction.deferReply();
            await interaction.deleteReply();

        } else {
            if (checkArg != 'playlist') {
                queue.songArray.push(video);

                const queueEmbed = new EmbedBuilder()
                    .setColor([2, 150, 255])
                    .setAuthor({
                        name: 'Tilly Music Player',
                        iconURL: 'https://i.pinimg.com/474x/80/3a/1f/803a1f2849f12dde465ab9143f50187e.jpg'
                    })
                    .setDescription(`Title [${video.title}](${video.link}) has been added to the queue    ${queueEmoji[Math.floor(Math.random() * queueEmoji.length)]}`)
                    .setThumbnail(video.thumbnail)


                interaction.reply({
                    embeds: [queueEmbed]
                });

                return;
            } else {
                if (!reply) {
                    playlistArr.forEach(vid => queue.songArray.push(vid));

                    const queueEmbed = new EmbedBuilder()
                        .setColor([2, 150, 255])
                        .setAuthor({
                            name: 'Tilly Music Player',
                            iconURL: 'https://i.pinimg.com/474x/80/3a/1f/803a1f2849f12dde465ab9143f50187e.jpg'
                        })
                        .setDescription(`${playlistArr.length} songs have been added to the queue ${queueEmoji[Math.floor(Math.random() * queueEmoji.length)]}`)

                    playlistArr = [];

                    interaction.reply({
                        embeds: [queueEmbed]
                    });
                    return;
                }
            }
        }
    }  
}
