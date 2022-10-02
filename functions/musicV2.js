const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');
const { MessageEmbed } = require('discord.js');
const { Console } = require('console');

const serverMap = new Map();

let songObj = {
    songPlaying: false,
    currentSong: null,
    songArray: [],
    previousSongs: [],
    prevSong: null,
    prevCalled: false
};

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

        const server = serverMap.get(message.guild.id);

        if (command == 'play' || command == 'p') {
            if (!args.length) return message.reply('You need to add another argument bro');

            let checkArg = ytdl.validateURL(args[0]);

            let video;

            const findVideo = async (query) => {
                const result = await youtube.search(query);

                return (result.videos.length >= 1) ? result.videos[0] : null;
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
        }
    }
}