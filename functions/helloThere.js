module.exports = {
    name: 'hello there',
    description: 'Short little Star Wars Easter egg',
    execute(message) {
        message.channel.send('https://media.giphy.com/media/8JTFsZmnTR1Rs1JFVP/giphy.gif');
    }
}
