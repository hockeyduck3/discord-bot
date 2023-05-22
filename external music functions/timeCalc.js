module.exports = {
    convertMilli: function (milli) {
        const seconds = Math.floor(milli / 1000);

        return seconds;
    },

    durationCalc: function (videoDuration) {
        let minutes = Math.floor(videoDuration / 60);
        let seconds = videoDuration % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds

        return `${minutes}:${seconds}`
    }
}
