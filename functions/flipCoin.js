module.exports = {
    name: 'flip',
    description: 'Flip a coin',
    execute(message) {
        const num = Math.floor(Math.random() * 5);

        let result;

        if (num % 2 === 1) {
            result = 'heads';
        } else {
            result = 'tails';
        }

        const answerArr = [
            'I flipped a coin and got',
            'It\'s',
            'Guess what? It\'s',
            'I gotchu fam! It\'s',
            'The coin has spoken! It\'s',
            'The coin has decided! It has chosen',
            'I heard you like to flip coins? Well the coin I just flipped came up as',
            'So I flipped the coin and got'
        ];

        message.reply(`${answerArr[Math.floor(Math.random() * answerArr.length)]} ${result}.`);
    }
}
