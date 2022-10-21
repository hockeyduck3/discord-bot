const { serverMap } = require('../external music functions/serverMap');
module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(oldState, newState) {
        if (oldState.channel != null) {
            if (oldState.channel.members.size - 1 == 0) {
                const guildId = oldState.guild.id;

                const server = serverMap.get(guildId);
                
                if (server) {
                    server.connection.destroy();

                    await server.nowPlaying.delete();

                    server.text.send('You guys left me to play music for no one. RUDE!');

                    serverMap.delete(guildId);
                }
            }
        }
        
        if (newState.channel != null) {
            console.log(`newState size: ${newState.channel.members.size}`);
        }
    }
}
