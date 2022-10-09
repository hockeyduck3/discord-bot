const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const { youtube } = require('scrape-youtube');

const serverMap = new Map();

module.exports = {
    queue: serverMap,
    data: new SlashCommandBuilder()
            .setName('play')
            .setDescription('play a song')
            .addStringOption(song => 
                song.setName('song')
                    .setDescription('Give me a song name or a Youtube link to play')
                    .setRequired(true)    
            ),
        

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        const song = interaction.options.getString('song');

        if (!vc) return interaction.reply({
            content: 'You gotta be in a voice channel',
            ephemeral: true
        });

        let queue = serverMap.get(interaction.guild.id);

        if (!queue){
            const songObj = {
                voice: vc,
                connection: null,
                text: interaction.channel,
                currentSong: null,
                songArray: [],
                previousSongs: [],
                prevSong: null,
                prevCalled: false,
                stopCalled: false
            };

            serverMap.set(interaction.guild.id, songObj);

            interaction.reply({
                content: 'There was no queue for this server but I made one',
                ephemeral: true
            });
        } else {
            interaction.reply({
                content: 'Look in the console for the queue',
                ephemeral: true
            });

            console.log(queue)
        }
    }
}