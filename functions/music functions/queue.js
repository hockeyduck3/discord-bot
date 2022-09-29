const { MessageEmbed } = require('discord.js');

let queueArr = [];
let queueArrNum = 0;

function makeQueue(songObj) {
    if(songObj.currentSong != null) {
        queueArr.push({name: '\u200B', value: `Current Song: [${songObj.currentSong.title}](${songObj.currentSong.link})`})
    }

    for (let i = 0; i < songObj.songArray.length; i++) {
        if (i != 10) {
            queueArr.push({name: '\u200B', value: `${i+1}) [${songObj.songArray[i].title}](${songObj.songArray[i].link})`});
        } else {
            queueArrNum = songObj.songArray.length - 10;
            break;
        }
    }
}

module.exports = function queue(songObj, message) {
    if (!songObj.songPlaying) return message.channel.send('Nothing\'s playing right meow');

    if (songObj.songArray.length == 0 && songObj.prevSong == null) return message.channel.send('There\'s currently nothing in your song history or in your song queue');

    if (songObj.prevSong != null && songObj.prevSong != songObj.songArray[0]) {
        queueArr.push({name: '\u200B', value: `Previous Song: [${songObj.prevSong.title}](${songObj.prevSong.link})`})
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

    if (queueArrNum != 0) {
        embedMessage.fields.push({ name: '\u200B', value: `and ${queueArrNum} more songs`});
        queueArrNum = 0;
    }

    embedMessage.fields.push({ name: '\u200B', value: '\u200B'});
        
        
    const queueMessage = new MessageEmbed(embedMessage);
    
    message.channel.send(queueMessage);
    queueArr = [];
}
