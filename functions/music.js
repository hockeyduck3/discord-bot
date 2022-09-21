const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const { MessageEmbed } = require('discord.js');
const skip = require('./music functions/skip');
const stop = require('./music functions/stop');

// Global Vars
let songArray = [];
let songObj = {songPlaying: false};
let connection;
let previousSongs = [];
let currentSong;
let prevSong;
let prevCalled;

module.exports = {
    name: ['play', 'p', 'skip', 'stop', 'leave', 'previous', 'prev'],
    description: 'play song in discord channel',
    async execute(message, args) {
        // Local Vars
        const vc = message.member.voice.channel;
        const command = message.content.substring(1).trim().split(/ +/).shift().toLowerCase();

        if (!vc) {
            message.reply('You gotta be in a voice channel bro');
            return;
        }

        const perms = vc.permissionsFor(message.client.user);

        if (!perms.has('CONNECT')) {
            message.reply('You\'re missing the CONNECT permission fool');
            return;
        }

        if (!perms.has('SPEAK')) {
                message.reply('You\'re missing the SPEAK permission fool');
                return;
        }

        // Everything for the play command
        if (command == 'play' || command == 'p') {
            if (!args.length) {
                message.reply('You need to add another argument bro');
                return;
            }

            let incomingVideo = args.join(' ');

            const findVideo = async (query) => {
                const result = await ytsearch(query);

                return (result.videos.length > 1) ? result.videos[0] : null;
            }

            const video = await findVideo(incomingVideo);

            if (!songObj.songPlaying) {
                connection = await vc.join();
                songObj.songPlaying = true;
            } else {
                songArray.push(video);

                const queueEmbed = new MessageEmbed()
                    .setColor([2, 150, 255])
                    .setAuthor(`Added ${video.title} to the queue 👍`)
                    .setThumbnail(video.image)
                    .setTimestamp()
                    .setFooter(`${message.author.username}`, message.author.avatarURL({ dynamic:true }));

                message.channel.send(queueEmbed);
                return;
            }

            const playSong = async(song) => {
                currentSong = song;

                const stream = ytdl(song.url, {filter: 'audioonly', quality: 'lowestaudio'}).on('error', err => {
                    console.log(err);
                    vc.leave();
                });
                connection.play(stream, {seek: 0, volume: 1})
                    .on('finish', () =>{
                        if(songArray.length == 0) {
                            songObj.songPlaying = false;
                            previousSongs = [];
                            songArray = [];
                            vc.leave();
                        } else {
                            prevSong = currentSong;
                            previousSongs.unshift(prevSong);
                            playSong(songArray[0]);
                            songArray.shift();

                            if (prevCalled) {
                                previousSongs.shift();
                                prevCalled = false;
                            }
                        }
                    });
        
                    const nowPlaying = new MessageEmbed()
                        .setColor([255, 0, 255])
                        .setAuthor('Tilly Music Player')
                        .addFields(
                            { name: `Playing ${song.title}`, value: `${song.url}` },
                            { name:'\u200B', value: '\u200B' },
                        )
                        .setThumbnail(song.image)
                        .setTimestamp()
            
                await message.channel.send(nowPlaying);
            }

            if (video) {
                playSong(video);
            } else {
                message.reply(`I couldn't find a video for that fam`);
                return;
            }
        }


        // Everything for the skip command
        if (command == 'skip') {
            if (!vc) {
                message.reply('You gotta be in a voice channel bro');
                return;
            }
            skip(message, songArray, connection);
        }


        // Everything for the stop / leave command
        if (command == 'stop' || command == 'leave') {
            if (!vc) {
                message.reply('You gotta be in a voice channel bro');
                return;
            }
            
            stop(songObj, connection, message);
        }

        // Everything for the previous song command
        if (command == 'previous' || command == 'prev') {
            if (!vc) {
                message.reply('You gotta be in a voice channel to make me leave fool');
                return;
            }

            if (previousSongs[0] != currentSong && previousSongs.length != 0) {
                songArray.unshift(currentSong);
                songArray.unshift(previousSongs[0]);
                previousSongs.shift();
                prevCalled = true;

                connection.dispatcher.end();
            } else {
                message.channel.send('There are no previous songs');
            }
        }

        if (command == 'queue' || command == 'q') {
            const nowPlaying = new MessageEmbed()
                .setColor([255, 0, 255])
                .setAuthor('Tilly Music Player')
                .addFields(
                    { name: `Playing ${song.title}`, value: `${song.url}` },
                    { name:'\u200B', value: '\u200B' },
                )
                .setThumbnail(song.image)
                .setTimestamp()
        
            message.channel.send(nowPlaying);
        }
    }
}
