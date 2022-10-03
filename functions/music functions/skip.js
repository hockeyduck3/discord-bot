module.exports = function skip(guild) {
    if (guild.songArray.length == 0) {
        guild.text.send('There are no other songs to skip');
    } else {
        guild.connection.dispatcher.end();
    }
}
