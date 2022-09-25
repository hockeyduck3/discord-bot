const { MessageEmbed } = require('discord.js');

let queueArr = [];

function makeQueuePrev(songObj) {
    let reverseArr = [...songObj.previousSongs];

    reverseArr.reverse();

    for(let i = 0; i < reverseArr.length; i++) {
        queueArr.push(reverseArr[i].title);
    }

    return;
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

    const embedMessage = {
        color: [255, 0, 255],
        title: 'Song History',
        author: {
            name: 'Tilly Music Player',
        },
        fields: [],
        timestamp: new Date().toISOString(),
    };

    
    queueArr.forEach(e => {
        embedMessage.fields.push({ name: '\u200B', value: `${e}`});
    })
        
        
    const queueMessage = new MessageEmbed(embedMessage)
    
    message.channel.send(queueMessage);
}
