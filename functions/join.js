module.exports = {
    name: 'join',
    description: 'Join discord channel',
    execute(message, args) {
        const vc = message.member.voice.channel;

        if (!vc) {
            message.reply('You gotta be in a voice channel bruh');
        } else {
            vc.join();
        }
    }
}