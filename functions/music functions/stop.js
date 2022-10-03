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

module.exports = function stop(guild, message) {
    guild.connection.dispatcher.end();
    guild.text.send(`${answerArr[Math.floor(Math.random() * answerArr.length)]}`);
    
    return;
}