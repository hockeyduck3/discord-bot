const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
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
                const stream = ytdl(song.link, {filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25}).on('error', err => {
                    console.log(err);
                    server.text.send('There was an error with that stream');
                    server.voice.leave();
                });
                server.connection.play(stream, {seek: 0, volume: 1})
                    .on('finish', () => {
                        if (server.songArray.length == 0) {
                            server.voice.leave();
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

            const nowPlaying = new MessageEmbed()
                    .setColor([255, 0, 255])
                    .setAuthor('Tilly Music Player')
                    .addFields(
                        { name: `Playing ${song.title}`, value: `${song.link}` },
                        { name:'\u200B', value: '\u200B' },
                    )
                    .setThumbnail(song.thumbnail)
                    .setTimestamp()
        
            await server.text.send(nowPlaying);
        }

        if (checkArg) {
            let info = await ytdl.getBasicInfo(args[0]);

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
                songObj.connection = await interaction.member.voice.channel.join();
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