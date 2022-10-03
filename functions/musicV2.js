const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');
const { MessageEmbed } = require('discord.js');
const { Console } = require('console');

const serverMap = new Map();

module.exports = {
    name: ['play', 'p'],
    description: 'music thing',
    async execute(message, args) {
        const vc = message.member.voice.channel;
        const command = message.content.substring(1).trim().split(/ +/).shift().toLowerCase();

        if (!vc) return message.reply('You gotta be in a voice channel');

        const perms = vc.permissionsFor(message.client.user);
        
        if (!perms.has('CONNECT')) return message.reply('You\'re missing the CONNECT permission');

        if (!perms.has('SPEAK')) return message.reply('You\'re missing the SPEAK permission fool');

        if (command == 'play' || command == 'p') {
            if (!args.length) return message.reply('You need to add another argument bro');

            let queue = serverMap.get(message.guild.id);

            let checkArg = ytdl.validateURL(args[0]);

            let video;

            const findVideo = async (query) => {
                const result = await youtube.search(query);

                return (result.videos.length >= 1) ? result.videos[0] : null;
            }

            const playSong = async(guildId, song) => {
                const server = serverMap.get(guildId);
                server.currentSong = song;

                if (!song) {
                    server.voice.leave();
                    serverMap.delete(guildId);
                    return;
                } else {
                    const stream = ytdl(song.link, {filter: 'audioonly', quality: 'lowestaudio', highWaterMark: 1<<25}).on('error', err => {
                        console.log(err);
                        server.text.send('There was an error with that stream');
                        server.voice.leave();
                    });
                    server.connection.play(stream, {seek: 0, volume: 1})
                        .on('finish', () => {
                            server.songArray.shift();
                            
                            if(server.songArray.length == 0) {
                                server.voice.leave();
                                serverMap.delete(guildId);
                            } else {
                                server.prevSong = server.currentSong;
                                server.previousSongs.unshift(server.prevSong);
                                playSong(guildId, server.songArray[0]);

                                if (server.prevCalled) {
                                    server.previousSongs.shift()
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
                let foundVideo = await findVideo(`${args.join(' ')} audio`);

                video = {
                    title: foundVideo.title,
                    thumbnail: foundVideo.thumbnail,
                    link: foundVideo.link
                }
            }

            if (!queue) {
                const songObj = {
                    voice: vc,
                    connection: 'not null or something',
                    text: message.channel,
                    currentSong: null,
                    songArray: [],
                    previousSongs: [],
                    prevSong: null,
                    prevCalled: false
                };

                serverMap.set(message.guild.id, songObj);
                songObj.songArray.push(video);
                
                try {
                    songObj.connection = await vc.join();
                    playSong(message.guild.id, songObj.songArray[0]);
                } catch (error) {
                    serverMap.delete(message.guild.id);
                    message.channel.send('Had trouble joining the voice channel');
                    throw error;
                }

            } else {
                queue.songArray.push(video);

                const queueEmbed = new MessageEmbed()
                    .setColor([2, 150, 255])
                    .setAuthor(`Added ${video.title} to the queue 👍`)
                    .setThumbnail(video.thumbnail)
                    .setTimestamp()
                    .setFooter(`${message.author.username}`, message.author.avatarURL({ dynamic:true }));

                queue.text.send(queueEmbed);
                return;
            }
        }
    }
}