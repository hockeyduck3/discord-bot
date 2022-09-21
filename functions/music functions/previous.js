module.exports = function previous(songObj, connection, message) {
    if (songObj.previousSongs[0] != songObj.currentSong && songObj.previousSongs.length != 0) {
        songObj.songArray.unshift(songObj.currentSong)
        songObj.songArray.unshift(songObj.previousSongs[0]);
        songObj.previousSongs.shift();
        songObj.prevCalled = true;

        connection.dispatcher.end();
    } else {
        message.channel.send('There are no previous songs');
    }

    return;
}