const { SlashCommandBuilder } = require('@discordjs/builders');

const answerArr = [
    'I flipped a coin and got',
    'It\'s',
    'Guess what? It\'s',
    'I gotchu fam! It\'s',
    'The coin has spoken! It\'s',
    'The coin has decided! It\'s',
    'I heard you like to flip coins? Well the coin I just flipped came up as',
    'So I flipped the coin and got',
    'WOOOOOOWWWWWW! GUESS WHAT??? It\'s',
    'But did you know that it\'s',
    'I believe that it\'s',
    'I\'M SOOOO SORRY! It\'s'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Ask me to flip a coin 😁🪙'),

    async execute (interaction) {
        const num = Math.floor(Math.random() * 2);

        let result;

        console.log(num);

        if (num % 2 === 1) {
            result = 'heads';
        } else {
            result = 'tails';
        }

        interaction.reply(`${answerArr[Math.floor(Math.random() * answerArr.length)]} ${result}.`);
    }
}