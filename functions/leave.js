module.exports = {
    name: 'leave',
    description: 'Get\'s util to leave the voice channel',
    async execute(message, args) {
        const vc = message.member.voice.channel;

        if (!vc) {
            message.reply('You gotta be in a voice channel to make me leave fool');
            return;
        }

        await vc.leave();
        await message.reply('FINE I\'LL LEAVE');
        return;
    }
}