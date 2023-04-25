const { serverMap } = require('../external music functions/serverMap');

const channelMap = new Map();

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(oldState, newState) {
        const guildId = oldState.guild.id;
        const server = serverMap.get(guildId);

        if (oldState.channel != null) {
            if (oldState.channel.members.size - 1 == 0) {
                if (server) {
                    const channelObj = {
                        channelEmpty: true
                    }

                    channelMap.set(guildId, channelObj);

                    leaveChannel(guildId);
                }
            }
        }
        
        if (newState.channel != null) {
            if (newState.channel.members.size != 0) {
                const channel = channelMap.get(guildId);

                if (server && channel) {
                    channel.channelEmpty = false;
                }
            }
        }
    }
}


function leaveChannel(guildId) {
    setTimeout(async () => {
        const server = serverMap.get(guildId);

        const channel = channelMap.get(guildId);

        if (server && channel.channelEmpty) {
            deleteNowPlaying(server);

            server.connection.destroy();

            serverMap.delete(guildId);
        } 
        
        else {
            return;
        }

    }, 30000);
}