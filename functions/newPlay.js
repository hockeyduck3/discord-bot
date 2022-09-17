const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const { MessageEmbed } = require('discord.js');

const queue = new Map();

module.exports = {
    name: ['play2','p2', 'skip', 'stop'],
    description: 'Music bot V2',
    cooldown: 0,
    async execute(message, args) {
        let command = message.content.substring(1).match(/play|p|skip|stop/g);
        const vc = message.member.voice.channel;

        // if (!vc) {
        //     message.reply('You gotta be in a voice channel bro');
        //     return;
        // }

        const perms = vc.permissionsFor(message.client.user);

        // if (!perms.has('CONNECT')) {
        //     message.reply('You\'re missing the CONNECT permission fool');
        //     return;
        // }

        // if (!perms.has('SPEAK')) {
        //         message.reply('You\'re missing the SPEAK permission fool');
        //         return;
        // }

        if (!args.length) {
            message.reply('You need to add another argument bro');
            return;
        }

        let serverQueue = queue.get(vc);

        if (command == 'play' || command == 'p') {
            if (!args.length) {
                message.reply('You need to add another argument bro');
                return;
            }

            let song = {};

            if (ytdl.validateURL(args[0])) {
                let songInfo = await ytdl.getInfo(args[0]);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.url
                }
            } else {
                const findVideo = async (query) => {
                    const result = await ytsearch(query);
        
                    return (result.videos.length > 1) ? result.videos[0] : null;
                }

                const video = await findVideo(args.join(' '));

                if (video) {
                    song = {
                        title: video.title,
                        url: video.url
                    }
                } else {
                    message.channel.send('Sorry I couldn\'t find that video');
                }
            }

            if (!serverQueue) {
                const queueConstruct = {
                    voiceChannel: vc,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(vc, queueConstruct);
                queueConstruct.songs.push(song);
    
                try {
                    const connection = await vc.join();
                    queueConstruct.connection = connection;
                    playSong(vc, queueConstruct.songs[0]);
                } catch (err) {
                    queue.delete(vc);
                    message.channel.send('Looks like there was an error joining.');
                    console.log(err);
                }
            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue);
                message.reply(`Added ${song.title} to the queue`);
            }
        }
    }
}

const playSong = async(channel, song) => {
    const songQueue = queue.get(channel);

    console.log(queue);

    if (!song) {
        songQueue.vc.leave();
        queue.delete(vc);
        return;
    }

    const stream = ytdl(song.url, {filter: 'audioonly', quality: 'lowestaudio'}).on('error', err => {
        message.channel.send('Looks like there was an error');
        console.log(err);
    });
    
    songQueue.connection.play(stream, {seek: 0, volume: 1})
    .on('finish', () => {
        songQueue.songs.shift();
        playSong(songQueue.vc, queueConstruct.songs[0]);
    });

    await songQueue.textChannel.send(`Now playing ${song.title}`);
}
