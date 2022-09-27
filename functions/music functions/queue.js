const { MessageEmbed } = require('discord.js');

let queueArr = [];

function makeQueue(songObj) {
    if(songObj.currentSong != null) {
        queueArr.push({name: '\u200B', value: `Current Song: [${songObj.currentSong.title}](${songObj.currentSong.url})`})
    }

    songObj.songArray.forEach(function (e, i) {
        queueArr.push({name: '\u200B', value: `${i+1}) [${e.title}](${e.url})`});
    });
}

module.exports = function queue(songObj, message) {
    if (!songObj.songPlaying) return message.channel.send('Nothing\'s playing right meow');

    if (songObj.songArray.length == 0 && songObj.prevSong == null) return message.channel.send('There\'s currently nothing in your song history or in your song queue');

    if (songObj.prevSong != null && songObj.prevSong != songObj.songArray[0]) {
        queueArr.push({name: '\u200B', value: `Previous Song: [${songObj.prevSong.title}](${songObj.prevSong.url})`})
    }

    if (songObj.songArray.length != 0) {
        makeQueue(songObj);
    }

    const embedMessage = {
        color: [50, 255, 150],
        author: {
            name: 'Tilly Music Player: Song Queue',
        },
        fields: [],
        timestamp: new Date().toISOString(),
    };

    
    queueArr.forEach(e => {
        embedMessage.fields.push(e);
    });

    embedMessage.fields.push({ name: '\u200B', value: '\u200B'});
        
        
    const queueMessage = new MessageEmbed(embedMessage);
    
    message.channel.send(queueMessage);
    queueArr = [];
}
