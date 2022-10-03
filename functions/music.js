const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');
const { MessageEmbed } = require('discord.js');
const stop = require('./music functions/stop');
const skip = require('./music functions/skip');
const queueFunc = require('./music functions/queue');
const previous = require('./music functions/previous');
const remove = require('./music functions/remove');

const serverMap = new Map();

module.exports = {
    name: ['play', 'p', 'stop', 'leave', 'skip', 'queue', 'q', 'previous', 'prev', 'remove'],
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
                    connection: null,
                    text: message.channel,
                    currentSong: null,
                    songArray: [],
                    previousSongs: [],
                    prevSong: null,
                    prevCalled: false,
                    stopCalled: false
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

        if (command == 'stop' || command == 'leave') {
            let guild = serverMap.get(message.guild.id);

            if (!vc) return message.reply('You gotta be in the voice channel fam');

            if (!guild) return message.reply('I\'m not even playing anything');

            guild.stopCalled = true;

            stop(guild, command);

            serverMap.delete(message.guild.id);
        }

        if (command == 'skip') {
            let guild = serverMap.get(message.guild.id);

            if (!vc) return message.reply('You gotta be in the voice channel fam');

            if (!guild) return message.reply('I\'m not even playing anything');

            skip(serverMap.get(message.guild.id));
        }

        if (command == 'previous' || command == 'prev') {
            let guild = serverMap.get(message.guild.id);

            if (!vc) return message.reply('You gotta be in the voice channel fam');

            if (!guild) return message.reply('I\'m not even playing anything');

            previous(guild);
        }

        if (command == 'queue' || command == 'q') {
            let guild = serverMap.get(message.guild.id);

            if (!vc) return message.reply('You gotta be in the voice channel fam');

            if (!guild) return message.reply('Nothing\'s playing right meow');

            queueFunc(serverMap.get(message.guild.id));
        }

        if (command == 'remove') {
            let guild = serverMap.get(message.guild.id);

            if (!vc) return message.reply('You gotta be in the voice channel fam');

            if (!guild) return message.reply('Nothing\'s playing right meow');

            if (args.length == 0) return message.reply('You didn\'t send enough arguments for me to work with. Try also sending the number of the song you want me to remove.');

            if(!Number.isInteger(parseInt(args[0]))) return message.reply('I need you to tell me the number of the song you want me to remove. So it should look like "#remove 1". Or if you don\'t know the number of the song in the queue that you want to remove say #queue.');

            if (args.length > 1) return message.reply('I can only remove 1 song at the moment');

            if (guild.songArray.length <= 0) return message.reply('There\'s nothing in the queue for me to remove');

            remove(guild, parseInt(args[0]));
        }
    }
}