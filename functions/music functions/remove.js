module.exports = function remove(songObj, message, arg) {
    let songName = songObj.songArray[arg-1].title;

    songObj.songArray.splice(arg-1, 1);

    message.reply(`${songName} has been removed from the queue`);

    console.log(songObj.songArray);
    return;
}
