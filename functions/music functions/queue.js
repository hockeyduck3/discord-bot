const { MessageEmbed } = require('discord.js');

let queueArr = [];

function makeQueuePrev(songObj) {
    let reverseArr = [...songObj.previousSongs];

    for(let i = 0; i < songObj.previousSongs.length; i++) {
        reverseArr.push(songObj.previousSongs[i]);
    }
}

function makeQueueNext(songObj) {
    for(let i = 0; i < songObj.songArray.length; i++) {
        console.log(`(Next) ${songObj.songArray[i].title}`);
    }
}

module.exports = function queue(songObj, message) {
    if (!songObj.songPlaying) return message.channel.send('Nothing\'s playing right meow');

    if (songObj.songArray.length == 0 && songObj.previousSongs.length == 0) return message.channel.send('There\'s currently nothing in your song history or in your song queue');

    if (songObj.previousSongs.length != 0) {
        makeQueuePrev(songObj);
    }

    if (songObj.songArray.length != 0) {
        makeQueueNext(songObj);
    }

    return;

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
