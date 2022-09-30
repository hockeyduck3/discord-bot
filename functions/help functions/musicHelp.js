const { MessageEmbed } = require('discord.js');

module.exports = function musicHelp(message) {
    const musicMessage = new MessageEmbed()
        .setColor([255, 0, 5])
        .setAuthor('Tilly Help Center')
        .setTitle('Music Service')
        .setDescription('I get it. You\'re just sitting there pwning noobs or something and you need some epic battle music. Well, don\'t worry, I can be your DJ! 😁 There are multiple commands for this function. You can take a look at some examples down below.')
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Playing music', value: 'For me to actually start playing music I first need to know what you wanna hear. So you can say #p or #play and then give me a song name or a youtube link!', inline: true},
            { name: 'Stop', value: 'If at any point you want me to stop playing music just tell me to #stop or #leave. But just know, it may or may not hurt my feelings 😢', inline: true},
            { name: '\u200B', value: '\u200B' },
            { name: 'Skipping Music', value: 'Say you\'re listening to song a song that you\'re just not digging anymore. Well all you have to do is say #skip and I\'ll go to the next song in the queue! But just know this command won\'t work if there\'s nothing for me to skip to.', inline: true},
            { name: 'Previous track', value: 'Did you skip a track that you were actually digging? Well that was dumb. But luckily I have a command for that too. Just say #prev or #previous and I\'ll got back to the previous track. But just like the skip command, this command won\'t work if there\'s nothing for me to go back to.', inline: true},
            { name: '\u200B', value: '\u200B' },
            { name: 'See the queue', value: 'Did you already forget what songs you put into the queue? Well I guess if you want I can show you what\'s coming up next. Just say #q or #queue and I will show you the last song I played, the song that I am currently playing, and since you asked nicely I will show you the next 10 songs. Sound good? 👍' },
            { name: '\u200B', value: '\u200B' }
        )
        .setFooter('Just know that if I play a song you don\'t like, that\'s becasue you weren\'t specific enough 😊')

        message.channel.send(musicMessage);
}
