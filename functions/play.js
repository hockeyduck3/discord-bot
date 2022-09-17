const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const { MessageEmbed } = require('discord.js');

let songArray = [];

module.exports = {
    name: ['play', 'p'],
    description: 'play song in discord channel',
    async execute(message, args) {
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

        const connection = await vc.join();

        const findVideo = async (query) => {
            const result = await ytsearch(query);

            return (result.videos.length > 1) ? result.videos[0] : null;
        }

        const video = await findVideo(args.join(' '));

        if (video) {
            const stream = ytdl(video.url, {filter: 'audioonly', quality: 'lowestaudio'}).on('error', err => {
                console.log(err);
                vc.leave();
            });
            connection.play(stream, {seek: 0, volume: 1})
                .on('finish', () =>{
                    vc.leave();
                });

                const videoEmbed = new MessageEmbed()
                    .setColor([255, 0, 255])
                    .setAuthor('Util Music')
                    .addFields(
                        { name: `Playing ${video.title}`, value: `${video.url}` },
                        { name:'\u200B', value: '\u200B' },
                    )
                    .setThumbnail(video.image)
                    .setTimestamp()
                    .setFooter(`${message.author.username}`, message.author.avatarURL({ dynamic:true }));

            await message.channel.send(videoEmbed);
        } else {
            message.reply(`I couldn't find a video for that fam`);
            return;
        }

    }
}
