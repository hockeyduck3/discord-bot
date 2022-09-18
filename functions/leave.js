module.exports = {
    name: 'oof',
    description: 'Get\'s util to leave the voice channel',
    async execute(message, args) {
        const vc = message.member.voice.channel;

        if (!vc) {
            message.reply('You gotta be in a voice channel to make me leave fool');
            return;
        }

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

        await vc.leave();
        await message.reply(`${answerArr[Math.floor(Math.random() * answerArr.length)]}`);
        return;
    }
}