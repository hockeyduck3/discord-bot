const { MessageEmbed } = require('discord.js');

module.exports = function queue(songObj, message) {
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
