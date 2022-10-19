const { SlashCommandBuilder } = require('@discordjs/builders');

const { serverMap } = require('../../external music functions/serverMap');

let queueArr = [];
let queueArrNum = 0;

function makeQueue(server) {
    if(server.currentSong != null) {
        queueArr.push({name: '\u200B', value: `Current Song: [${server.currentSong.title}](${server.currentSong.link})`})
    }

    for (let i = 0; i < server.songArray.length; i++) {
        if (i != 10) {
            queueArr.push({name: '\u200B', value: `${i+1}) [${server.songArray[i].title}](${server.songArray[i].link})`});
        } else {
            queueArrNum = server.songArray.length - 10;
            break;
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('queue')
            .setDescription('View the current song queue')
            .addBooleanOption(option =>
                option.setName('public')
                    .setDescription('Would you like to make this queue public for the whole channel to see?')
            ),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        let server = serverMap.get(interaction.guild.id);

        let option = interaction.options.getBoolean('public');

        if (!vc) return interaction.reply({
            content: 'You gotta be in a voice channel',
            ephemeral: true
        });

        if (!server) return interaction.reply({
            content: 'Nothing\'s playing right meow',
            ephemeral: true
        });

        if (server.songArray.length == 0 && server.prevSong == null) return interaction.reply({
            content: 'There\'s currently nothing in your song history or in your song queue',
            ephemeral: true
        });

        if (server.prevSong != null && server.previousSongs[0] != server.songArray[0] && server.previousSongs.length != 0) {
            queueArr.push({name: '\u200B', value: `Previous Song: [${server.previousSongs[0].title}](${server.previousSongs[0].link})`})
        }

        if (server.songArray.length != 0) {
            makeQueue(server);
        } else {
            queueArr.push({name: '\u200B', value: `Current Song: [${server.currentSong.title}](${server.currentSong.link})`})
        }

        const embedMessage = {
            color: 0x32ff96,
            author: {
                name: 'Tilly Music Player: Song Queue',
                iconURL: 'https://i.pinimg.com/474x/80/3a/1f/803a1f2849f12dde465ab9143f50187e.jpg'
            },
            fields: [],
            footer: {
                text: (server.loop ? 'Queue Looping: ON' : 'Queue Looping: OFF')
            }
        };

        queueArr.forEach(e => {
            embedMessage.fields.push(e);
        });

        if (queueArrNum != 0) {
            embedMessage.fields.push({ name: '\u200B', value: `and ${queueArrNum} more songs`});
            queueArrNum = 0;
        }

        embedMessage.fields.push({ name: '\u200B', value: '\u200B'});

        if (option == null) {
            option = true
        } else {
            option = false
        }

        interaction.reply({
            embeds: [embedMessage],
            ephemeral: option
        });

        queueArr = [];
    }
}