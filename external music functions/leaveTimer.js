const { EmbedBuilder } = require('discord.js');

const { serverMap } = require('./serverMap');

module.exports = function leaveTimer(server, guildId) {
    setTimeout(() => {
        if (!server) {
            return;
        } 
        
        else if (server.audioStatus == 'stopped') {

            const leaveEmbed = new EmbedBuilder()
                    .setColor([2, 12, 25])
                    .setAuthor({
                        name: 'Tilly Music Player',
                        iconURL: 'https://i.pinimg.com/474x/80/3a/1f/803a1f2849f12dde465ab9143f50187e.jpg'
                    })
                    .setDescription('I haven\'t gotten any new song requests in a hot minute, so I\'m gonna head out. ✌️')

            server.text.send({
                embeds: [leaveEmbed]
            })

            server.connection.destroy();
            serverMap.delete(guildId);

        } else {
            return;
        }
    }, 1000);
}
