const answerArr = [
    'https://media.giphy.com/media/KB59SOANzxlaU/giphy.gif',
    'https://media.giphy.com/media/MmuJfAxgysL5LajJMj/giphy.gif',
    'https://tenor.com/bbPdG.gif',
    'Fine, have it your way. 🙂',
    `*sniff* you're soooo meannnn! But I guess I'll go 😿`,
    `Oh WOWWWWWW. I see how it is. 😠`,
    'https://tenor.com/blRIR.gif',
    'https://tenor.com/bFH99.gif'
];

module.exports = function stop(songObj, connection, message) {
    if (!songObj.songPlaying) {
        message.reply(`I'm not even in the voice channel fool`);
    } else {
        songObj.songPlaying = false;
        songObj.songArray = [];
        songObj.previousSongs = [];
        songObj.currentSong = null;
        songObj.prevSong = null;
        connection.dispatcher.end();
        message.channel.send(`${answerArr[Math.floor(Math.random() * answerArr.length)]}`);
    }
    
    return;
}