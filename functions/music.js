const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const { MessageEmbed } = require('discord.js');

let songArray = [];
let songPlaying = false;
let connection;

module.exports = {
    name: ['play', 'p', 'skip', 'stop', 'leave'],
    description: 'play song in discord channel',
    async execute(message, args) {
        const vc = message.member.voice.channel;
        const command = message.content.substring(1).trim().split(/ +/).shift();

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
                message.channel.send(`Added ${video.title} to the queue`);
                return;
            }

            const playSong = async(song) => {
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
                            console.log(songArray == 0);
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

        if (command == 'skip') {
            if (!vc) {
                message.reply('You gotta be in a voice channel bro');
                return;
            } else if (songArray == 0) {
                message.channel.send('There are no other songs to skip');
            } else {
                connection.dispatcher.end();
            }
        }

        if (command == 'stop') {
            if (!vc) {
                message.reply('You gotta be in a voice channel bro');
                return;
            } else {
                songArray = [];
                connection.dispatcher.end();
                songPlaying = false;
                return;
            }
        }

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
            connection.dispatcher.end();
            songPlaying = false;

            await message.reply(`${answerArr[Math.floor(Math.random() * answerArr.length)]}`);
            return;
        }
    }
}