const { SlashCommandBuilder } = require('@discordjs/builders');

const { serverMap } = require('../../external music functions/serverMap');

const noUArr = [
    'No u 😈',
    'https://media.giphy.com/media/VF5ZXlzQ8VcMpgJr1G/giphy.gif',
    'https://media.giphy.com/media/7t38CLCY8t5EXmqcMK/giphy.gif',
    'https://media.giphy.com/media/jKgPkwFkbGmetejZ2u/giphy.gif',
    'https://media.giphy.com/media/Jo85Nij8XBKRvY5O00/giphy.gif',
    'https://media.giphy.com/media/kglJT6YSEdxSEpfrEd/giphy.gif',
    'https://media.giphy.com/media/8US6ERbtKbVfCLeHc7/giphy.gif',
    'https://media.giphy.com/media/deSTGRBAr6TdkVEjCd/giphy.gif',
    'https://media.giphy.com/media/rmB3rb84YsKyQnskLQ/giphy.gif',
    'https://media.giphy.com/media/qcOxCNCKfHN1C/giphy.gif'
]

const replyArr = [
    'Alright alright I\'m leaving',
    'https://media.giphy.com/media/j0qSbeNFuzjhXKFVSP/giphy.gif',
    'https://media.giphy.com/media/hqmzPlrAteDNerrdSS/giphy.gif',
    'https://media.giphy.com/media/THD261FU1WnMMzrkVr/giphy.gif',
    'https://media.giphy.com/media/QXIRBnEsbzGT7m47m3/giphy.gif',
    'https://media.giphy.com/media/ClZxQjtI4XqdJnW3yR/giphy.gif',
    'https://media.giphy.com/media/ue0y2SeL6dm4oggCNG/giphy.gif',
    'https://media.giphy.com/media/iwMMHNWwUQGVJtOQWq/giphy.gif',
    'https://media.giphy.com/media/3oxQNE2ZFiRpZmWrkc/giphy.gif',
    'https://media.giphy.com/media/fXoE7kAutbcrvy4jge/giphy.gif',
    'https://media.giphy.com/media/PkdJwX4euzzKcLHU9K/giphy.gif',
    'https://media.giphy.com/media/K1WqNpQ4rjqaq9KIg8/giphy.gif',
    'https://media.giphy.com/media/BxZp4M3yL2M5oV1iFw/giphy.gif',
    'https://media.giphy.com/media/3ohc0XwQRCBNPG7B6M/giphy.gif',
    'https://media.giphy.com/media/3o752fMjyVeEWncbkI/giphy.gif',
    'https://media.giphy.com/media/OPTr1SNFM5vfXZDN9S/giphy.gif',
    'https://media.giphy.com/media/1KtHA6UaOaTn2/giphy.gif',
    'https://media.giphy.com/media/RSoXHJhf4Bh2aYagVO/giphy.gif',
    'https://media.giphy.com/media/sG2SZ1dPbFUuOrUn5a/giphy.gif',
    'https://media.giphy.com/media/L2wzqNa9gT2XWCDqRc/giphy.gif',
    'https://media.giphy.com/media/TNhe3ZxgsEGJ2VICi5/giphy.gif'

]

module.exports = {
    data: new SlashCommandBuilder()
            .setName('leave')
            .setDescription('If you don\'t want me in the VC anymore I can go... But I may not be happy about it...'),

    async execute (interaction) {
        const vc = interaction.member.voice.channel;
        let server = serverMap.get(interaction.guild.id);

        if (!vc) return interaction.reply({
            content: 'You gotta be in a voice channel',
            ephemeral: true
        });

        if (!server) return interaction.reply({
            content: 'Nothing\'s playing right meow',
            ephemeral: true
        });

        const randomNumber = Math.floor(Math.random() * 1001);

        if (randomNumber === 1000) {
            let user = await interaction.guild.members.fetch(interaction.user.id);
            interaction.reply(noUArr[Math.floor(Math.random() * noUArr.length)]);

            setTimeout(() => {
                user.voice.disconnect()
            }, 1800);
            return;
        } 

        if (server.audioStatus != 'stopped') {
            try {
                await server.nowPlaying.delete();
            } catch (err) {
                console.log(err);
            }
        }

        server.connection.destroy();

        server.audioPlayer.stop();

        interaction.reply(replyArr[Math.floor(Math.random() * replyArr.length)]);

        serverMap.delete(interaction.guild.id);
    }
}
