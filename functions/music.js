const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');
const { MessageEmbed } = require('discord.js');
const skip = require('./music functions/skip');
const stop = require('./music functions/stop');
const previous = require('./music functions/previous');
const queue = require('./music functions/queue');
const remove = require('./music functions/remove');

// Global Vars
let songObj = {
    songPlaying: false,
    currentSong: null,
    songArray: [],
    previousSongs: [],
    prevSong: null,
    prevCalled: false
};

let connection;

module.exports = {
    name: ['play', 'p', 'skip', 'stop', 'leave', 'previous', 'prev', 'queue', 'remove'],
    description: 'play song in discord channel',
    async execute(message, args) {
        // Local Vars
        const vc = message.member.voice.channel;
        const command = message.content.substring(1).trim().split(/ +/).shift().toLowerCase();
        let incomingVideo;

        if (!vc) return message.reply('You gotta be in a voice channel');

        const perms = vc.permissionsFor(message.client.user);

        if (!perms.has('CONNECT')) return message.reply('You\'re missing the CONNECT permission');

        if (!perms.has('SPEAK')) return message.reply('You\'re missing the SPEAK permission fool');       

        // Everything for the play command
        if (command == 'play' || command == 'p') {
            if (!args.length) return message.reply('You need to add another argument bro');

            let testArg = ytdl.validateURL(args.join(' '));

            if (testArg) {
                incomingVideo = ytdl.getURLVideoID(args.join(' '));
            } else {
                incomingVideo = `${args.join(' ')} audio`;
            }

            const findVideo = async (query) => {
                const result = await youtube.search(query);

                return (result.videos.length >= 1) ? result.videos[0] : null;
            }

            const video = await findVideo(incomingVideo);

            if (!songObj.songPlaying) {
                connection = await vc.join();
                songObj.songPlaying = true;
            } else {
                songObj.songArray.push(video);

                const queueEmbed = new MessageEmbed()
                    .setColor([2, 150, 255])
                    .setAuthor(`Added ${video.title} to the queue 👍`)
                    .setThumbnail(video.thumbnail)
                    .setTimestamp()
                    .setFooter(`${message.author.username}`, message.author.avatarURL({ dynamic:true }));

                message.channel.send(queueEmbed);
                return;
            }

            const playSong = async(song) => {
                songObj.currentSong = song

                const stream = ytdl(song.link, {filter: 'audioonly', quality: 'lowestaudio', highWaterMark: 1<<25}).on('error', err => {
                    console.log(err);
                    vc.leave();
                });
                connection.play(stream, {seek: 0, volume: 1})
                    .on('finish', () =>{
                        if(songObj.songArray.length == 0) {
                            songObj.songPlaying = false;
                            songObj.previousSongs = [];
                            songObj.songArray = [];
                            vc.leave();
                        } else {
                            songObj.prevSong = songObj.currentSong;
                            songObj.previousSongs.unshift(songObj.prevSong);
                            playSong(songObj.songArray[0]);
                            songObj.songArray.shift()

                            if (songObj.prevCalled) {
                                songObj.previousSongs.shift()
                                songObj.prevCalled = false;
                            }
                        }
                    });
        
                    const nowPlaying = new MessageEmbed()
                        .setColor([255, 0, 255])
                        .setAuthor('Tilly Music Player')
                        .addFields(
                            { name: `Playing ${song.title}`, value: `${song.link}` },
                            { name:'\u200B', value: '\u200B' },
                        )
                        .setThumbnail(song.thumbnail)
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
            if (!vc) return message.reply('You gotta be in a voice channel bro');

            skip(songObj, connection, message);
        }


        // Everything for the stop / leave command
        if (command == 'stop' || command == 'leave') {
            if (!vc) return message.reply('You gotta be in a voice channel');
            
            stop(songObj, connection, message);
        }

        // Everything for the previous song command
        if (command == 'previous' || command == 'prev') {
            if (!vc) return message.reply('You gotta be in a voice channel');

            previous(songObj, connection, message);
        }

        if (command == 'queue' || command == 'q') {
            if (!vc) return message.reply('You gotta be in a voice channel');

            queue(songObj, message);
        }

        if (command == 'remove') {
            if (!songObj.songPlaying) return message.reply('I\'m not playing anything right meow');

            if (args.length == 0) return message.reply('You didn\'t send enough arguments for me to work with. Try also sending the number of the song you want me to remove.');

            if(!Number.isInteger(parseInt(args[0]))) return message.reply('I need you to tell me the number of the song you want me to remove. So it should look like "#remove 1". Or if you don\'t know the number of the song in the queue that you want to remove say #queue.');

            if (args.length > 1) return message.reply('I can only remove 1 song at the moment');

            if (songObj.songArray.length <= 0) return message.reply('There\'s nothing in the queue for me to remove');

            remove(songObj, message, parseInt(args[0]));
        }
    }
}
