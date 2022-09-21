module.exports = function skip(songObj, connection, message) {
    if (songObj.songArray.length == 0) {
        message.channel.send('There are no other songs to skip');
    } else {
        connection.dispatcher.end();
    }
}
