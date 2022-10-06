const { MessageEmbed } = require('discord.js');

let queueArr = [];
let queueArrNum = 0;

function makeQueue(guild) {
    if(guild.currentSong != null) {
        queueArr.push({name: '\u200B', value: `Current Song: [${guild.currentSong.title}](${guild.currentSong.link})`})
    }

    for (let i = 0; i < guild.songArray.length; i++) {
        if (i != 10) {
            queueArr.push({name: '\u200B', value: `${i+1}) [${guild.songArray[i].title}](${guild.songArray[i].link})`});
        } else {
            queueArrNum = guild.songArray.length - 10;
            break;
        }
    }
}

module.exports = function queue(guild) {
    if (guild.songArray.length == 0 && guild.prevSong == null) return guild.text.send('There\'s currently nothing in your song history or in your song queue');

    if (guild.prevSong != null && guild.prevSong != guild.songArray[0]) {
        queueArr.push({name: '\u200B', value: `Previous Song: [${guild.prevSong.title}](${guild.prevSong.link})`})
    }

    if (guild.songArray.length != 0) {
        makeQueue(guild);
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
    
    guild.text.send(queueMessage);
    queueArr = [];
}
