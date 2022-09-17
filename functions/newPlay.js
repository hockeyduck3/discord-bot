const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const { MessageEmbed } = require('discord.js');

const queue = new Map();

module.exports = {
    name: ['no'],
    description: 'Music bot V2',
    async execute(message, args) {
        let command = message.content.substring(1).trim().split(/ +/).shift();
        command = command.replace(/[0-9]/g, '');

        const vc = message.member.voice.channel;

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

        if (!args.length) {
            message.reply('You need to add another argument bro');
            return;
        }
        
        let serverQueue = queue.get(message.guild.id);

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
                    voiceChannel: message.member.voice.channel,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);
    
                try {
                    const connection = await vc.join();
                    // const leave = vc.leave();
                    queueConstruct.connection = connection;
                    playSong(message.guild, queueConstruct.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('Looks like there was an error joining.');
                    console.log(err);
                }
            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                message.reply(`Added ${song.title} to the queue`);
            }
        }
    }
}

const playSong = async(guild, song) => {
    const songQueue = queue.get(guild.id);
    
    if (!song) {
        // leave;
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, {filter: 'audioonly', quality: 'lowestaudio'}).on('error', err => {
        songQueue.textChannel.send('Looks like there was an error');
        console.log(err);
    });
    
    songQueue.connection.play(stream, {seek: 0, volume: 1})
    .on('finish', () => {
        songQueue.songs.shift();
        playSong(songQueue.vc, queueConstruct.songs[0]);
    });

    await songQueue.textChannel.send(`Now playing ${song.title}`);
}
