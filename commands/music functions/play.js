const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, entersState, getVoiceConnection, VoiceConnectionStatus  } = require('@discordjs/voice')
const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');

const serverMap = new Map();

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

        // if (!vc) return interaction.reply({
        //     content: 'You gotta be in a voice channel',
        //     ephemeral: true
        // });

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

        let checkArg = ytdl.validateURL(song);

        let video;

        const findVideo = async (query) => {
            const result = await youtube.search(query);

            return (result.videos.length >= 1) ? result.videos[0] : null;
        }

        const playSong = async(guildId, song) => {
            const server = serverMap.get(guildId);

            if (!server.stopCalled) {
                server.currentSong = song;
            }

            server.songArray.shift();

            if (!song) {
                server.voice.leave();
                serverMap.delete(guildId);
                return;
            } else {
                server.audioPlayer = createAudioPlayer();

                const stream = ytdl(song.link, {filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25}).on('error', err => {
                    console.log(err);
                    server.text.send('There was an error with that stream');
                    server.voice.leave();
                });

                server.resource = createAudioResource(stream, { inlineVolume: true, inputType: StreamType.Arbitrary });

                server.audioPlayer.play(server.resource);

                try {
                    await entersState(server.connection, VoiceConnectionStatus.Ready, 30_000);
                    server.connection.subscribe(server.audioPlayer);
                } catch (err) {
                    server.connection.destroy();
                    throw err
                }

                server.resource.playStream
                    .on('end', () => {
                        if (server.songArray.length == 0) {
                            server.connection.destroy();
                            serverMap.delete(guildId);
                        } else {
                            server.prevSong = server.currentSong;
                            server.previousSongs.unshift(server.prevSong);
                            playSong(guildId, server.songArray[0]);

                            if (server.prevCalled) {
                                server.previousSongs.shift();
                                server.prevCalled = false;
                            }
                        }
                    })
            }

            // const nowPlaying = new EmbedBuilder()
            //         .setColor([255, 0, 255])
            //         .setAuthor('Tilly Music Player')
            //         .addFields(
            //             { name: `Playing ${song.title}`, value: `${song.link}` },
            //             { name:'\u200B', value: '\u200B' },
            //         )
            //         .setThumbnail(song.thumbnail)
            //         .setTimestamp()
        
            await server.text.send(`Now Playing ${song.title}`);
        }

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

        if (!queue){
            const songObj = {
                voice: vc,
                connection: null,
                audioPlayer: null,
                resource: null,
                text: interaction.channel,
                currentSong: null,
                songArray: [],
                previousSongs: [],
                prevSong: null,
                prevCalled: false,
                stopCalled: false
            };

            serverMap.set(interaction.guild.id, songObj);
            songObj.songArray.push(video);

            await interaction.deferReply()
            await interaction.deleteReply()
            

            try {
                songObj.connection = await joinVoiceChannel({
                    channelId: vc.id,
	                guildId: interaction.guild.id,
	                adapterCreator: interaction.guild.voiceAdapterCreator
                })

                const test = getVoiceConnection(interaction.guild.id);

                console.log(test)
                playSong(interaction.guild.id, songObj.songArray[0]);
            } catch (error) {
                serverMap.delete(interaction.guild.id);
                await interaction.channel.send('Had trouble joining the voice channel');
                throw error;
            }
        } else {
            queue.songArray.push(video);

            const queueEmbed = new MessageEmbed()
                .setColor([2, 150, 255])
                .setAuthor(`Added ${video.title} to the queue 👍`)
                .setThumbnail(video.thumbnail)
                .setTimestamp()
                .setFooter(`${interaction.author.username}`, interaction.author.avatarURL({ dynamic:true }));

            queue.text.send({
                embeds: [queueEmbed]
            });
            return;
        }
    }
}