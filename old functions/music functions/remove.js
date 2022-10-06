module.exports = function remove(guild, arg) {
    let songName = guild.songArray[arg-1].title;

    guild.songArray.splice(arg-1, 1);

    guild.text.send(`${songName} has been removed from the queue`);

    return;
}
