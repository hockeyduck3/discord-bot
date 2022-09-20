module.exports = function skip(message, songArray, connection) {
    if (songArray == 0) {
        message.channel.send('There are no other songs to skip');
    } else {
        connection.dispatcher.end();
    }
}
