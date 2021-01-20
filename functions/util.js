const axios = require('axios');

module.exports = {
    name: 'util',
    description: 'Send hello gifs',
    execute(message, args) {
        if (args.length === 0 || args.length !== 0 && args[0] === 'hi' || args[0] === 'hello') {
            const responseArr = ['hello', 'hi', 'how are ya', 'how\'s it going', 'what\'s up'];
    
            axios.get(`http://api.giphy.com/v1/gifs/search?q=${responseArr[Math.floor(Math.random() * responseArr.length)]}&api_key=${process.env.giphy}&limit=1`)
                .then(response => {
                    message.channel.send(response.data.data[0].url);
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (args.length <= 2 && args[0] === 'help') {
            // Help function to go here
        }

    }
}
