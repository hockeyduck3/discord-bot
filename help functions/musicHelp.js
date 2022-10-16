const { EmbedBuilder } = require('discord.js');

module.exports = function musicHelp(interaction) {
    const musicMessage = new EmbedBuilder()
        .setColor([255, 0, 5])
        .setAuthor({
            name: 'Tilly Help Center'
        })
        .setTitle('Music Service')
        .setDescription('I get it. You\'re just sitting there pwning noobs or something and you need some epic battle music. Well, don\'t worry, I can be your DJ! 😁 There are multiple commands for this function. You can take a look at some examples down below.')
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Playing music', value: 'For me to actually start playing music I first need to know what you wanna hear. So you can say "/play" and then give me a song name or a youtube link! Youtube playlist links also work 😁', inline: true},
            { name: 'Stop', value: 'If at any point you want me to stop playing music just tell me "/stop".', inline: true},
            { name: '\u200B', value: '\u200B' },
            { name: 'Skipping Music', value: 'Say you\'re listening to song a song that you\'re just not digging anymore. Well all you have to do is say "/skip" and I\'ll go to the next song in the queue! But just know this command won\'t work if there\'s nothing for me to skip to.', inline: true},
            { name: 'Previous track', value: 'Did you skip a track that you were actually digging? Well that was dumb. But luckily I have a command for that too. Just say "/prev" and I\'ll got back to the previous track. But just like the skip command, this command won\'t work if there\'s nothing for me to go back to.', inline: true},
            { name: '\u200B', value: '\u200B' },
            { name: 'See the queue', value: 'Did you already forget what songs you put into the queue? Well I guess if you want I can show you what\'s coming up next. Just say "/queue" and I will show you the last song I played, the song that I am currently playing, and since you asked nicely I will show you the next 10 songs. Sound good? 👍', inline: true },
            { name: 'Loop the queue', value: 'Do you hate it when the music stops? yeah so do I, but if you don\'t want the music to stop you can have the queue on an infinite loop! Just say "/loop" and the music will just keep playing... Forever... And ever... Or something. But just know that this will make the /previous function not work anymore 🤷‍♀️ ', inline: true },
            { name: '\u200B', value: '\u200B' }
        )
        .setFooter({
            text: 'Just know that if I play a song you don\'t like, that\'s becasue you weren\'t specific enough 😊'
        })

        interaction.reply({
            embeds: [musicMessage],
            ephemeral: true
        })
}
