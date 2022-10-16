const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus } = require('@discordjs/voice')
const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');
const playlist = require('youtube-sr').default;

const serverMap = new Map();

const nowPlayingEmoji = ['🎧', '🎶', '🎵', '🎸', '🎷', '🎺', '🔊', '🎤'];
const queueEmoji = ['👍', '🤖', '👊', '👏', '🫶', '👌', '💪', '😎', '🫡', '👽', '▶️'];

module.exports = {
    queue: serverMap,
    data: new SlashCommandBuilder()
            .setName('play')
            .setDescription('play a song')
            .addStringOption(song => 
                song.setName('song')
                    .setDescription('Give me a song name or a Youtube link to play')
                    .setRequired(true)    
            ),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        const song = interaction.options.getString('song');

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

        const playSong = async(guildId, song) => {
            const server = serverMap.get(guildId);
            
            server.currentSong = song;

            server.songArray.shift();

            if (!song) {
                server.connection.destroy();
                serverMap.delete(guildId);
                return;
            } else {
                server.audioPlayer = createAudioPlayer();

                const stream = ytdl(song.link, {filter: 'audioonly', quality: 'lowestaudio', highWaterMark: 1<<25}).on('error', err => {
                    console.log(err);
                    server.text.send('There was an error with that stream');
                    server.connection.destroy();
                    serverMap.delete(guildId);
                });

                server.resource = createAudioResource(stream, { inlineVolume: true, inputType: StreamType.Arbitrary });

                server.audioPlayer.play(server.resource);
                server.audioStatus = 'playing';

                try {
                    await entersState(server.connection, VoiceConnectionStatus.Ready, 30_000);
                    server.connection.subscribe(server.audioPlayer);
                } catch (err) {
                    server.connection.destroy();
                    throw err
                }

                server.resource.playStream
                    .on('end', async () => {
                        if (server.songArray.length == 0) {
                            deleteNowPlaying(server);

                            server.audioStatus = 'stopped';

                            leaveTimer(server, guildId);
                        } else {
                            deleteNowPlaying(server);

                            server.prevSong = server.currentSong;
                            server.previousSongs.unshift(server.prevSong);

                            if (server.loop) {
                                server.songArray.push(server.prevSong);
                                server.previousSongs.pop();
                            }

                            playSong(guildId, server.songArray[0]);

                            if (server.prevCalled) {
                                server.previousSongs.shift();
                                server.prevCalled = false;
                            }
                        }
                    })
            }

            const nowPlaying = new EmbedBuilder()
                    .setColor([255, 0, 255])
                    .setAuthor({
                        name: 'Tilly Music Player',
                        iconURL: 'https://i.pinimg.com/474x/80/3a/1f/803a1f2849f12dde465ab9143f50187e.jpg'
                    })
                    .setDescription(`Now playing [${song.title}](${song.link})   ${nowPlayingEmoji[Math.floor(Math.random() * nowPlayingEmoji.length)]}`)
                    .setThumbnail(song.thumbnail)

            server.nowPlaying = await server.text.send({
                embeds: [nowPlaying]
            });
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

        function leaveTimer(server, guildId) {
            setTimeout(() => {
                if (!server) {
                    return;
                } 
                
                else if (server.audioStatus == 'stopped') {

                    const leaveEmbed = new EmbedBuilder()
                            .setColor([2, 12, 25])
                            .setAuthor({
                                name: 'Tilly Music Player',
                                iconURL: 'https://i.pinimg.com/474x/80/3a/1f/803a1f2849f12dde465ab9143f50187e.jpg'
                            })
                            .setDescription('I haven\'t gotten any new song requests in a hot minute, so I\'m gonna head out. ✌️')

                    server.text.send({
                        embeds: [leaveEmbed]
                    })

                    server.connection.destroy();
                    serverMap.delete(guildId);

                } else {
                    return;
                }
            }, 180000);
        }

        const deleteNowPlaying = async (server) => {
            try {
                await server.nowPlaying.delete()
            } catch (err) {
                console.log(err);
            }
        }

    }  
}
