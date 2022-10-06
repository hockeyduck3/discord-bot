module.exports = function previous(guild) {
    if (guild.previousSongs[0] != guild.currentSong && guild.previousSongs.length != 0) {
        guild.songArray.unshift(guild.currentSong)
        guild.songArray.unshift(guild.previousSongs[0]);
        guild.previousSongs.shift();
        guild.prevCalled = true;

        guild.connection.dispatcher.end();
    } else {
        guild.text.send('There are no previous songs');
    }

    return;
}