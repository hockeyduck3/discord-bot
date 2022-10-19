module.exports = async function deleteNowPlaying(server) {
    try {
        await server.nowPlaying.delete();
    } catch (err) {
        console.log(err);
    }
}
