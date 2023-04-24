module.exports = async function deleteNowPlaying(server) {
    if (server.audioStatus == 'playing') {
        await server.nowPlaying.delete();
    }
}
