const axios = require('axios');

module.exports = {
    name: ['dad', 'dadjoke'],
    description: 'Send back a random dad joke',
    execute(bot, message) {
        axios({
            method: 'get',
            url: 'https://icanhazdadjoke.com/',
            headers: {
                accept: 'application/json',
                'User-Agent': 'axios 0.21.1'
            }
        }).then(response => {
            message.reply(response.data.joke);
        }).catch(err => {
            console.log(err);
            message.reply('Looks like there was an error with that request. Please try again later');
        });
    }
}
