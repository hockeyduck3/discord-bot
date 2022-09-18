const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const { MessageEmbed } = require('discord.js');

// Global Vars
let songArray = [];
let songPlaying = false;
let connection;
let previousSongs = [];
let currentSong;

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

            if (!songPlaying) {
                connection = await vc.join();
                songPlaying = true;
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
                            vc.leave();
                        } else {
                            playSong(songArray[0]);
                            songArray.shift();
                        }
                    });
        
                    const nowPlaying = new MessageEmbed()
                        .setColor([255, 0, 255])
                        .setAuthor('Util Music')
                        .addFields(
                            { name: `Playing ${song.title}`, value: `${song.url}` },
                            { name:'\u200B', value: '\u200B' },
                        )
                        .setThumbnail(song.image)
                        .setTimestamp()
                        .setFooter(`${message.author.username}`, message.author.avatarURL({ dynamic:true }));
            
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
            } else if (songArray == 0) {
                message.channel.send('There are no other songs to skip');
            } else {
                previousSongs.unshift(currentSong);
                connection.dispatcher.end();
            }
        }


        // Everything for the stop command
        if (command == 'stop') {
            if (!vc) {
                message.reply('You gotta be in a voice channel bro');
                return;
            } else {
                songArray = [];
                previousSongs = [];
                connection.dispatcher.end();
                songPlaying = false;
                return;
            }
        }


        //Everything for the leave command
        if (command == 'leave') {
            if (!vc) {
                message.reply('You gotta be in a voice channel to make me leave fool');
                return;
            }
    
            const answerArr = [
                'https://media.giphy.com/media/KB59SOANzxlaU/giphy.gif',
                'https://media.giphy.com/media/MmuJfAxgysL5LajJMj/giphy.gif',
                'https://tenor.com/bbPdG.gif',
                'Fine, have it your way. 🙂',
                `*sniff* you're soooo meannnn! But I guess I'll go 😿`,
                `Oh WOWWWWWW. I see how it is. 😠`,
                'https://tenor.com/blRIR.gif',
                'https://tenor.com/bFH99.gif'
            ];
    
            songArray = [];
            previousSongs = [];
            vc.leave();
            songPlaying = false;

            await message.reply(`${answerArr[Math.floor(Math.random() * answerArr.length)]}`);
            return;
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

                connection.dispatcher.end();

                previousSongs.shift();
            } else {
                message.channel.send('There are no previous songs');
            }
        }
    }
}
