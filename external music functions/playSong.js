const { EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus } = require('@discordjs/voice')
const ytdl = require('ytdl-core');

const leaveTimer = require('./leaveTimer');
const deleteNowPlaying = require('./deleteNowPlaying');

const nowPlayingEmoji = ['🎧', '🎶', '🎵', '🎸', '🎷', '🎺', '🔊', '🎤'];

const { serverMap } = require('./serverMap');

module.exports = async function playSong(guildId, song) {
    const server = serverMap.get(guildId);
            
            server.currentSong = song;

            server.songArray.shift();

            if (!song) {
                server.connection.destroy();
                serverMap.delete(guildId);
                return;
            } else {
                server.audioPlayer = createAudioPlayer();

                const stream = ytdl(song.link, {filter: 'audioonly', quality: 'lowestaudio', highWaterMark: 1<<25}).on('error', err => {
                    console.log(err);
                    server.text.send('There was an error with that stream');
                    server.connection.destroy();
                    serverMap.delete(guildId);
                });

                server.resource = createAudioResource(stream, { inlineVolume: true, inputType: StreamType.Arbitrary });

                server.audioPlayer.play(server.resource);
                server.audioStatus = 'playing';

                try {
                    await entersState(server.connection, VoiceConnectionStatus.Ready, 30_000);
                    server.connection.subscribe(server.audioPlayer);
                } catch (err) {
                    server.connection.destroy();
                    throw err
                }

                server.resource.playStream
                    .on('end', async () => {
                        if (server.songArray.length == 0) {
                            deleteNowPlaying(server);

                            server.audioStatus = 'stopped';

                            leaveTimer(server, guildId);
                        } else {
                            deleteNowPlaying(server);

                            server.prevSong = server.currentSong;
                            server.previousSongs.unshift(server.prevSong);

                            if (server.loop) {
                                server.songArray.push(server.prevSong);
                                server.previousSongs.pop();
                            }

                            playSong(guildId, server.songArray[0]);

                            if (server.prevCalled) {
                                server.previousSongs.shift();
                                server.prevCalled = false;
                            }
                        }
                    })
            }

            const nowPlaying = new EmbedBuilder()
                    .setColor([255, 0, 255])
                    .setAuthor({
                        name: 'Tilly Music Player',
                        iconURL: 'https://i.pinimg.com/474x/80/3a/1f/803a1f2849f12dde465ab9143f50187e.jpg'
                    })
                    .setDescription(`Now playing [${song.title}](${song.link})   ${nowPlayingEmoji[Math.floor(Math.random() * nowPlayingEmoji.length)]}`)
                    .setThumbnail(song.thumbnail)

            server.nowPlaying = await server.text.send({
                embeds: [nowPlaying]
            });
}