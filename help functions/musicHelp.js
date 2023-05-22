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
            { name: 'Stop the music', value: 'If at any point you want me to stop playing music just tell me to "/leave". But just no, I can be stubborn sometimes 😈', inline: true},
            { name: 'Pausing Music', value: 'Are you about to drop the dopest music track of the year on your group but one of them is like "Oh hold up I have the world\'s smallest bladder"? Well don\'t worry. Just tell me "/pause" and I\'ll pause that dope track till your pal gets back 😤', inline: true},
            { name: '\u200B', value: '\u200B' },
            { name: 'Resuming Music', value: 'Did your buddy finally get back from their bathroom break? Well just let me know by saying "/play" and I\'ll keep playing that dope music y\'all are addicted to 👌', inline: true},
            { name: 'Skipping Music', value: 'Say you\'re listening to song a song that you\'re just not digging anymore. Well all you have to do is say "/skip" and I\'ll go to the next song in the queue! But just know this command won\'t work if there\'s nothing for me to skip to.', inline: true},
            { name: 'Previous track', value: 'Did you skip a track that you were actually digging? Well that was dumb. But luckily I have a command for that too. Just say "/previous" and I\'ll got back to the previous track. But just like the skip command, this command won\'t work if there\'s nothing for me to go back to.', inline: true},
            { name: '\u200B', value: '\u200B' },
            { name: 'See the queue', value: 'Did you already forget what songs you put into the queue? Well I guess if you want I can show you what\'s coming up next. Just say "/queue" and I will show you the last song I played, the song that I am currently playing, and since you asked nicely I will show you the next 10 songs. Sound good? 👍 I\'ll also show you if the queue is set to loop or not 😁', inline: true },
            { name: 'Loop the queue', value: 'Do you hate it when the music stops? Yeah so do I, but if you don\'t want the music to stop you can have the queue on an infinite loop! Just say "/loop" and the music will just keep playing... Forever... And ever... Or something. 🤷‍♀️ ', inline: true },
            { name: 'Play this song next', value: 'Did you wanna show your mates a new song but some guys already queued up 23 different songs? Well don\'t worry, I\'m a DJ that takes bribes 🤫. Just tell me "/playnext (insert cool song here)" and I\'ll play that one next!', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Remove a song from the queue', value: 'Did you put on a song you didn\'t like? Or maybe your best bud put on a HUGE flipping playlist with 6000 songs on it? Well I can remove songs from the queue for ya! If you wanna remove 1 song, just say "/remove song" then give me the number of the song you wanna remove. If you don\'t know what the number of the song is say "/queue". Or... If you wanna remove every flipping song in the queue. just say "/remove all" but just know, you may piss of your mates...', inline: true },
            { name: '\u200B', value: '\u200B' },
        )
        .setFooter({
            text: 'Just know that if I play a song you don\'t like, that\'s becasue you weren\'t specific enough 😊'
        })

        interaction.reply({
            embeds: [musicMessage],
            ephemeral: true
        })
}
