const axios = require('axios');

module.exports = {
    name: ['dad', 'dadjoke'],
    description: 'Send back a random dad joke',
    execute(message) {
        axios({
            method: 'get',
            url: 'https://icanhazdadjoke.com/',
            headers: {
                accept: 'application/json'
            }
        }).then(response => {
            message.reply(response.data.joke);
        }).catch(err => {
            console.log(err);
            message.reply('Looks like there was an error with that request. Please try again later');
        });
    }
}
